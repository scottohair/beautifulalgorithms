import type { FigmaFile, FigmaNode, FigmaColor, ExtractedToken } from '../types/index.js';

function figmaColorToHex(color: FigmaColor): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  if (color.a < 1) {
    return `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a.toFixed(2)})`;
  }
  return `#${r}${g}${b}`;
}

function extractColorsFromNode(node: FigmaNode, prefix: string = ''): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  const name = prefix ? `${prefix}/${node.name}` : node.name;

  if (node.fills) {
    for (const fill of node.fills) {
      if (fill.type === 'SOLID' && fill.color) {
        tokens.push({
          name: name.toLowerCase().replace(/[\/\s]+/g, '-'),
          value: figmaColorToHex(fill.color),
          type: 'color',
          description: `Extracted from Figma node: ${name}`,
        });
      }
    }
  }

  if (node.children) {
    for (const child of node.children) {
      tokens.push(...extractColorsFromNode(child, name));
    }
  }

  return tokens;
}

export function extractTokensFromFile(file: FigmaFile): ExtractedToken[] {
  const tokens: ExtractedToken[] = [];
  tokens.push(...extractColorsFromNode(file.document));
  return tokens;
}

export function tokensToStyleDictionaryFormat(tokens: ExtractedToken[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const token of tokens) {
    const parts = token.name.split('-');
    let current = result as Record<string, unknown>;

    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }

    current[parts[parts.length - 1]] = {
      value: token.value,
      type: token.type,
      description: token.description,
    };
  }

  return result;
}
