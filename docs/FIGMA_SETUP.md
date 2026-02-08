# Figma Bridge Setup

## Option 1: Custom Bridge Service (Recommended)

### 1. Get a Figma Access Token

1. Go to [figma.com](https://www.figma.com) and sign in (or create an account)
2. Click your avatar (top-right) → **Settings**
3. Scroll to **Personal access tokens**
4. Click **Generate new token**
5. Name it (e.g., "Aesthetic Algorithm Bridge")
6. Select scopes: `file_read`, `file_dev_resources:read`
7. Click **Generate token**
8. Copy the token (starts with `figd_`) — you won't see it again

### 2. Configure the Bridge

```bash
cp bridge/.env.example bridge/.env
```

Edit `bridge/.env`:
```
FIGMA_ACCESS_TOKEN=figd_your_token_here
FIGMA_FILE_ID=your_figma_file_id
```

### 3. Run the Bridge

```bash
cd bridge
npm install
npm run dev
```

The bridge runs at `http://localhost:3001`.

### 4. API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Service status |
| `GET /api/figma/frame/:fileId/:nodeId` | Get a Figma frame/node |
| `GET /api/figma/tokens/:fileId` | Extract design tokens |
| `GET /api/figma/components/:fileId` | List components |
| `GET /api/figma/export/:fileId/:nodeId` | Export node as SVG |
| `GET /api/canva/design/:designId` | Get Canva design |

### 5. Extract Tokens in Style Dictionary Format

```bash
curl http://localhost:3001/api/figma/tokens/YOUR_FILE_ID?format=style-dictionary
```

Save the output to `design-tokens/src/figma-overrides.json` and rebuild tokens.

---

## Option 2: Official Figma MCP (Zero-Code)

Add the official Figma MCP server to Claude Code:

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Then ask Claude to fetch components:
> "Fetch the color styles from my Figma file [URL]"

---

## Canva Fallback

If using Canva instead of Figma:

1. Go to [canva.com/developers](https://www.canva.com/developers/)
2. Create an app and get your API key
3. Add to `bridge/.env`:
   ```
   CANVA_API_KEY=your_key_here
   ```
