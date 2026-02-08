import type { FigmaFile, FigmaNode, FigmaComponent, FigmaStyle } from '../types/index.js';

export class FigmaClient {
  private baseUrl = 'https://api.figma.com/v1';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Figma-Token': this.token,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Figma API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  async getFile(fileId: string): Promise<FigmaFile> {
    return this.request<FigmaFile>(`/files/${fileId}`);
  }

  async getFileStyles(fileId: string): Promise<{ styles: FigmaStyle[] }> {
    const file = await this.getFile(fileId);
    return { styles: Object.values(file.styles || {}) };
  }

  async getFileComponents(fileId: string): Promise<{ components: FigmaComponent[] }> {
    const file = await this.getFile(fileId);
    return { components: Object.values(file.components || {}) };
  }

  async getNode(fileId: string, nodeId: string): Promise<FigmaNode> {
    const data = await this.request<{ nodes: Record<string, { document: FigmaNode }> }>(
      `/files/${fileId}/nodes?ids=${encodeURIComponent(nodeId)}`
    );
    const node = data.nodes[nodeId];
    if (!node) throw new Error(`Node ${nodeId} not found`);
    return node.document;
  }

  async exportNode(fileId: string, nodeId: string, format: 'svg' | 'png' | 'pdf' = 'svg', scale = 1): Promise<string> {
    const data = await this.request<{ images: Record<string, string> }>(
      `/images/${fileId}?ids=${encodeURIComponent(nodeId)}&format=${format}&scale=${scale}`
    );
    const url = data.images[nodeId];
    if (!url) throw new Error(`Export failed for node ${nodeId}`);
    return url;
  }
}
