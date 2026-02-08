import { describe, it, expect } from 'vitest';
import { bfs } from '@/algorithms/graph/bfs';
import { dfs } from '@/algorithms/graph/dfs';
import { dijkstra } from '@/algorithms/graph/dijkstra';
import { prim } from '@/algorithms/graph/prim';
import { kruskal } from '@/algorithms/graph/kruskal';
import { floydWarshall } from '@/algorithms/graph/floyd-warshall';
import { topologicalSort } from '@/algorithms/graph/topological-sort';
import type { AlgorithmImplementation } from '@/lib/types/algorithm';
import {
  verifyStepTypes,
  verifyStepStructure,
  verifyArrayStateConsistent,
  GRAPH_TEST_INPUT,
} from '../helpers';

const graphAlgorithms: {
  name: string;
  impl: AlgorithmImplementation;
  input: number[];
}[] = [
  { name: 'BFS', impl: bfs, input: GRAPH_TEST_INPUT },
  { name: 'DFS', impl: dfs, input: GRAPH_TEST_INPUT },
  { name: 'Dijkstra', impl: dijkstra, input: GRAPH_TEST_INPUT },
  { name: 'Prim', impl: prim, input: GRAPH_TEST_INPUT },
  { name: 'Kruskal', impl: kruskal, input: GRAPH_TEST_INPUT },
  { name: 'Floyd-Warshall', impl: floydWarshall, input: GRAPH_TEST_INPUT },
  { name: 'Topological Sort', impl: topologicalSort, input: GRAPH_TEST_INPUT },
];

describe('Graph Algorithms', () => {
  for (const { name, impl, input } of graphAlgorithms) {
    describe(name, () => {
      it('should have correct metadata', () => {
        expect(impl.id).toBeTruthy();
        expect(impl.name).toBeTruthy();
        expect(impl.category).toMatch(/graph/);
        expect(impl.timeComplexity).toBeDefined();
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
          }
        });

        it('should reference valid pseudocode lines', () => {
          const maxLine = Math.max(...impl.pseudocode.map((p) => p.line));
          for (let i = 0; i < steps.length; i++) {
            expect(steps[i].pseudocodeLine).toBeGreaterThanOrEqual(0);
            expect(steps[i].pseudocodeLine).toBeLessThanOrEqual(maxLine);
          }
        });
      });

      describe('different input sizes', () => {
        it('should handle small input', () => {
          const smallInput = [3, 1, 2];
          const steps = impl.generateSteps(smallInput);
          expect(steps).toBeDefined();
          expect(Array.isArray(steps)).toBe(true);
          expect(steps.length).toBeGreaterThan(0);
          verifyStepTypes(steps);
          verifyStepStructure(steps);
        });

        it('should handle larger input', () => {
          const largerInput = [6, 1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 3, 5, 2, 4];
          const steps = impl.generateSteps(largerInput);
          expect(steps).toBeDefined();
          expect(steps.length).toBeGreaterThan(0);
          verifyStepTypes(steps);
          verifyStepStructure(steps);
        });
      });
    });
  }
});
