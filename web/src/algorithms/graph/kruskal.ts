import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { createGraphData } from '@/lib/graph-utils';

export const kruskal: AlgorithmImplementation = {
  id: 'kruskal',
  name: "Kruskal's Algorithm",
  category: 'graph',
  timeComplexity: { best: 'O(E log E)', average: 'O(E log E)', worst: 'O(E log E)' },
  spaceComplexity: 'O(V + E)',
  pseudocode: [
    { line: 0, text: "procedure Kruskal(graph)" },
    { line: 1, text: '  sort all edges by weight' },
    { line: 2, text: '  initialize union-find for each vertex' },
    { line: 3, text: '  MST ← empty set' },
    { line: 4, text: '  for each edge (u, v, w) in sorted order' },
    { line: 5, text: '    if find(u) ≠ find(v) then' },
    { line: 6, text: '      add edge (u, v) to MST' },
    { line: 7, text: '      union(u, v)' },
    { line: 8, text: '    else skip edge (would form cycle)' },
    { line: 9, text: '  return MST' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;
    if (n === 0) return steps;

    // Union-Find
    const parentUF: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(0);

    function find(x: number): number {
      if (parentUF[x] !== x) {
        parentUF[x] = find(parentUF[x]);
      }
      return parentUF[x];
    }

    function union(x: number, y: number): boolean {
      const px = find(x);
      const py = find(y);
      if (px === py) return false;
      if (rank[px] < rank[py]) {
        parentUF[px] = py;
      } else if (rank[px] > rank[py]) {
        parentUF[py] = px;
      } else {
        parentUF[py] = px;
        rank[px]++;
      }
      return true;
    }

    interface Edge {
      u: number;
      v: number;
      weight: number;
    }

    const edges: Edge[] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const indexDiff = Math.abs(i - j);
        const valueDiff = Math.abs(input[i] - input[j]);
        if (indexDiff <= 2 || valueDiff <= 2) {
          edges.push({ u: i, v: j, weight: valueDiff + 1 });
        }
      }
    }

    edges.sort((a, b) => a.weight - b.weight);

    // Build graph data from edge list
    const graphEdges: GraphEdge[] = edges.map(e => ({ source: e.u, target: e.v, weight: e.weight }));
    const baseGraphData = createGraphData(n, graphEdges, false, [...input]);
    const activeEdges: GraphEdge[] = [];

    const edgeWeights = edges.map(e => e.weight);

    steps.push({
      type: 'highlight',
      array: [...edgeWeights],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Sorted ${edges.length} edges by weight. Initialize union-find.`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    const mstEdgeIndices: number[] = [];
    const mstVertices = new Set<number>();
    let totalWeight = 0;

    for (let i = 0; i < edges.length; i++) {
      const { u, v, weight } = edges[i];

      steps.push({
        type: 'compare',
        array: [...input],
        highlightedIndices: [u, v],
        secondaryIndices: [],
        sortedIndices: [...mstVertices],
        pseudocodeLine: 5,
        description: `Consider edge (${u}→${v}) with weight ${weight}. Check if they are in the same component.`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      const rootU = find(u);
      const rootV = find(v);

      if (rootU !== rootV) {
        union(u, v);
        mstEdgeIndices.push(i);
        mstVertices.add(u);
        mstVertices.add(v);
        totalWeight += weight;
        activeEdges.push({ source: u, target: v, weight });

        steps.push({
          type: 'insert',
          array: [...input],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 6,
          description: `Add edge (${u}→${v}), weight ${weight} to MST. Total weight: ${totalWeight}`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        steps.push({
          type: 'traverse',
          array: [...input],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 7,
          description: `Union sets of ${u} and ${v}. MST has ${mstEdgeIndices.length} edge(s).`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        if (mstEdgeIndices.length === n - 1) {
          break;
        }
      } else {
        steps.push({
          type: 'highlight',
          array: [...input],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 8,
          description: `Skip edge (${u}→${v}): same component, would form cycle.`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });
      }
    }

    steps.push({
      type: 'sorted',
      array: [...input],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [...mstVertices],
      pseudocodeLine: 9,
      description: `Kruskal's MST complete. ${mstEdgeIndices.length} edges, total weight: ${totalWeight}`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
