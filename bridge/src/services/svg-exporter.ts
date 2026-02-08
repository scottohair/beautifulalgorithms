import { FigmaClient } from './figma-client.js';
import type { SvgExportOptions, FigmaNode } from '../types/index.js';

export interface ExportResult {
  nodeId: string;
  name?: string;
  format: string;
  data: string | Buffer;
  url?: string;
}

export class SvgExporter {
  private client: FigmaClient;

  constructor(client: FigmaClient) {
    this.client = client;
  }

  // -------------------------------------------------------------------
  // Single-node export
  // -------------------------------------------------------------------

  /** Export a single frame/node as SVG text. */
  async exportFrame(
    fileId: string,
    nodeId: string,
    options: SvgExportOptions = {},
  ): Promise<string> {
    const scale = options.scale ?? 1;
    const format = options.format ?? 'svg';

    const imageUrl = await this.client.exportNode(fileId, nodeId, format, scale);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch exported image (${response.status}): ${response.statusText}`,
      );
    }

    if (format === 'svg') {
      let svg = await response.text();

      // Optionally strip Figma-generated IDs if not requested
      if (options.svgIncludeId === false) {
        svg = svg.replace(/\s+id="[^"]*"/g, '');
      }

      return svg;
    }

    // For raster formats, return the binary data as a base64 data URI
    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mime =
      format === 'png'
        ? 'image/png'
        : format === 'jpg'
          ? 'image/jpeg'
          : 'application/pdf';
    return `data:${mime};base64,${base64}`;
  }

  // -------------------------------------------------------------------
  // Batch export
  // -------------------------------------------------------------------

  /** Export multiple nodes. Returns a Map of nodeId -> SVG/data string. */
  async exportMultiple(
    fileId: string,
    nodeIds: string[],
    options: SvgExportOptions = {},
  ): Promise<Map<string, string>> {
    const scale = options.scale ?? 1;
    const format = options.format ?? 'svg';

    // Use the batch images endpoint for efficiency
    const imageUrls = await this.client.exportNodes(fileId, nodeIds, format, scale);

    const results = new Map<string, string>();

    // Fetch all image URLs in parallel (bounded concurrency)
    const concurrency = 5;
    const entries = Object.entries(imageUrls);

    for (let i = 0; i < entries.length; i += concurrency) {
      const batch = entries.slice(i, i + concurrency);
      const fetched = await Promise.all(
        batch.map(async ([id, url]) => {
          try {
            const resp = await fetch(url);
            if (!resp.ok) {
              console.warn(`[svg-exporter] Failed to fetch node ${id}: ${resp.status}`);
              return [id, ''] as const;
            }
            if (format === 'svg') {
              const text = await resp.text();
              return [id, text] as const;
            }
            const buf = await resp.arrayBuffer();
            return [id, Buffer.from(buf).toString('base64')] as const;
          } catch (err) {
            console.warn(`[svg-exporter] Error fetching node ${id}:`, err);
            return [id, ''] as const;
          }
        }),
      );

      for (const [id, data] of fetched) {
        if (data) results.set(id, data);
      }
    }

    return results;
  }

  // -------------------------------------------------------------------
  // Component-level export
  // -------------------------------------------------------------------

  /** Export all components from a file. Returns a map of componentKey -> SVG. */
  async exportAllComponents(
    fileId: string,
    options: SvgExportOptions = {},
  ): Promise<Map<string, ExportResult>> {
    const { components } = await this.client.getFileComponents(fileId);
    if (components.length === 0) {
      return new Map();
    }

    // Components have keys, but we need node IDs for the image export.
    // The component key in the file metadata corresponds to the node id in the document.
    // We'll fetch the file to map component keys to node ids.
    const file = await this.client.getFile(fileId);
    const componentNodeIds: Array<{ key: string; nodeId: string; name: string }> = [];

    for (const [nodeId, comp] of Object.entries(file.components)) {
      componentNodeIds.push({ key: comp.key, nodeId, name: comp.name });
    }

    if (componentNodeIds.length === 0) return new Map();

    const nodeIds = componentNodeIds.map((c) => c.nodeId);
    const svgMap = await this.exportMultiple(fileId, nodeIds, options);

    const results = new Map<string, ExportResult>();
    for (const comp of componentNodeIds) {
      const data = svgMap.get(comp.nodeId);
      if (data) {
        results.set(comp.key, {
          nodeId: comp.nodeId,
          name: comp.name,
          format: options.format ?? 'svg',
          data,
        });
      }
    }

    return results;
  }

  // -------------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------------

  /** Collect all node IDs of FRAME or COMPONENT type within a subtree. */
  static collectExportableNodeIds(node: FigmaNode): string[] {
    const ids: string[] = [];
    const exportableTypes = new Set([
      'FRAME',
      'COMPONENT',
      'COMPONENT_SET',
      'INSTANCE',
      'GROUP',
    ]);

    function walk(n: FigmaNode): void {
      if (exportableTypes.has(n.type)) {
        ids.push(n.id);
      }
      if (n.children) {
        for (const child of n.children) {
          walk(child);
        }
      }
    }

    walk(node);
    return ids;
  }
}
