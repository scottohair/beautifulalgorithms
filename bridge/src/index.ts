import 'dotenv/config';
import express from 'express';
import { FigmaClient } from './services/figma-client.js';
import { CanvaClient } from './services/canva-client.js';
import { createApiRouter } from './routes/api.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

// Initialize clients (null if tokens not configured)
const figmaClient = process.env.FIGMA_ACCESS_TOKEN
  ? new FigmaClient(process.env.FIGMA_ACCESS_TOKEN)
  : null;

const canvaClient = process.env.CANVA_API_KEY
  ? new CanvaClient(process.env.CANVA_API_KEY)
  : null;

const app = express();
app.use(express.json());

// CORS for local dev
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// API routes
app.use('/api', createApiRouter(figmaClient, canvaClient));

app.listen(PORT, () => {
  console.log(`Bridge service running on http://localhost:${PORT}`);
  console.log(`Figma: ${figmaClient ? 'configured' : 'not configured (set FIGMA_ACCESS_TOKEN)'}`);
  console.log(`Canva: ${canvaClient ? 'configured' : 'not configured (set CANVA_API_KEY)'}`);
});

export { app };
