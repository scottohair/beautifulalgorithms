import 'dotenv/config';

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  // Also support --flag=value form
  const prefix = `${name}=`;
  const found = args.find((a) => a.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

const mode = getArg('--mode') ?? 'express';

async function main(): Promise<void> {
  switch (mode) {
    case 'mcp': {
      const { startMcpServer } = await import('./mcp/server.js');
      await startMcpServer();
      break;
    }

    case 'express': {
      // Dynamically import so that MCP mode never loads Express
      const { FigmaClient } = await import('./services/figma-client.js');
      const { CanvaClient } = await import('./services/canva-client.js');
      const { createApiRouter } = await import('./routes/api.js');
      const express = (await import('express')).default;

      const PORT = parseInt(process.env.PORT || '3001', 10);

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

      app.use('/api', createApiRouter(figmaClient, canvaClient));

      app.listen(PORT, () => {
        console.log(`Bridge service running on http://localhost:${PORT}`);
        console.log(`Figma: ${figmaClient ? 'configured' : 'not configured (set FIGMA_ACCESS_TOKEN)'}`);
        console.log(`Canva: ${canvaClient ? 'configured' : 'not configured (set CANVA_API_KEY)'}`);
      });
      break;
    }

    default:
      console.error(`Unknown mode: ${mode}`);
      console.error('Usage: tsx src/cli.ts --mode [express|mcp]');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
