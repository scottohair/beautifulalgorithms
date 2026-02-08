import type { CanvaDesign, CanvaPage } from '../types/index.js';

export class CanvaClient {
  private baseUrl = 'https://api.canva.com/rest/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // -------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new CanvaApiError(response.status, text, url);
    }

    return response.json() as Promise<T>;
  }

  // -------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------

  /** Retrieve a single design by id. */
  async getDesign(designId: string): Promise<CanvaDesign> {
    const data = await this.request<{ design: CanvaDesign }>(
      `/designs/${designId}`,
    );
    return data.design;
  }

  /** List pages within a design. */
  async getDesignPages(designId: string): Promise<CanvaPage[]> {
    const data = await this.request<{ items: CanvaPage[] }>(
      `/designs/${designId}/pages`,
    );
    return data.items ?? [];
  }

  /** List designs owned by the authenticated user.
   *  Supports cursor-based pagination.
   */
  async listDesigns(
    opts: { continuation?: string; limit?: number } = {},
  ): Promise<{ items: CanvaDesign[]; continuation?: string }> {
    const params = new URLSearchParams();
    if (opts.continuation) params.set('continuation', opts.continuation);
    if (opts.limit) params.set('limit', String(opts.limit));
    const qs = params.toString();
    return this.request<{ items: CanvaDesign[]; continuation?: string }>(
      `/designs${qs ? `?${qs}` : ''}`,
    );
  }

  /** Create an export job for a design and return the job id.
   *  The caller is expected to poll getExportJob until the job completes.
   */
  async createExportJob(
    designId: string,
    format: 'pdf' | 'png' | 'jpg' | 'pptx' = 'png',
    pages?: number[],
  ): Promise<{ job: { id: string; status: string } }> {
    const body: Record<string, unknown> = {
      design_id: designId,
      format,
    };
    if (pages && pages.length > 0) {
      body.pages = pages;
    }
    return this.request<{ job: { id: string; status: string } }>(
      '/exports',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  }

  /** Poll an export job status. */
  async getExportJob(
    jobId: string,
  ): Promise<{ job: { id: string; status: string; urls?: string[] } }> {
    return this.request<{
      job: { id: string; status: string; urls?: string[] };
    }>(`/exports/${jobId}`);
  }

  /** Convenience: create an export and poll until it finishes (up to timeout). */
  async exportDesign(
    designId: string,
    format: 'pdf' | 'png' | 'jpg' | 'pptx' = 'png',
    timeoutMs = 60_000,
  ): Promise<string[]> {
    const { job } = await this.createExportJob(designId, format);
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const { job: status } = await this.getExportJob(job.id);
      if (status.status === 'success' && status.urls) {
        return status.urls;
      }
      if (status.status === 'failed') {
        throw new Error(`Canva export job ${job.id} failed`);
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    throw new Error(`Canva export job ${job.id} timed out after ${timeoutMs}ms`);
  }
}

// -------------------------------------------------------------------
// Custom error class
// -------------------------------------------------------------------

export class CanvaApiError extends Error {
  public readonly statusCode: number;
  public readonly responseBody: string;
  public readonly requestUrl: string;

  constructor(statusCode: number, body: string, url: string) {
    super(`Canva API ${statusCode}: ${body.slice(0, 200)}`);
    this.name = 'CanvaApiError';
    this.statusCode = statusCode;
    this.responseBody = body;
    this.requestUrl = url;
  }
}
