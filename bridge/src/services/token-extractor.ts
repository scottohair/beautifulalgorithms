import type {
  FigmaFile,
  FigmaNode,
  FigmaColor,
  FigmaEffect,
  FigmaPaint,
  FigmaTypeStyle,
  ExtractedToken,
  ExtractedTokenSet,
} from '../types/index.js';

// -------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------

/** Convert a Figma RGBA color (0-1 floats) to a hex or rgba() string. */
function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = color.a;

  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${parseFloat(a.toFixed(3))})`;
  }
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/** Convert a Figma color to an 8-digit hex (includes alpha). */
function figmaColorToHex8(color: FigmaColor): string {
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const a = Math.round(color.a * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a.toString(16).padStart(2, '0')}`;
}

/** Sanitize a node path into a kebab-case token name. */
function sanitizeName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[\/\s]+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build a hierarchical path name from a node and an optional prefix. */
function nodePath(node: FigmaNode, prefix: string): string {
  return prefix ? `${prefix}/${node.name}` : node.name;
}

// -------------------------------------------------------------------
// Color extraction
// -------------------------------------------------------------------

function extractColorsFromFills(
  fills: FigmaPaint[] | undefined,
  name: string,
): ExtractedToken[] {
  if (!fills) return [];
  const tokens: ExtractedToken[] = [];

  for (let i = 0; i < fills.length; i++) {
    const fill = fills[i];
    if (fill.visible === false) continue;
    if (fill.type === 'SOLID' && fill.color) {
      const suffix = fills.length > 1 ? `-${i}` : '';
      tokens.push({
        name: `${sanitizeName(name)}${suffix}`,
        value: figmaColorToHex(fill.color),
        type: 'color',
        description: `Solid fill from: ${name}`,
        rawFigmaValue: fill.color,
      });
    }
  }

  return tokens;
}

function extractColorsFromNode(
  node: FigmaNode,
  prefix: string = '',
): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  if (node.visible === false) return tokens;

  const name = nodePath(node, prefix);

  // Fills
  tokens.push(...extractColorsFromFills(node.fills, name));

  // Strokes
  if (node.strokes) {
    for (const stroke of node.strokes) {
      if (stroke.visible === false) continue;
      if (stroke.type === 'SOLID' && stroke.color) {
        tokens.push({
          name: `${sanitizeName(name)}-stroke`,
          value: figmaColorToHex(stroke.color),
          type: 'color',
          description: `Stroke color from: ${name}`,
          rawFigmaValue: stroke.color,
        });
      }
    }
  }

  // Recurse into children
  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractColorsFromNode(child, name));
    }
  }

  return tokens;
}

// -------------------------------------------------------------------
// Typography extraction
// -------------------------------------------------------------------

function extractTypographyFromNode(
  node: FigmaNode,
  prefix: string = '',
): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  if (node.visible === false) return tokens;

  const name = nodePath(node, prefix);

  if (node.type === 'TEXT' && node.style) {
    const style: FigmaTypeStyle = node.style;
    const baseName = sanitizeName(name);

    tokens.push({
      name: `${baseName}-font-family`,
      value: style.fontFamily,
      type: 'fontFamily',
      description: `Font family from text node: ${name}`,
    });

    tokens.push({
      name: `${baseName}-font-size`,
      value: style.fontSize,
      type: 'fontSize',
      description: `Font size from text node: ${name}`,
    });

    tokens.push({
      name: `${baseName}-font-weight`,
      value: style.fontWeight,
      type: 'fontWeight',
      description: `Font weight from text node: ${name}`,
    });

    if (style.lineHeightPx !== undefined) {
      tokens.push({
        name: `${baseName}-line-height`,
        value: parseFloat(style.lineHeightPx.toFixed(2)),
        type: 'lineHeight',
        description: `Line height (px) from text node: ${name}`,
      });
    }

    if (style.letterSpacing !== undefined && style.letterSpacing !== 0) {
      tokens.push({
        name: `${baseName}-letter-spacing`,
        value: parseFloat(style.letterSpacing.toFixed(2)),
        type: 'letterSpacing',
        description: `Letter spacing from text node: ${name}`,
      });
    }
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractTypographyFromNode(child, name));
    }
  }

  return tokens;
}

// -------------------------------------------------------------------
// Spacing extraction (from auto-layout frames)
// -------------------------------------------------------------------

function extractSpacingFromNode(
  node: FigmaNode,
  prefix: string = '',
): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  if (node.visible === false) return tokens;

  const name = nodePath(node, prefix);

  if (node.layoutMode && node.layoutMode !== 'NONE') {
    const baseName = sanitizeName(name);

    if (node.itemSpacing !== undefined && node.itemSpacing > 0) {
      tokens.push({
        name: `${baseName}-gap`,
        value: node.itemSpacing,
        type: 'spacing',
        description: `Item spacing (${node.layoutMode.toLowerCase()}) from: ${name}`,
      });
    }

    if (node.paddingTop !== undefined && node.paddingTop > 0) {
      tokens.push({
        name: `${baseName}-padding-top`,
        value: node.paddingTop,
        type: 'spacing',
        description: `Padding top from auto-layout: ${name}`,
      });
    }
    if (node.paddingRight !== undefined && node.paddingRight > 0) {
      tokens.push({
        name: `${baseName}-padding-right`,
        value: node.paddingRight,
        type: 'spacing',
        description: `Padding right from auto-layout: ${name}`,
      });
    }
    if (node.paddingBottom !== undefined && node.paddingBottom > 0) {
      tokens.push({
        name: `${baseName}-padding-bottom`,
        value: node.paddingBottom,
        type: 'spacing',
        description: `Padding bottom from auto-layout: ${name}`,
      });
    }
    if (node.paddingLeft !== undefined && node.paddingLeft > 0) {
      tokens.push({
        name: `${baseName}-padding-left`,
        value: node.paddingLeft,
        type: 'spacing',
        description: `Padding left from auto-layout: ${name}`,
      });
    }

    // If all four paddings are equal, also emit a shorthand token
    if (
      node.paddingTop !== undefined &&
      node.paddingTop === node.paddingRight &&
      node.paddingTop === node.paddingBottom &&
      node.paddingTop === node.paddingLeft &&
      node.paddingTop > 0
    ) {
      tokens.push({
        name: `${baseName}-padding`,
        value: node.paddingTop,
        type: 'spacing',
        description: `Uniform padding from auto-layout: ${name}`,
      });
    }
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractSpacingFromNode(child, name));
    }
  }

  return tokens;
}

// -------------------------------------------------------------------
// Effects extraction (shadows, blurs)
// -------------------------------------------------------------------

function formatShadow(effect: FigmaEffect): string {
  const x = effect.offset?.x ?? 0;
  const y = effect.offset?.y ?? 0;
  const blur = effect.radius;
  const spread = effect.spread ?? 0;
  const color = effect.color ? figmaColorToHex(effect.color) : 'rgba(0,0,0,0.25)';
  const inset = effect.type === 'INNER_SHADOW' ? 'inset ' : '';
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

function extractEffectsFromNode(
  node: FigmaNode,
  prefix: string = '',
): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  if (node.visible === false) return tokens;

  const name = nodePath(node, prefix);

  if (node.effects && node.effects.length > 0) {
    const baseName = sanitizeName(name);

    for (let i = 0; i < node.effects.length; i++) {
      const effect = node.effects[i];
      if (effect.visible === false) continue;

      const suffix = node.effects.filter((e) => e.visible !== false).length > 1 ? `-${i}` : '';

      if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
        tokens.push({
          name: `${baseName}-shadow${suffix}`,
          value: formatShadow(effect),
          type: 'shadow',
          description: `${effect.type === 'INNER_SHADOW' ? 'Inner shadow' : 'Drop shadow'} from: ${name}`,
          rawFigmaValue: effect,
        });
      } else if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
        tokens.push({
          name: `${baseName}-blur${suffix}`,
          value: effect.radius,
          type: 'blur',
          description: `${effect.type === 'BACKGROUND_BLUR' ? 'Background blur' : 'Layer blur'} from: ${name}`,
          rawFigmaValue: effect,
        });
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractEffectsFromNode(child, name));
    }
  }

  return tokens;
}

// -------------------------------------------------------------------
// Border radius extraction
// -------------------------------------------------------------------

function extractRadiiFromNode(
  node: FigmaNode,
  prefix: string = '',
): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  if (node.visible === false) return tokens;

  const name = nodePath(node, prefix);
  const baseName = sanitizeName(name);

  if (node.cornerRadius !== undefined && node.cornerRadius > 0) {
    tokens.push({
      name: `${baseName}-border-radius`,
      value: node.cornerRadius,
      type: 'borderRadius',
      description: `Border radius from: ${name}`,
    });
  } else if (node.rectangleCornerRadii) {
    const [tl, tr, br, bl] = node.rectangleCornerRadii;
    if (tl > 0 || tr > 0 || br > 0 || bl > 0) {
      tokens.push({
        name: `${baseName}-border-radius`,
        value: `${tl}px ${tr}px ${br}px ${bl}px`,
        type: 'borderRadius',
        description: `Individual corner radii from: ${name}`,
        rawFigmaValue: node.rectangleCornerRadii,
      });
    }
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractRadiiFromNode(child, name));
    }
  }

  return tokens;
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/** Deduplicate tokens by name, keeping the first occurrence. */
function dedup(tokens: ExtractedToken[]): ExtractedToken[] {
  const seen = new Set<string>();
  return tokens.filter((t) => {
    const key = `${t.type}:${t.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Extract all token categories from a Figma file document tree. */
export function extractTokensFromFile(file: FigmaFile): ExtractedTokenSet {
  const root = file.document;
  return {
    colors: dedup(extractColorsFromNode(root)),
    typography: dedup(extractTypographyFromNode(root)),
    spacing: dedup(extractSpacingFromNode(root)),
    effects: dedup(extractEffectsFromNode(root)),
    radii: dedup(extractRadiiFromNode(root)),
  };
}

/** Extract tokens from a single node subtree (useful for MCP per-frame extraction). */
export function extractTokensFromNode(node: FigmaNode): ExtractedTokenSet {
  return {
    colors: dedup(extractColorsFromNode(node)),
    typography: dedup(extractTypographyFromNode(node)),
    spacing: dedup(extractSpacingFromNode(node)),
    effects: dedup(extractEffectsFromNode(node)),
    radii: dedup(extractRadiiFromNode(node)),
  };
}

/** Flatten an ExtractedTokenSet into a single array (legacy compat). */
export function flattenTokenSet(set: ExtractedTokenSet): ExtractedToken[] {
  return [
    ...set.colors,
    ...set.typography,
    ...set.spacing,
    ...set.effects,
    ...set.radii,
  ];
}

/** Convert tokens into Style Dictionary-compatible JSON.
 *
 *  Output structure:
 *  ```json
 *  {
 *    "color": {
 *      "primary": { "value": "#ff0000", "type": "color" }
 *    },
 *    "fontSize": { ... },
 *    ...
 *  }
 *  ```
 */
export function tokensToStyleDictionaryFormat(
  tokenSetOrFlat: ExtractedTokenSet | ExtractedToken[],
): Record<string, unknown> {
  const flat = Array.isArray(tokenSetOrFlat)
    ? tokenSetOrFlat
    : flattenTokenSet(tokenSetOrFlat);

  const result: Record<string, Record<string, unknown>> = {};

  for (const token of flat) {
    // Top-level group by type
    if (!result[token.type]) result[token.type] = {};
    const group = result[token.type];

    // Nest by name segments (split on "-")
    const parts = token.name.split('-');
    let current: Record<string, unknown> = group;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part] || typeof current[part] !== 'object' || 'value' in (current[part] as Record<string, unknown>)) {
        current[part] = {};
      }
      current = current[part] as Record<string, unknown>;
    }

    const leaf = parts[parts.length - 1];
    current[leaf] = {
      value: token.value,
      type: token.type,
      ...(token.description ? { description: token.description } : {}),
    };
  }

  return result;
}
