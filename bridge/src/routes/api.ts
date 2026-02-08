import { Router, type Request, type Response } from 'express';
import { FigmaClient } from '../services/figma-client.js';
import { CanvaClient } from '../services/canva-client.js';
import { extractTokensFromFile, tokensToStyleDictionaryFormat } from '../services/token-extractor.js';
import { SvgExporter } from '../services/svg-exporter.js';

export function createApiRouter(figmaClient: FigmaClient | null, canvaClient: CanvaClient | null) {
  const router = Router();

  // Health check
  router.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      services: {
        figma: !!figmaClient,
        canva: !!canvaClient,
      },
    });
  });

  // Get Figma frame
  router.get('/figma/frame/:fileId/:nodeId', async (req: Request, res: Response) => {
    if (!figmaClient) {
      res.status(503).json({ error: 'Figma client not configured' });
      return;
    }
    try {
      const node = await figmaClient.getNode(req.params.fileId, req.params.nodeId);
      res.json(node);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Extract design tokens from Figma file
  router.get('/figma/tokens/:fileId', async (req: Request, res: Response) => {
    if (!figmaClient) {
      res.status(503).json({ error: 'Figma client not configured' });
      return;
    }
    try {
      const file = await figmaClient.getFile(req.params.fileId);
      const tokens = extractTokensFromFile(file);
      const format = req.query.format;
      if (format === 'style-dictionary') {
        res.json(tokensToStyleDictionaryFormat(tokens));
      } else {
        res.json(tokens);
      }
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Get Figma components
  router.get('/figma/components/:fileId', async (req: Request, res: Response) => {
    if (!figmaClient) {
      res.status(503).json({ error: 'Figma client not configured' });
      return;
    }
    try {
      const result = await figmaClient.getFileComponents(req.params.fileId);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Export SVG
  router.get('/figma/export/:fileId/:nodeId', async (req: Request, res: Response) => {
    if (!figmaClient) {
      res.status(503).json({ error: 'Figma client not configured' });
      return;
    }
    try {
      const exporter = new SvgExporter(figmaClient);
      const svg = await exporter.exportFrame(req.params.fileId, req.params.nodeId);
      res.type('image/svg+xml').send(svg);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  // Get Canva design
  router.get('/canva/design/:designId', async (req: Request, res: Response) => {
    if (!canvaClient) {
      res.status(503).json({ error: 'Canva client not configured' });
      return;
    }
    try {
      const design = await canvaClient.getDesign(req.params.designId);
      res.json(design);
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  return router;
}
