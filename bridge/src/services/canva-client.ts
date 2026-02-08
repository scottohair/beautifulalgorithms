import type { CanvaDesign } from '../types/index.js';

export class CanvaClient {
  private baseUrl = 'https://api.canva.com/rest/v1';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Canva API error ${response.status}: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  async getDesign(designId: string): Promise<CanvaDesign> {
    return this.request<CanvaDesign>(`/designs/${designId}`);
  }

  async listDesigns(): Promise<{ items: CanvaDesign[] }> {
    return this.request<{ items: CanvaDesign[] }>('/designs');
  }
}
