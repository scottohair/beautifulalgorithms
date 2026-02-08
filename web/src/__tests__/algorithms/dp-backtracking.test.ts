import { describe, it, expect } from 'vitest';
import { fibonacciDP } from '@/algorithms/dynamic-programming/fibonacci';
import { changeMaking } from '@/algorithms/dynamic-programming/change-making';
import { lcs } from '@/algorithms/dynamic-programming/lcs';
import { nQueens } from '@/algorithms/backtracking/n-queens';
import type { AlgorithmImplementation } from '@/lib/types/algorithm';
import {
  verifyStepTypes,
  verifyStepStructure,
  verifyArrayStateConsistent,
} from '../helpers';

const dpAlgorithms: {
  name: string;
  impl: AlgorithmImplementation;
  input: number[];
  category: string;
}[] = [
  {
    name: 'Fibonacci DP',
    impl: fibonacciDP,
    input: [8, 1, 1, 2, 3, 5, 8, 13],
    category: 'dynamic-programming',
  },
  {
    name: 'Change Making',
    impl: changeMaking,
    input: [11, 1, 5, 6, 9],
    category: 'dynamic-programming',
  },
  {
    name: 'Longest Common Subsequence',
    impl: lcs,
    input: [1, 3, 4, 1, 2, 3, 4, 5],
    category: 'dynamic-programming',
  },
  {
    name: 'N-Queens',
    impl: nQueens,
    input: [4, 0, 0, 0, 0],
    category: 'backtracking',
  },
];

describe('Dynamic Programming & Backtracking Algorithms', () => {
  for (const { name, impl, input, category } of dpAlgorithms) {
    describe(name, () => {
      it('should have correct metadata', () => {
        expect(impl.id).toBeTruthy();
        expect(impl.name).toBeTruthy();
        expect(impl.category).toBe(category);
        expect(impl.timeComplexity).toBeDefined();
        expect(impl.timeComplexity.best).toBeTruthy();
        expect(impl.timeComplexity.average).toBeTruthy();
        expect(impl.timeComplexity.worst).toBeTruthy();
        expect(impl.spaceComplexity).toBeTruthy();
        expect(impl.pseudocode.length).toBeGreaterThan(0);
      });

      describe('step generation', () => {
        const steps = impl.generateSteps(input);

        it('should produce steps', () => {
          expect(steps.length).toBeGreaterThan(0);
        });

        it('should have valid step structure', () => {
          verifyStepStructure(steps);
        });

        it('should have valid step types', () => {
          verifyStepTypes(steps);
        });

        it('should have valid array values', () => {
          verifyArrayStateConsistent(steps);
        });

        it('should have descriptions for all steps', () => {
          for (const step of steps) {
            expect(step.description).toBeTruthy();
            expect(step.description.length).toBeGreaterThan(0);
          }
        });

        it('should have valid pseudocode line numbers', () => {
          for (const step of steps) {
            expect(step.pseudocodeLine).toBeGreaterThanOrEqual(0);
          }
        });
      });

      describe('determinism', () => {
        it('should produce the same number of steps on repeated runs', () => {
          const steps1 = impl.generateSteps(input);
          const steps2 = impl.generateSteps(input);
          expect(steps1.length).toBe(steps2.length);
        });

        it('should produce the same final array on repeated runs', () => {
          const steps1 = impl.generateSteps(input);
          const steps2 = impl.generateSteps(input);
          expect(steps1[steps1.length - 1].array).toEqual(
            steps2[steps2.length - 1].array
          );
        });
      });
    });
  }

  describe('Fibonacci DP specific', () => {
    it('should handle computing fibonacci(10)', () => {
      const steps = fibonacciDP.generateSteps([10, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(steps.length).toBeGreaterThan(0);
      verifyStepStructure(steps);
      verifyStepTypes(steps);
    });
  });

  describe('Change Making specific', () => {
    it('should handle target amount with standard coins', () => {
      const steps = changeMaking.generateSteps([7, 1, 3, 4]);
      expect(steps.length).toBeGreaterThan(0);
      verifyStepStructure(steps);
      verifyStepTypes(steps);
    });
  });

  describe('LCS specific', () => {
    it('should handle two short sequences', () => {
      const steps = lcs.generateSteps([1, 2, 3, 1, 3]);
      expect(steps.length).toBeGreaterThan(0);
      verifyStepStructure(steps);
      verifyStepTypes(steps);
    });
  });

  describe('N-Queens specific', () => {
    it('should handle 4-queens', () => {
      const steps = nQueens.generateSteps([4, 0, 0, 0, 0]);
      expect(steps.length).toBeGreaterThan(0);
      verifyStepStructure(steps);
      verifyStepTypes(steps);
    });

    it('should handle small board', () => {
      const steps = nQueens.generateSteps([3, 0, 0, 0]);
      expect(steps).toBeDefined();
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
      verifyStepTypes(steps);
    });
  });
});
