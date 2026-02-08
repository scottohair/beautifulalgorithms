import { Router, type Request, type Response } from 'express';
import { FigmaClient, FigmaApiError } from '../services/figma-client.js';
import { CanvaClient, CanvaApiError } from '../services/canva-client.js';
import {
  extractTokensFromFile,
  tokensToStyleDictionaryFormat,
  flattenTokenSet,
} from '../services/token-extractor.js';
import { SvgExporter } from '../services/svg-exporter.js';

// -------------------------------------------------------------------
// Validation helpers
// -------------------------------------------------------------------

const FIGMA_FILE_ID_RE = /^[a-zA-Z0-9]{22,}$/;
const FIGMA_NODE_ID_RE = /^[\d]+:[\d]+$/;

/** Safely extract a route param as a string (Express 5 types params as string | string[]). */
function param(req: Request, name: string): string {
  const val = req.params[name];
  return Array.isArray(val) ? val[0] : (val ?? '');
}

function isValidFileId(id: string): boolean {
  return typeof id === 'string' && FIGMA_FILE_ID_RE.test(id);
}

function isValidNodeId(id: string): boolean {
  return typeof id === 'string' && FIGMA_NODE_ID_RE.test(id);
}

/** Map known service errors to HTTP status codes. */
function errorToStatus(err: unknown): number {
  if (err instanceof FigmaApiError) {
    if (err.statusCode === 404) return 404;
    if (err.statusCode === 403) return 403;
    if (err.statusCode === 429) return 429;
    return 502; // upstream error
  }
  if (err instanceof CanvaApiError) {
    if (err.statusCode === 404) return 404;
    if (err.statusCode === 403) return 403;
    return 502;
  }
  return 500;
}

function errorBody(err: unknown): { error: string; code?: number } {
  if (err instanceof FigmaApiError || err instanceof CanvaApiError) {
    return {
      error: err.message,
      code: err.statusCode,
    };
  }
  return { error: err instanceof Error ? err.message : String(err) };
}

// -------------------------------------------------------------------
// Router factory
// -------------------------------------------------------------------

export function createApiRouter(
  figmaClient: FigmaClient | null,
  canvaClient: CanvaClient | null,
) {
  const router = Router();

  // ----------------------------------------------------------------
  // Health
  // ----------------------------------------------------------------

  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      services: {
        figma: !!figmaClient,
        canva: !!canvaClient,
      },
    });
  });

  // ----------------------------------------------------------------
  // Figma: get a specific frame / node
  // ----------------------------------------------------------------

  router.get(
    '/figma/frame/:fileId/:nodeId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      const nodeId = param(req, 'nodeId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }
      if (!isValidNodeId(nodeId)) {
        res.status(400).json({ error: `Invalid nodeId format (expected "N:N"): ${nodeId}` });
        return;
      }

      try {
        const node = await figmaClient.getNode(fileId, nodeId);
        res.json(node);
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Figma: extract design tokens
  // ----------------------------------------------------------------

  router.get(
    '/figma/tokens/:fileId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }

      try {
        const file = await figmaClient.getFile(fileId);
        const tokens = extractTokensFromFile(file);
        const format = req.query.format as string | undefined;

        if (format === 'style-dictionary') {
          res.json(tokensToStyleDictionaryFormat(tokens));
        } else if (format === 'flat') {
          res.json(flattenTokenSet(tokens));
        } else {
          res.json(tokens);
        }
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Figma: list published components
  // ----------------------------------------------------------------

  router.get(
    '/figma/components/:fileId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }

      try {
        const result = await figmaClient.getFileComponents(fileId);
        res.json(result);
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Figma: list published styles
  // ----------------------------------------------------------------

  router.get(
    '/figma/styles/:fileId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }

      try {
        const result = await figmaClient.getFileStyles(fileId);
        res.json(result);
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Figma: export SVG (or other format)
  // ----------------------------------------------------------------

  router.get(
    '/figma/export/:fileId/:nodeId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      const nodeId = param(req, 'nodeId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }
      if (!isValidNodeId(nodeId)) {
        res.status(400).json({ error: `Invalid nodeId format (expected "N:N"): ${nodeId}` });
        return;
      }

      const scale = parseFloat((req.query.scale as string) || '1');
      if (isNaN(scale) || scale <= 0 || scale > 4) {
        res.status(400).json({ error: 'scale must be between 0 and 4' });
        return;
      }

      const format = (req.query.format as string) || 'svg';
      if (!['svg', 'png', 'jpg', 'pdf'].includes(format)) {
        res.status(400).json({ error: `Unsupported format: ${format}. Use svg, png, jpg, or pdf.` });
        return;
      }

      try {
        const exporter = new SvgExporter(figmaClient);
        const data = await exporter.exportFrame(fileId, nodeId, {
          scale,
          format: format as 'svg' | 'png' | 'pdf' | 'jpg',
          svgIncludeId: req.query.includeIds === 'true',
        });

        if (format === 'svg') {
          res.type('image/svg+xml').send(data);
        } else if (format === 'png') {
          res.type('image/png').send(Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64'));
        } else if (format === 'jpg') {
          res.type('image/jpeg').send(Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64'));
        } else {
          res.type('application/pdf').send(Buffer.from(data.replace(/^data:[^;]+;base64,/, ''), 'base64'));
        }
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Figma: export all components
  // ----------------------------------------------------------------

  router.get(
    '/figma/export-components/:fileId',
    async (req: Request, res: Response) => {
      if (!figmaClient) {
        res.status(503).json({ error: 'Figma client not configured' });
        return;
      }

      const fileId = param(req, 'fileId');
      if (!isValidFileId(fileId)) {
        res.status(400).json({ error: `Invalid fileId: ${fileId}` });
        return;
      }

      try {
        const exporter = new SvgExporter(figmaClient);
        const results = await exporter.exportAllComponents(fileId);
        const out: Record<string, { nodeId: string; name?: string; svg: string }> = {};
        for (const [key, result] of results) {
          out[key] = {
            nodeId: result.nodeId,
            name: result.name,
            svg: result.data as string,
          };
        }
        res.json({ components: out });
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Canva: get design
  // ----------------------------------------------------------------

  router.get(
    '/canva/design/:designId',
    async (req: Request, res: Response) => {
      if (!canvaClient) {
        res.status(503).json({ error: 'Canva client not configured' });
        return;
      }

      const designId = param(req, 'designId');
      if (!designId || designId.length < 5) {
        res.status(400).json({ error: 'Invalid designId' });
        return;
      }

      try {
        const design = await canvaClient.getDesign(designId);
        res.json(design);
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Canva: get design pages
  // ----------------------------------------------------------------

  router.get(
    '/canva/design/:designId/pages',
    async (req: Request, res: Response) => {
      if (!canvaClient) {
        res.status(503).json({ error: 'Canva client not configured' });
        return;
      }

      const designId = param(req, 'designId');
      if (!designId || designId.length < 5) {
        res.status(400).json({ error: 'Invalid designId' });
        return;
      }

      try {
        const pages = await canvaClient.getDesignPages(designId);
        res.json({ pages });
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  // ----------------------------------------------------------------
  // Canva: list designs
  // ----------------------------------------------------------------

  router.get(
    '/canva/designs',
    async (_req: Request, res: Response) => {
      if (!canvaClient) {
        res.status(503).json({ error: 'Canva client not configured' });
        return;
      }

      try {
        const result = await canvaClient.listDesigns();
        res.json(result);
      } catch (err) {
        res.status(errorToStatus(err)).json(errorBody(err));
      }
    },
  );

  return router;
}
