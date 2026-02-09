import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { weightMatrixToEdges, createGraphData } from '@/lib/graph-utils';

export const prim: AlgorithmImplementation = {
  id: 'prim',
  name: "Prim's Algorithm",
  category: 'graph',
  timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
  spaceComplexity: 'O(V)',
  pseudocode: [
    { line: 0, text: "procedure Prim(graph)" },
    { line: 1, text: '  key[0] ← 0, key[v] ← ∞ for all other v' },
    { line: 2, text: '  inMST[] ← false for all vertices' },
    { line: 3, text: '  while there are vertices not in MST do' },
    { line: 4, text: '    u ← vertex with minimum key not in MST' },
    { line: 5, text: '    add u to MST' },
    { line: 6, text: '    for each neighbor v of u do' },
    { line: 7, text: '      if v not in MST and weight(u,v) < key[v]' },
    { line: 8, text: '        key[v] ← weight(u, v)' },
    { line: 9, text: '        parent[v] ← u' },
    { line: 10, text: '  return MST edges' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;
    if (n === 0) return steps;

    const weights: number[][] = Array.from({ length: n }, () =>
      new Array(n).fill(Infinity)
    );

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const indexDiff = Math.abs(i - j);
        const valueDiff = Math.abs(input[i] - input[j]);
        if (indexDiff <= 2 || valueDiff <= 2) {
          const w = valueDiff + 1;
          weights[i][j] = w;
          weights[j][i] = w;
        }
      }
    }

    const graphEdges = weightMatrixToEdges(weights, n);
    const baseGraphData = createGraphData(n, graphEdges, false, [...input]);
    const activeEdges: GraphEdge[] = [];

    const key: number[] = new Array(n).fill(Infinity);
    const inMST: boolean[] = new Array(n).fill(false);
    const parent: number[] = new Array(n).fill(-1);
    const mstVertices: number[] = [];
    let totalWeight = 0;

    key[0] = 0;

    steps.push({
      type: 'select',
      array: [...key.map(k => k === Infinity ? -1 : k)],
      highlightedIndices: [0],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Initialize: key[0] = 0, all others = ∞`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    for (let count = 0; count < n; count++) {
      let u = -1;
      let minKey = Infinity;
      for (let i = 0; i < n; i++) {
        if (!inMST[i] && key[i] < minKey) {
          minKey = key[i];
          u = i;
        }
      }

      if (u === -1) break;

      inMST[u] = true;
      mstVertices.push(u);
      if (parent[u] !== -1) {
        totalWeight += weights[parent[u]][u];
        activeEdges.push({ source: Math.min(parent[u], u), target: Math.max(parent[u], u), weight: weights[parent[u]][u] });
      }

      steps.push({
        type: 'select',
        array: [...key.map(k => k === Infinity ? -1 : k)],
        highlightedIndices: [u],
        secondaryIndices: parent[u] >= 0 ? [parent[u]] : [],
        sortedIndices: [...mstVertices],
        pseudocodeLine: 4,
        description: `Select vertex ${u} with min key = ${minKey}${parent[u] >= 0 ? `. Edge (${parent[u]}→${u}) added to MST.` : '. Starting vertex.'}`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      for (let v = 0; v < n; v++) {
        if (inMST[v] || weights[u][v] === Infinity) continue;

        steps.push({
          type: 'compare',
          array: [...key.map(k => k === Infinity ? -1 : k)],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...mstVertices],
          pseudocodeLine: 7,
          description: `Check edge (${u}→${v}): weight ${weights[u][v]} vs key[${v}] = ${key[v] === Infinity ? '∞' : key[v]}`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        if (weights[u][v] < key[v]) {
          key[v] = weights[u][v];
          parent[v] = u;

          steps.push({
            type: 'swap',
            array: [...key.map(k => k === Infinity ? -1 : k)],
            highlightedIndices: [v],
            secondaryIndices: [u],
            sortedIndices: [...mstVertices],
            pseudocodeLine: 8,
            description: `Update key[${v}] = ${weights[u][v]}, parent[${v}] = ${u}`,
            graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
          });
        }
      }

      steps.push({
        type: 'pass-complete',
        array: [...key.map(k => k === Infinity ? -1 : k)],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...mstVertices],
        pseudocodeLine: 3,
        description: `Vertex ${u} added to MST. Total MST weight so far: ${totalWeight}`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });
    }

    steps.push({
      type: 'sorted',
      array: [...input],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: mstVertices,
      pseudocodeLine: 10,
      description: `Prim's MST complete. Total weight: ${totalWeight}. MST vertices order: [${mstVertices.join(', ')}]`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
