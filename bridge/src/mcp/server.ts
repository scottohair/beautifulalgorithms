import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { FigmaClient } from '../services/figma-client.js';
import { CanvaClient } from '../services/canva-client.js';
import { SvgExporter } from '../services/svg-exporter.js';
import {
  extractTokensFromFile,
  extractTokensFromNode,
  tokensToStyleDictionaryFormat,
  flattenTokenSet,
} from '../services/token-extractor.js';

// -------------------------------------------------------------------
// Initialize clients from environment
// -------------------------------------------------------------------

function createFigmaClient(): FigmaClient | null {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  return token ? new FigmaClient(token) : null;
}

function createCanvaClient(): CanvaClient | null {
  const key = process.env.CANVA_API_KEY;
  return key ? new CanvaClient(key) : null;
}

// -------------------------------------------------------------------
// MCP Server setup
// -------------------------------------------------------------------

export async function startMcpServer(): Promise<void> {
  const figmaClient = createFigmaClient();
  const canvaClient = createCanvaClient();

  const server = new McpServer({
    name: 'aesthetic-algorithm-bridge',
    version: '1.0.0',
  });

  // ----------------------------------------------------------------
  // Tool: get_figma_frame
  // ----------------------------------------------------------------

  server.tool(
    'get_figma_frame',
    'Get a specific frame or component node from a Figma file by file ID and node ID. Returns the full node tree for that frame.',
    {
      fileId: z.string().describe('The Figma file key (from the file URL)'),
      nodeId: z.string().describe('The node ID in "N:N" format (e.g. "12:34")'),
    },
    async ({ fileId, nodeId }) => {
      if (!figmaClient) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Figma client not configured. Set FIGMA_ACCESS_TOKEN environment variable.',
            },
          ],
        };
      }

      try {
        const node = await figmaClient.getNode(fileId, nodeId);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(node, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching frame: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // ----------------------------------------------------------------
  // Tool: extract_design_tokens
  // ----------------------------------------------------------------

  server.tool(
    'extract_design_tokens',
    'Extract design tokens (colors, typography, spacing, effects, border radii) from a Figma file. Returns structured token data compatible with Style Dictionary.',
    {
      fileId: z.string().describe('The Figma file key'),
      format: z
        .enum(['structured', 'style-dictionary', 'flat'])
        .optional()
        .default('structured')
        .describe('Output format: "structured" (grouped by type), "style-dictionary" (nested SD format), or "flat" (array)'),
      nodeId: z
        .string()
        .optional()
        .describe('Optional node ID to scope extraction to a subtree'),
    },
    async ({ fileId, format, nodeId }) => {
      if (!figmaClient) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Figma client not configured. Set FIGMA_ACCESS_TOKEN environment variable.',
            },
          ],
        };
      }

      try {
        let tokens;

        if (nodeId) {
          const node = await figmaClient.getNode(fileId, nodeId);
          tokens = extractTokensFromNode(node);
        } else {
          const file = await figmaClient.getFile(fileId);
          tokens = extractTokensFromFile(file);
        }

        let output: unknown;
        if (format === 'style-dictionary') {
          output = tokensToStyleDictionaryFormat(tokens);
        } else if (format === 'flat') {
          output = flattenTokenSet(tokens);
        } else {
          output = tokens;
        }

        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(output, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error extracting tokens: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // ----------------------------------------------------------------
  // Tool: get_figma_components
  // ----------------------------------------------------------------

  server.tool(
    'get_figma_components',
    'List all published components in a Figma file. Returns component names, keys, descriptions, and set memberships.',
    {
      fileId: z.string().describe('The Figma file key'),
    },
    async ({ fileId }) => {
      if (!figmaClient) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Figma client not configured. Set FIGMA_ACCESS_TOKEN environment variable.',
            },
          ],
        };
      }

      try {
        const result = await figmaClient.getFileComponents(fileId);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching components: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // ----------------------------------------------------------------
  // Tool: export_figma_svg
  // ----------------------------------------------------------------

  server.tool(
    'export_figma_svg',
    'Export a Figma node as SVG (or PNG/JPG/PDF). Returns the SVG markup or a base64-encoded data URI for raster formats.',
    {
      fileId: z.string().describe('The Figma file key'),
      nodeId: z.string().describe('The node ID to export (e.g. "12:34")'),
      format: z
        .enum(['svg', 'png', 'jpg', 'pdf'])
        .optional()
        .default('svg')
        .describe('Export format'),
      scale: z
        .number()
        .min(0.01)
        .max(4)
        .optional()
        .default(1)
        .describe('Scale factor (0.01-4)'),
    },
    async ({ fileId, nodeId, format, scale }) => {
      if (!figmaClient) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Figma client not configured. Set FIGMA_ACCESS_TOKEN environment variable.',
            },
          ],
        };
      }

      try {
        const exporter = new SvgExporter(figmaClient);
        const data = await exporter.exportFrame(fileId, nodeId, {
          format,
          scale,
        });

        return {
          content: [
            {
              type: 'text' as const,
              text: data,
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error exporting node: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // ----------------------------------------------------------------
  // Tool: get_canva_design
  // ----------------------------------------------------------------

  server.tool(
    'get_canva_design',
    'Get metadata for a Canva design by its design ID.',
    {
      designId: z.string().describe('The Canva design ID'),
    },
    async ({ designId }) => {
      if (!canvaClient) {
        return {
          content: [
            {
              type: 'text' as const,
              text: 'Error: Canva client not configured. Set CANVA_API_KEY environment variable.',
            },
          ],
        };
      }

      try {
        const design = await canvaClient.getDesign(designId);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(design, null, 2),
            },
          ],
        };
      } catch (err) {
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error fetching Canva design: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    },
  );

  // ----------------------------------------------------------------
  // Connect via stdio transport
  // ----------------------------------------------------------------

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Log to stderr so we don't interfere with the stdio JSON-RPC channel
  console.error('[mcp] Aesthetic Algorithm bridge MCP server running on stdio');
  console.error(`[mcp] Figma: ${figmaClient ? 'configured' : 'not configured'}`);
  console.error(`[mcp] Canva: ${canvaClient ? 'configured' : 'not configured'}`);
}
