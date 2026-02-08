import { FigmaClient } from './figma-client.js';

export class SvgExporter {
  private client: FigmaClient;

  constructor(client: FigmaClient) {
    this.client = client;
  }

  async exportFrame(fileId: string, nodeId: string): Promise<string> {
    const imageUrl = await this.client.exportNode(fileId, nodeId, 'svg');
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch SVG: ${response.status}`);
    return response.text();
  }

  async exportMultiple(fileId: string, nodeIds: string[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    for (const nodeId of nodeIds) {
      const svg = await this.exportFrame(fileId, nodeId);
      results.set(nodeId, svg);
    }
    return results;
  }
}
