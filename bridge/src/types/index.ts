export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaStyle {
  key: string;
  name: string;
  styleType: 'FILL' | 'TEXT' | 'EFFECT' | 'GRID';
  description: string;
}

export interface FigmaComponent {
  key: string;
  name: string;
  description: string;
  componentSetId?: string;
}

export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  fills?: Array<{
    type: string;
    color?: FigmaColor;
    opacity?: number;
  }>;
  style?: Record<string, unknown>;
  absoluteBoundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface FigmaFile {
  name: string;
  lastModified: string;
  version: string;
  document: FigmaNode;
  styles: Record<string, FigmaStyle>;
  components: Record<string, FigmaComponent>;
}

export interface ExtractedToken {
  name: string;
  value: string;
  type: 'color' | 'fontSize' | 'fontFamily' | 'fontWeight' | 'spacing' | 'borderRadius' | 'opacity';
  description?: string;
}

export interface CanvaDesign {
  id: string;
  title: string;
  urls: {
    editUrl: string;
    viewUrl: string;
  };
}
