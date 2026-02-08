import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

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
    { line: 3, text: '  MST \u2190 empty set' },
    { line: 4, text: '  for each edge (u, v, w) in sorted order' },
    { line: 5, text: '    if find(u) \u2260 find(v) then' },
    { line: 6, text: '      add edge (u, v) to MST' },
    { line: 7, text: '      union(u, v)' },
    { line: 8, text: '    else skip edge (would form cycle)' },
    { line: 9, text: '  return MST' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;
    if (n === 0) return steps;

    // Union-Find data structure
    const parentUF: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(0);

    function find(x: number): number {
      if (parentUF[x] !== x) {
        parentUF[x] = find(parentUF[x]); // path compression
      }
      return parentUF[x];
    }

    function union(x: number, y: number): boolean {
      const px = find(x);
      const py = find(y);
      if (px === py) return false;
      // Union by rank
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

    // Build edge list
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

    // Sort edges by weight
    edges.sort((a, b) => a.weight - b.weight);

    // Display edge weights as array for visualization
    const edgeWeights = edges.map(e => e.weight);

    steps.push({
      type: 'highlight',
      array: [...edgeWeights],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Sorted ${edges.length} edges by weight. Initialize union-find.`,
    });

    const mstEdges: number[] = [];
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
        description: `Consider edge (${u}\u2192${v}) with weight ${weight}. Check if they are in the same component.`,
      });

      const rootU = find(u);
      const rootV = find(v);

      if (rootU !== rootV) {
        union(u, v);
        mstEdges.push(i);
        mstVertices.add(u);
        mstVertices.add(v);
        totalWeight += weight;

        steps.push({
          type: 'insert',
          array: [...input],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 6,
          description: `Add edge (${u}\u2192${v}), weight ${weight} to MST. Total weight: ${totalWeight}`,
        });

        steps.push({
          type: 'traverse',
          array: [...input],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 7,
          description: `Union sets of ${u} and ${v}. MST has ${mstEdges.length} edge(s).`,
        });

        // Early termination: MST has V-1 edges
        if (mstEdges.length === n - 1) {
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
          description: `Skip edge (${u}\u2192${v}): same component, would form cycle.`,
        });
      }
    }

    // Final state
    steps.push({
      type: 'sorted',
      array: [...input],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [...mstVertices],
      pseudocodeLine: 9,
      description: `Kruskal's MST complete. ${mstEdges.length} edges, total weight: ${totalWeight}`,
    });

    return steps;
  },
};
