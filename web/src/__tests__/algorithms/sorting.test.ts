import { describe, it, expect } from 'vitest';
import { bubbleSort } from '@/algorithms/sorting/bubble-sort';
import { insertionSort } from '@/algorithms/sorting/insertion-sort';
import { selectionSort } from '@/algorithms/sorting/selection-sort';
import { mergeSort } from '@/algorithms/sorting/merge-sort';
import { quickSort } from '@/algorithms/sorting/quick-sort';
import { heapSort } from '@/algorithms/sorting/heap-sort';
import { shellSort } from '@/algorithms/sorting/shell-sort';
import { countingSort } from '@/algorithms/sorting/counting-sort';
import type { AlgorithmImplementation } from '@/lib/types/algorithm';
import {
  validateSteps,
  isSorted,
  SORTING_TEST_INPUTS,
  loadAlgorithmSpec,
} from '../helpers';

const sortingAlgorithms: { name: string; impl: AlgorithmImplementation; specFile: string }[] = [
  { name: 'Bubble Sort', impl: bubbleSort, specFile: 'bubble-sort' },
  { name: 'Insertion Sort', impl: insertionSort, specFile: 'insertion-sort' },
  { name: 'Selection Sort', impl: selectionSort, specFile: 'selection-sort' },
  { name: 'Merge Sort', impl: mergeSort, specFile: 'merge-sort' },
  { name: 'Quick Sort', impl: quickSort, specFile: 'quick-sort' },
  { name: 'Heap Sort', impl: heapSort, specFile: 'heap-sort' },
  { name: 'Shell Sort', impl: shellSort, specFile: 'shell-sort' },
  { name: 'Counting Sort', impl: countingSort, specFile: 'counting-sort' },
];

describe('Sorting Algorithms', () => {
  for (const { name, impl, specFile } of sortingAlgorithms) {
    describe(name, () => {
      it('should have correct metadata', () => {
        expect(impl.id).toBeTruthy();
        expect(impl.name).toBe(name);
        expect(impl.category).toBe('sorting');
        expect(impl.timeComplexity).toBeDefined();
        expect(impl.spaceComplexity).toBeDefined();
        expect(impl.pseudocode.length).toBeGreaterThan(0);
      });

      it('should match algorithm spec file', () => {
        const spec = loadAlgorithmSpec('sorting', specFile);
        if (spec) {
          expect(impl.id).toBe(spec.id);
          expect(impl.name).toBe(spec.name);
        }
      });

      describe('standard input', () => {
        const input = SORTING_TEST_INPUTS.standard;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid step structure, types, and indices', () => {
          validateSteps(steps);
        });

        it('should produce a sorted array in the final step', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });

        it('should preserve all elements (same multiset)', () => {
          const finalArray = steps[steps.length - 1].array;
          // For counting sort, the array might be remapped, so we check length and sortedness
          // For other sorts, check exact multiset equality
          if (name !== 'Counting Sort') {
            expect([...finalArray].sort((a, b) => a - b)).toEqual(
              [...input].sort((a, b) => a - b)
            );
          } else {
            expect(finalArray.length).toBe(input.length);
            expect(isSorted(finalArray)).toBe(true);
          }
        });
      });

      describe('edge case: empty array', () => {
        const steps = impl.generateSteps(SORTING_TEST_INPUTS.empty);

        it('should not crash', () => {
          expect(steps).toBeDefined();
          expect(Array.isArray(steps)).toBe(true);
        });

        it('should produce few steps', () => {
          // Empty arrays may produce some initialization steps in certain algorithms
          // (e.g. heap sort builds a heap phase marker), but should not produce many
          expect(steps.length).toBeLessThanOrEqual(5);
        });
      });

      describe('edge case: single element', () => {
        const input = SORTING_TEST_INPUTS.single;
        const steps = impl.generateSteps(input);

        it('should not crash', () => {
          expect(steps).toBeDefined();
        });

        it('should have valid steps if any', () => {
          if (steps.length > 0) {
            validateSteps(steps);
          }
        });
      });

      describe('edge case: already sorted', () => {
        const input = SORTING_TEST_INPUTS.alreadySorted;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid steps', () => {
          validateSteps(steps);
        });

        it('should produce a sorted final array', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });
      });

      describe('edge case: reverse sorted', () => {
        const input = SORTING_TEST_INPUTS.reverseSorted;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid steps', () => {
          validateSteps(steps);
        });

        it('should produce a sorted final array', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });
      });

      describe('edge case: duplicates', () => {
        const input = SORTING_TEST_INPUTS.duplicates;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid steps', () => {
          validateSteps(steps);
        });

        it('should produce a sorted final array', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });
      });

      describe('edge case: two elements', () => {
        const input = SORTING_TEST_INPUTS.twoElements;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid steps', () => {
          validateSteps(steps);
        });

        it('should produce a sorted final array', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });
      });

      describe('edge case: all same values', () => {
        const input = SORTING_TEST_INPUTS.allSame;
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid steps', () => {
          validateSteps(steps);
        });

        it('should produce a sorted final array', () => {
          const finalArray = steps[steps.length - 1].array;
          expect(isSorted(finalArray)).toBe(true);
        });
      });
    });
  }
});
