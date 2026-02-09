import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { directedAdjListToEdges, createGraphData } from '@/lib/graph-utils';

export const topologicalSort: AlgorithmImplementation = {
  id: 'topological-sort',
  name: 'Topological Sort',
  category: 'graph',
  timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
  spaceComplexity: 'O(V)',
  pseudocode: [
    { line: 0, text: "procedure topologicalSort(graph)" },
    { line: 1, text: '  compute in-degree for each vertex' },
    { line: 2, text: '  create queue Q' },
    { line: 3, text: '  enqueue all vertices with in-degree 0' },
    { line: 4, text: '  while Q is not empty do' },
    { line: 5, text: '    v ← dequeue from Q' },
    { line: 6, text: '    add v to result' },
    { line: 7, text: '    for each neighbor u of v do' },
    { line: 8, text: '      in-degree[u] ← in-degree[u] - 1' },
    { line: 9, text: '      if in-degree[u] = 0 then' },
    { line: 10, text: '        enqueue u into Q' },
    { line: 11, text: '  return result' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    const n = input.length;
    if (n === 0) return steps;

    const adjList: number[][] = Array.from({ length: n }, () => []);
    const inDegree: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < Math.min(i + 3, n); j++) {
        let from: number, to: number;
        if (input[i] <= input[j]) {
          from = i;
          to = j;
        } else {
          from = j;
          to = i;
        }
        if (!adjList[from].includes(to)) {
          adjList[from].push(to);
          inDegree[to]++;
        }
      }
    }

    const graphEdges = directedAdjListToEdges(adjList);
    const baseGraphData = createGraphData(n, graphEdges, true, [...input]);
    const activeEdges: GraphEdge[] = [];

    const displayArray = [...input];

    steps.push({
      type: 'highlight',
      array: [...inDegree],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Computed in-degrees: [${inDegree.join(', ')}]`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    const queue: number[] = [];
    const result: number[] = [];
    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) {
        queue.push(i);

        steps.push({
          type: 'insert',
          array: [...inDegree],
          highlightedIndices: [i],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 3,
          description: `Enqueue node ${i} (value ${displayArray[i]}) with in-degree 0`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });
      }
    }

    steps.push({
      type: 'pass-complete',
      array: [...inDegree],
      highlightedIndices: [...queue],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 3,
      description: `Initial queue: [${queue.map(q => `${q}(val=${displayArray[q]})`).join(', ')}]`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    while (queue.length > 0) {
      const v = queue.shift()!;
      result.push(v);
      sortedIndices.push(v);

      steps.push({
        type: 'traverse',
        array: [...inDegree],
        highlightedIndices: [v],
        secondaryIndices: [...queue],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 5,
        description: `Dequeue node ${v} (value ${displayArray[v]}). Queue: [${queue.join(', ')}]`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      steps.push({
        type: 'select',
        array: [...inDegree],
        highlightedIndices: [v],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 6,
        description: `Add node ${v} to result. Order so far: [${result.join(' -> ')}]`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      for (const u of adjList[v]) {
        inDegree[u]--;
        activeEdges.push({ source: v, target: u });

        steps.push({
          type: 'compare',
          array: [...inDegree],
          highlightedIndices: [v, u],
          secondaryIndices: [...queue],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 8,
          description: `Decrement in-degree of node ${u}: now ${inDegree[u]}`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        if (inDegree[u] === 0) {
          queue.push(u);

          steps.push({
            type: 'insert',
            array: [...inDegree],
            highlightedIndices: [u],
            secondaryIndices: [...queue],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 10,
            description: `Node ${u} in-degree is 0, enqueue it`,
            graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
          });
        }
      }
    }

    const hasCycle = result.length !== n;

    steps.push({
      type: 'sorted',
      array: [...displayArray],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 11,
      description: hasCycle
        ? `Cycle detected! Only ${result.length} of ${n} nodes processed.`
        : `Topological order: ${result.map(r => `${r}(${displayArray[r]})`).join(' -> ')}`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
