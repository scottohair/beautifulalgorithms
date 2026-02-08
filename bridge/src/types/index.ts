// ---- Figma color ----

export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

// ---- Figma paint / fill / stroke ----

export interface FigmaPaint {
  type: 'SOLID' | 'GRADIENT_LINEAR' | 'GRADIENT_RADIAL' | 'GRADIENT_ANGULAR' | 'GRADIENT_DIAMOND' | 'IMAGE' | 'EMOJI';
  visible?: boolean;
  opacity?: number;
  color?: FigmaColor;
  blendMode?: string;
  gradientStops?: Array<{ position: number; color: FigmaColor }>;
  scaleMode?: string;
  imageRef?: string;
}

// ---- Figma effects ----

export interface FigmaEffect {
  type: 'INNER_SHADOW' | 'DROP_SHADOW' | 'LAYER_BLUR' | 'BACKGROUND_BLUR';
  visible?: boolean;
  radius: number;
  color?: FigmaColor;
  blendMode?: string;
  offset?: { x: number; y: number };
  spread?: number;
}

// ---- Figma type style ----

export interface FigmaTypeStyle {
  fontFamily: string;
  fontPostScriptName?: string;
  fontWeight: number;
  fontSize: number;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  letterSpacing?: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  lineHeightPercentFontSize?: number;
  lineHeightUnit?: string;
  textCase?: string;
  textDecoration?: string;
  italic?: boolean;
  paragraphSpacing?: number;
  paragraphIndent?: number;
}

// ---- Figma layout ----

export interface FigmaLayoutConstraint {
  vertical: string;
  horizontal: string;
}

export interface FigmaRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ---- Figma style metadata ----

export interface FigmaStyle {
  key: string;
  name: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  description: string;
  remote?: boolean;
}

// ---- Figma component metadata ----

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
  documentationLinks?: Array<{ uri: string }>;
}

// ---- Figma node ----

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  visible?: boolean;
  children?: FigmaNode[];
  fills?: FigmaPaint[];
  strokes?: FigmaPaint[];
  strokeWeight?: number;
  strokeAlign?: string;
  effects?: FigmaEffect[];
  style?: FigmaTypeStyle;
  characters?: string;
  opacity?: number;
  cornerRadius?: number;
  rectangleCornerRadii?: [number, number, number, number];
  absoluteBoundingBox?: FigmaRectangle;
  absoluteRenderBounds?: FigmaRectangle;
  constraints?: FigmaLayoutConstraint;
  clipsContent?: boolean;
  // Auto-layout properties
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  // Component-related
  componentId?: string;
  componentProperties?: Record<string, unknown>;
  // Styles applied
  styles?: Record<string, string>;
}

// ---- Figma file ----

export interface FigmaFile {
  name: string;
  lastModified: string;
  version: string;
  role: string;
  document: FigmaNode;
  styles: Record<string, FigmaStyle>;
  components: Record<string, FigmaComponent>;
  schemaVersion: number;
  thumbnailUrl?: string;
}

// ---- Extracted tokens ----

export type TokenType =
  | 'color'
  | 'fontSize'
  | 'fontFamily'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'
  | 'spacing'
  | 'borderRadius'
  | 'opacity'
  | 'shadow'
  | 'blur';

export interface ExtractedToken {
  name: string;
  value: string | number;
  type: TokenType;
  description?: string;
  rawFigmaValue?: unknown;
}

export interface ExtractedTokenSet {
  colors: ExtractedToken[];
  typography: ExtractedToken[];
  spacing: ExtractedToken[];
  effects: ExtractedToken[];
  radii: ExtractedToken[];
}

// ---- Canva types ----

export interface CanvaDesign {
  id: string;
  title: string;
  owner?: {
    user_id: string;
    display_name?: string;
  };
  thumbnail?: {
    url: string;
    width: number;
    height: number;
  };
  urls: {
    editUrl: string;
    viewUrl: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface CanvaPage {
  id: string;
  title?: string;
  width: number;
  height: number;
  thumbnail?: {
    url: string;
  };
}

// ---- SVG export options ----

export interface SvgExportOptions {
  scale?: number;
  format?: 'svg' | 'png' | 'pdf' | 'jpg';
  contentsOnly?: boolean;
  svgIncludeId?: boolean;
  svgIncludeNodeId?: boolean;
  svgSimplifyStroke?: boolean;
  useAbsoluteBounds?: boolean;
}
