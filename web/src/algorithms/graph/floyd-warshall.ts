import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { createGraphData } from '@/lib/graph-utils';

export const floydWarshall: AlgorithmImplementation = {
  id: 'floyd-warshall',
  name: 'Floyd-Warshall',
  category: 'graph',
  timeComplexity: { best: 'O(V³)', average: 'O(V³)', worst: 'O(V³)' },
  spaceComplexity: 'O(V²)',
  pseudocode: [
    { line: 0, text: 'procedure floydWarshall(graph)' },
    { line: 1, text: '  dist ← adjacency matrix (∞ for no edge)' },
    { line: 2, text: '  for k ← 0 to V-1 do' },
    { line: 3, text: '    for i ← 0 to V-1 do' },
    { line: 4, text: '      for j ← 0 to V-1 do' },
    { line: 5, text: '        if dist[i][k] + dist[k][j] < dist[i][j]' },
    { line: 6, text: '          dist[i][j] ← dist[i][k] + dist[k][j]' },
    { line: 7, text: '  return dist' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    const V = Math.min(Math.max(Math.floor(Math.sqrt(input.length)), 3), 6);
    const INF = 999;

    const dist: number[] = new Array(V * V).fill(INF);

    for (let i = 0; i < V; i++) {
      dist[i * V + i] = 0;
    }

    // Build graph edges for visualization
    const graphEdges: GraphEdge[] = [];

    for (let i = 0; i < V; i++) {
      for (let j = i + 1; j < V; j++) {
        const inputIdx = i * V + j;
        if (inputIdx < input.length) {
          const weight = (Math.abs(input[inputIdx]) % 9) + 1;
          dist[i * V + j] = weight;
          dist[j * V + i] = weight;
          graphEdges.push({ source: i, target: j, weight });
        } else if (j === i + 1) {
          const weight = (Math.abs(input[i % input.length]) % 9) + 1;
          dist[i * V + j] = weight;
          dist[j * V + i] = weight;
          graphEdges.push({ source: i, target: j, weight });
        }
      }
    }

    // Node labels: just 0..V-1
    const nodeLabels = Array.from({ length: V }, (_, i) => i);
    const baseGraphData = createGraphData(V, graphEdges, false, nodeLabels);
    const activeEdges: GraphEdge[] = [];

    const idx = (i: number, j: number) => i * V + j;

    steps.push({
      type: 'highlight',
      array: [...dist],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Initialize ${V}x${V} distance matrix. ∞ = ${INF}`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    const sortedIndices: number[] = [];

    for (let k = 0; k < V; k++) {
      steps.push({
        type: 'pass-complete',
        array: [...dist],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 2,
        description: `Intermediate vertex k = ${k}`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          if (i === j) continue;

          const ij = idx(i, j);
          const ik = idx(i, k);
          const kj = idx(k, j);
          const throughK = dist[ik] + dist[kj];

          steps.push({
            type: 'compare',
            array: [...dist],
            highlightedIndices: [ij],
            secondaryIndices: [ik, kj],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 5,
            description: `dist[${i}][${j}]=${dist[ij] >= INF ? '∞' : dist[ij]} vs dist[${i}][${k}]+dist[${k}][${j}]=${dist[ik] >= INF ? '∞' : dist[ik]}+${dist[kj] >= INF ? '∞' : dist[kj]}=${throughK >= INF ? '∞' : throughK}`,
            graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
          });

          if (throughK < dist[ij]) {
            dist[ij] = throughK;

            // Track the improved path edge
            if (i < j) {
              activeEdges.push({ source: i, target: j, weight: throughK });
            }

            steps.push({
              type: 'swap',
              array: [...dist],
              highlightedIndices: [ij],
              secondaryIndices: [ik, kj],
              sortedIndices: [...sortedIndices],
              pseudocodeLine: 6,
              description: `Update dist[${i}][${j}] = ${throughK} (via vertex ${k})`,
              graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
            });
          }
        }
      }

      for (let i = 0; i < V; i++) {
        const cellIdx = idx(k, i);
        if (!sortedIndices.includes(cellIdx)) sortedIndices.push(cellIdx);
        const cellIdx2 = idx(i, k);
        if (!sortedIndices.includes(cellIdx2)) sortedIndices.push(cellIdx2);
      }
    }

    const allIndices = Array.from({ length: V * V }, (_, i) => i);
    steps.push({
      type: 'sorted',
      array: [...dist],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: allIndices,
      pseudocodeLine: 7,
      description: `Floyd-Warshall complete. All-pairs shortest paths computed.`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
