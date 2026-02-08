import type { AlgorithmStep, StepType, AlgorithmImplementation } from '@/lib/types/algorithm';
import fs from 'fs';
import path from 'path';

/**
 * All valid step types from the AlgorithmStep type definition.
 */
export const VALID_STEP_TYPES: StepType[] = [
  'compare',
  'swap',
  'sorted',
  'pass-complete',
  'insert',
  'remove',
  'highlight',
  'traverse',
  'select',
];

/**
 * Loads an algorithm spec JSON file from the algorithm-specs directory.
 * @param category - The category directory (e.g. 'sorting', 'data-structures')
 * @param name - The algorithm file name without extension (e.g. 'bubble-sort')
 * @returns Parsed JSON object of the algorithm spec, or null if not found.
 */
export function loadAlgorithmSpec(
  category: string,
  name: string
): Record<string, unknown> | null {
  const specPath = path.resolve(
    __dirname,
    '../../../algorithm-specs',
    category,
    `${name}.algo.json`
  );
  try {
    const content = fs.readFileSync(specPath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Verifies that every step in the steps array has a valid step type.
 */
export function verifyStepTypes(steps: AlgorithmStep[]): void {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!VALID_STEP_TYPES.includes(step.type)) {
      throw new Error(
        `Step ${i} has invalid type "${step.type}". Valid types: ${VALID_STEP_TYPES.join(', ')}`
      );
    }
  }
}

/**
 * Verifies that all highlighted, secondary, and sorted indices are within array bounds
 * for every step.
 */
export function verifyIndicesInBounds(steps: AlgorithmStep[]): void {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const arrayLength = step.array.length;

    for (const idx of step.highlightedIndices) {
      if (idx < 0 || idx >= arrayLength) {
        throw new Error(
          `Step ${i} (${step.type}): highlightedIndex ${idx} is out of bounds for array of length ${arrayLength}. Description: "${step.description}"`
        );
      }
    }

    for (const idx of step.secondaryIndices) {
      if (idx < 0 || idx >= arrayLength) {
        throw new Error(
          `Step ${i} (${step.type}): secondaryIndex ${idx} is out of bounds for array of length ${arrayLength}. Description: "${step.description}"`
        );
      }
    }

    for (const idx of step.sortedIndices) {
      if (idx < 0 || idx >= arrayLength) {
        throw new Error(
          `Step ${i} (${step.type}): sortedIndex ${idx} is out of bounds for array of length ${arrayLength}. Description: "${step.description}"`
        );
      }
    }
  }
}

/**
 * Verifies that the array state is consistent -- i.e. the array contains numbers
 * and has a defined length.
 */
export function verifyArrayStateConsistent(steps: AlgorithmStep[]): void {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (!Array.isArray(step.array)) {
      throw new Error(`Step ${i}: array is not an array`);
    }
    for (let j = 0; j < step.array.length; j++) {
      if (typeof step.array[j] !== 'number') {
        throw new Error(
          `Step ${i}: array[${j}] is ${typeof step.array[j]}, expected number`
        );
      }
      if (Number.isNaN(step.array[j])) {
        throw new Error(`Step ${i}: array[${j}] is NaN`);
      }
    }
  }
}

/**
 * Verifies that every step has the required fields defined in the AlgorithmStep interface.
 */
export function verifyStepStructure(steps: AlgorithmStep[]): void {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (typeof step.type !== 'string') {
      throw new Error(`Step ${i}: missing or invalid 'type'`);
    }
    if (!Array.isArray(step.array)) {
      throw new Error(`Step ${i}: missing or invalid 'array'`);
    }
    if (!Array.isArray(step.highlightedIndices)) {
      throw new Error(`Step ${i}: missing or invalid 'highlightedIndices'`);
    }
    if (!Array.isArray(step.secondaryIndices)) {
      throw new Error(`Step ${i}: missing or invalid 'secondaryIndices'`);
    }
    if (!Array.isArray(step.sortedIndices)) {
      throw new Error(`Step ${i}: missing or invalid 'sortedIndices'`);
    }
    if (typeof step.pseudocodeLine !== 'number') {
      throw new Error(`Step ${i}: missing or invalid 'pseudocodeLine'`);
    }
    if (typeof step.description !== 'string') {
      throw new Error(`Step ${i}: missing or invalid 'description'`);
    }
  }
}

/**
 * Checks if an array is sorted in ascending order.
 */
export function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

/**
 * Runs a full validation suite on algorithm steps: structure, types, bounds, and consistency.
 */
export function validateSteps(steps: AlgorithmStep[]): void {
  verifyStepStructure(steps);
  verifyStepTypes(steps);
  verifyArrayStateConsistent(steps);
  verifyIndicesInBounds(steps);
}

/**
 * Standard test inputs for sorting algorithms.
 */
export const SORTING_TEST_INPUTS = {
  standard: [64, 34, 25, 12, 22, 11, 90, 45, 78, 33],
  empty: [] as number[],
  single: [42],
  alreadySorted: [1, 2, 3, 4, 5, 6, 7, 8],
  reverseSorted: [8, 7, 6, 5, 4, 3, 2, 1],
  duplicates: [5, 3, 8, 3, 1, 5, 8, 2, 1, 5],
  twoElements: [2, 1],
  allSame: [7, 7, 7, 7, 7],
};

/**
 * Standard test input for data structure and other algorithms.
 */
export const DS_TEST_INPUT = [50, 30, 70, 20, 40, 60, 80];

/**
 * Test input for graph algorithms (used as adjacency/weight representation).
 */
export const GRAPH_TEST_INPUT = [4, 1, 2, 3, 2, 3, 1, 4, 3, 1];
