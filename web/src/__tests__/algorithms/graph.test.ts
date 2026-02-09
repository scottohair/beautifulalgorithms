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

        it('should have graphData on every step', () => {
          for (let i = 0; i < steps.length; i++) {
            expect(steps[i].graphData).toBeDefined();
            expect(steps[i].graphData!.nodeCount).toBeGreaterThan(0);
            expect(Array.isArray(steps[i].graphData!.edges)).toBe(true);
            expect(typeof steps[i].graphData!.directed).toBe('boolean');
          }
        });

        it('should have consistent graph topology across steps', () => {
          const firstGraph = steps[0].graphData!;
          for (let i = 1; i < steps.length; i++) {
            const g = steps[i].graphData!;
            expect(g.nodeCount).toBe(firstGraph.nodeCount);
            expect(g.edges.length).toBe(firstGraph.edges.length);
            expect(g.directed).toBe(firstGraph.directed);
          }
        });

        it('should have valid edge references', () => {
          for (let i = 0; i < steps.length; i++) {
            const g = steps[i].graphData!;
            for (const edge of g.edges) {
              expect(edge.source).toBeGreaterThanOrEqual(0);
              expect(edge.source).toBeLessThan(g.nodeCount);
              expect(edge.target).toBeGreaterThanOrEqual(0);
              expect(edge.target).toBeLessThan(g.nodeCount);
            }
            if (g.activeEdges) {
              for (const edge of g.activeEdges) {
                expect(edge.source).toBeGreaterThanOrEqual(0);
                expect(edge.source).toBeLessThan(g.nodeCount);
                expect(edge.target).toBeGreaterThanOrEqual(0);
                expect(edge.target).toBeLessThan(g.nodeCount);
              }
            }
          }
        });

        it('should accumulate active edges over time', () => {
          const activeCountFirst = steps[0].graphData!.activeEdges?.length ?? 0;
          const activeCountLast = steps[steps.length - 1].graphData!.activeEdges?.length ?? 0;
          // Active edges should grow (or stay same if nothing to traverse)
          expect(activeCountLast).toBeGreaterThanOrEqual(activeCountFirst);
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
          // Verify graphData on small inputs too
          for (const step of steps) {
            expect(step.graphData).toBeDefined();
          }
        });

        it('should handle larger input', () => {
          const largerInput = [6, 1, 2, 3, 4, 5, 2, 3, 4, 5, 1, 3, 5, 2, 4];
          const steps = impl.generateSteps(largerInput);
          expect(steps).toBeDefined();
          expect(steps.length).toBeGreaterThan(0);
          verifyStepTypes(steps);
          verifyStepStructure(steps);
          for (const step of steps) {
            expect(step.graphData).toBeDefined();
          }
        });
      });
    });
  }
});
