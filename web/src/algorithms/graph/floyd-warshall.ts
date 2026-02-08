import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

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

    // Number of vertices derived from input length
    const V = Math.min(Math.max(Math.floor(Math.sqrt(input.length)), 3), 6);
    const INF = 999;

    // Build distance matrix from input values
    // Flatten: dist[i][j] = dist[i * V + j]
    const dist: number[] = new Array(V * V).fill(INF);

    // Self-distances are 0
    for (let i = 0; i < V; i++) {
      dist[i * V + i] = 0;
    }

    // Create edges from input values
    // Use input values to determine edge weights between adjacent nodes
    for (let i = 0; i < V; i++) {
      for (let j = i + 1; j < V; j++) {
        const inputIdx = i * V + j;
        if (inputIdx < input.length) {
          const weight = (Math.abs(input[inputIdx]) % 9) + 1; // weight 1-9
          dist[i * V + j] = weight;
          dist[j * V + i] = weight; // undirected
        } else if (j === i + 1) {
          // Ensure connected graph: adjacent nodes always have an edge
          const weight = (Math.abs(input[i % input.length]) % 9) + 1;
          dist[i * V + j] = weight;
          dist[j * V + i] = weight;
        }
      }
    }

    const idx = (i: number, j: number) => i * V + j;

    // Show initial distance matrix
    steps.push({
      type: 'highlight',
      array: [...dist],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Initialize ${V}x${V} distance matrix. ∞ = ${INF}`,
    });

    const sortedIndices: number[] = [];

    // Floyd-Warshall main loop
    for (let k = 0; k < V; k++) {
      steps.push({
        type: 'pass-complete',
        array: [...dist],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 2,
        description: `Intermediate vertex k = ${k}`,
      });

      for (let i = 0; i < V; i++) {
        for (let j = 0; j < V; j++) {
          if (i === j) continue;

          const ij = idx(i, j);
          const ik = idx(i, k);
          const kj = idx(k, j);
          const throughK = dist[ik] + dist[kj];

          // Show comparison
          steps.push({
            type: 'compare',
            array: [...dist],
            highlightedIndices: [ij],
            secondaryIndices: [ik, kj],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 5,
            description: `dist[${i}][${j}]=${dist[ij] >= INF ? '∞' : dist[ij]} vs dist[${i}][${k}]+dist[${k}][${j}]=${dist[ik] >= INF ? '∞' : dist[ik]}+${dist[kj] >= INF ? '∞' : dist[kj]}=${throughK >= INF ? '∞' : throughK}`,
          });

          if (throughK < dist[ij]) {
            dist[ij] = throughK;

            steps.push({
              type: 'swap',
              array: [...dist],
              highlightedIndices: [ij],
              secondaryIndices: [ik, kj],
              sortedIndices: [...sortedIndices],
              pseudocodeLine: 6,
              description: `Update dist[${i}][${j}] = ${throughK} (via vertex ${k})`,
            });
          }
        }
      }

      // Mark k-related entries as processed
      for (let i = 0; i < V; i++) {
        const cellIdx = idx(k, i);
        if (!sortedIndices.includes(cellIdx)) sortedIndices.push(cellIdx);
        const cellIdx2 = idx(i, k);
        if (!sortedIndices.includes(cellIdx2)) sortedIndices.push(cellIdx2);
      }
    }

    // Mark all as complete
    const allIndices = Array.from({ length: V * V }, (_, i) => i);
    steps.push({
      type: 'sorted',
      array: [...dist],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: allIndices,
      pseudocodeLine: 7,
      description: `Floyd-Warshall complete. All-pairs shortest paths computed.`,
    });

    return steps;
  },
};
