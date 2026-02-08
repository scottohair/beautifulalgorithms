import type {
  FigmaFile,
  FigmaNode,
  FigmaComponent,
  FigmaStyle,
} from '../types/index.js';

/** Figma API rate-limit: 30 req / min for personal tokens.
 *  We track remaining capacity from response headers and sleep when needed.
 */
interface RateLimitState {
  remaining: number;
  resetAt: number; // unix ms
}

export class FigmaClient {
  private baseUrl = 'https://api.figma.com/v1';
  private token: string;
  private rateLimit: RateLimitState = { remaining: 30, resetAt: 0 };

  constructor(token: string) {
    this.token = token;
  }

  // -------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------

  /** Wait if we are near the rate limit ceiling. */
  private async respectRateLimit(): Promise<void> {
    if (this.rateLimit.remaining <= 1 && Date.now() < this.rateLimit.resetAt) {
      const waitMs = this.rateLimit.resetAt - Date.now() + 200; // add small buffer
      console.warn(`[figma-client] Rate limit approaching, sleeping ${waitMs}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }

  /** Parse Figma rate-limit headers and update local state. */
  private updateRateLimitState(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');

    if (remaining !== null) {
      this.rateLimit.remaining = parseInt(remaining, 10);
    }
    if (reset !== null) {
      this.rateLimit.resetAt = parseInt(reset, 10) * 1000; // seconds -> ms
    }
  }

  /** Perform an authenticated GET against the Figma API.
   *  Automatically retries once on 429 after waiting for the reset window.
   */
  private async request<T>(endpoint: string, retries = 1): Promise<T> {
    await this.respectRateLimit();

    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: { 'X-Figma-Token': this.token },
    });

    this.updateRateLimitState(response.headers);

    // Handle 429 Too Many Requests
    if (response.status === 429 && retries > 0) {
      const retryAfter = response.headers.get('retry-after');
      const waitSec = retryAfter ? parseInt(retryAfter, 10) : 30;
      console.warn(`[figma-client] 429 received, retrying after ${waitSec}s`);
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      return this.request<T>(endpoint, retries - 1);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new FigmaApiError(response.status, text, url);
    }

    return response.json() as Promise<T>;
  }

  // -------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------

  /** Retrieve the full Figma file (document tree + metadata). */
  async getFile(fileId: string): Promise<FigmaFile> {
    return this.request<FigmaFile>(`/files/${fileId}`);
  }

  /** Retrieve the file with optional geometry and depth params. */
  async getFileWithOptions(
    fileId: string,
    opts: { depth?: number; geometry?: 'paths'; nodeId?: string } = {},
  ): Promise<FigmaFile> {
    const params = new URLSearchParams();
    if (opts.depth !== undefined) params.set('depth', String(opts.depth));
    if (opts.geometry) params.set('geometry', opts.geometry);
    if (opts.nodeId) params.set('node-id', opts.nodeId);
    const qs = params.toString();
    return this.request<FigmaFile>(`/files/${fileId}${qs ? `?${qs}` : ''}`);
  }

  /** Return published styles for a file. */
  async getFileStyles(fileId: string): Promise<{ styles: FigmaStyle[] }> {
    const data = await this.request<{ meta: { styles: FigmaStyle[] } }>(
      `/files/${fileId}/styles`,
    );
    return { styles: data.meta?.styles ?? [] };
  }

  /** Return published components for a file. */
  async getFileComponents(fileId: string): Promise<{ components: FigmaComponent[] }> {
    const data = await this.request<{ meta: { components: FigmaComponent[] } }>(
      `/files/${fileId}/components`,
    );
    return { components: data.meta?.components ?? [] };
  }

  /** Fetch images (render export) for one or more nodes.
   *  The Figma images endpoint accepts comma-separated ids.
   */
  async getFileImages(
    fileId: string,
    nodeIds: string[],
    opts: { format?: 'svg' | 'png' | 'jpg' | 'pdf'; scale?: number } = {},
  ): Promise<Record<string, string | null>> {
    const ids = nodeIds.map((id) => encodeURIComponent(id)).join(',');
    const format = opts.format ?? 'svg';
    const scale = opts.scale ?? 1;
    const data = await this.request<{ images: Record<string, string | null> }>(
      `/images/${fileId}?ids=${ids}&format=${format}&scale=${scale}`,
    );
    return data.images;
  }

  /** Retrieve a specific node by id. */
  async getNode(fileId: string, nodeId: string): Promise<FigmaNode> {
    const data = await this.request<{
      nodes: Record<string, { document: FigmaNode } | null>;
    }>(`/files/${fileId}/nodes?ids=${encodeURIComponent(nodeId)}`);

    const entry = data.nodes[nodeId];
    if (!entry) throw new Error(`Node ${nodeId} not found in file ${fileId}`);
    return entry.document;
  }

  /** Retrieve multiple nodes in a single request (comma-separated). */
  async getNodes(
    fileId: string,
    nodeIds: string[],
  ): Promise<Record<string, FigmaNode>> {
    const ids = nodeIds.map((id) => encodeURIComponent(id)).join(',');
    const data = await this.request<{
      nodes: Record<string, { document: FigmaNode } | null>;
    }>(`/files/${fileId}/nodes?ids=${ids}`);

    const result: Record<string, FigmaNode> = {};
    for (const [id, entry] of Object.entries(data.nodes)) {
      if (entry) result[id] = entry.document;
    }
    return result;
  }

  /** Export a single node as an image URL. */
  async exportNode(
    fileId: string,
    nodeId: string,
    format: 'svg' | 'png' | 'pdf' | 'jpg' = 'svg',
    scale = 1,
  ): Promise<string> {
    const images = await this.getFileImages(fileId, [nodeId], { format, scale });
    const url = images[nodeId];
    if (!url) throw new Error(`Export failed for node ${nodeId}`);
    return url;
  }

  /** Export multiple nodes; returns a map of nodeId -> image URL. */
  async exportNodes(
    fileId: string,
    nodeIds: string[],
    format: 'svg' | 'png' | 'pdf' | 'jpg' = 'svg',
    scale = 1,
  ): Promise<Record<string, string>> {
    // Figma images endpoint supports batching up to ~500 ids.
    // We chunk to 100 to be safe.
    const chunkSize = 100;
    const result: Record<string, string> = {};

    for (let i = 0; i < nodeIds.length; i += chunkSize) {
      const chunk = nodeIds.slice(i, i + chunkSize);
      const images = await this.getFileImages(fileId, chunk, { format, scale });
      for (const [id, url] of Object.entries(images)) {
        if (url) result[id] = url;
      }
    }

    return result;
  }

  /** List comments on a file (paginated). */
  async getComments(
    fileId: string,
    opts: { after?: string } = {},
  ): Promise<{ comments: unknown[] }> {
    const params = new URLSearchParams();
    if (opts.after) params.set('after', opts.after);
    const qs = params.toString();
    return this.request(`/files/${fileId}/comments${qs ? `?${qs}` : ''}`);
  }

  /** List file versions (paginated via cursor). */
  async getVersions(
    fileId: string,
    opts: { cursor?: string; pageSize?: number } = {},
  ): Promise<{ versions: unknown[]; pagination: { next_page?: string } }> {
    const params = new URLSearchParams();
    if (opts.cursor) params.set('before', opts.cursor);
    if (opts.pageSize) params.set('page_size', String(opts.pageSize));
    const qs = params.toString();
    return this.request(`/files/${fileId}/versions${qs ? `?${qs}` : ''}`);
  }
}

// -------------------------------------------------------------------
// Custom error class
// -------------------------------------------------------------------

export class FigmaApiError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: string;
  public readonly requestUrl: string;

  constructor(statusCode: number, body: string, url: string) {
    super(`Figma API ${statusCode}: ${body.slice(0, 200)}`);
    this.name = 'FigmaApiError';
    this.statusCode = statusCode;
    this.responseBody = body;
    this.requestUrl = url;
  }
}
