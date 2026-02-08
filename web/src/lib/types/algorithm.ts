export type StepType =
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'pass-complete'
  | 'insert'
  | 'remove'
  | 'highlight'
  | 'traverse'
  | 'select';

export interface AlgorithmStep {
  type: StepType;
  array: number[];
  highlightedIndices: number[];
  secondaryIndices: number[];
  sortedIndices: number[];
  pseudocodeLine: number;
  description: string;
}

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: string;
  timeComplexity: { best: string; average: string; worst: string };
  spaceComplexity: string;
  pseudocode: { line: number; text: string }[];
}

export interface AlgorithmImplementation extends AlgorithmMeta {
  generateSteps: (input: number[]) => AlgorithmStep[];
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'finished';
