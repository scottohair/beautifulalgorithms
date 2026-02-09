import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { adjListToEdges, createGraphData } from '@/lib/graph-utils';

export const bfs: AlgorithmImplementation = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'graph',
  timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
  spaceComplexity: 'O(V)',
  pseudocode: [
    { line: 0, text: 'procedure BFS(graph, start)' },
    { line: 1, text: '  create queue Q' },
    { line: 2, text: '  mark start as visited' },
    { line: 3, text: '  enqueue start into Q' },
    { line: 4, text: '  while Q is not empty do' },
    { line: 5, text: '    v ← dequeue from Q' },
    { line: 6, text: '    process v' },
    { line: 7, text: '    for each neighbor u of v do' },
    { line: 8, text: '      if u is not visited then' },
    { line: 9, text: '        mark u as visited' },
    { line: 10, text: '        enqueue u into Q' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    const n = input.length;
    if (n === 0) return steps;

    const adjList: number[][] = Array.from({ length: n }, () => []);

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const valueDiff = Math.abs(input[i] - input[j]);
        const indexDiff = Math.abs(i - j);
        if (indexDiff <= 2 || valueDiff <= 1) {
          if (!adjList[i].includes(j)) adjList[i].push(j);
          if (!adjList[j].includes(i)) adjList[j].push(i);
        }
      }
    }

    const edges = adjListToEdges(adjList);
    const baseGraphData = createGraphData(n, edges, false, [...input]);
    const activeEdges: GraphEdge[] = [];

    const visited: boolean[] = new Array(n).fill(false);
    const visitOrder: number[] = [];
    const queue: number[] = [];

    const startNode = 0;
    visited[startNode] = true;
    queue.push(startNode);

    steps.push({
      type: 'select',
      array: [...input],
      highlightedIndices: [startNode],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 3,
      description: `Start BFS from node ${startNode} (value ${input[startNode]})`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    while (queue.length > 0) {
      const v = queue.shift()!;
      visitOrder.push(v);

      steps.push({
        type: 'traverse',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...queue],
        sortedIndices: [...visitOrder.slice(0, -1)],
        pseudocodeLine: 5,
        description: `Dequeue node ${v} (value ${input[v]}). Queue: [${queue.map(q => q).join(', ')}]`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      steps.push({
        type: 'highlight',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...queue],
        sortedIndices: [...visitOrder],
        pseudocodeLine: 6,
        description: `Process node ${v} (value ${input[v]})`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      for (const u of adjList[v]) {
        steps.push({
          type: 'compare',
          array: [...input],
          highlightedIndices: [v, u],
          secondaryIndices: [...queue],
          sortedIndices: [...visitOrder],
          pseudocodeLine: 7,
          description: `Check neighbor ${u} (value ${input[u]}) of node ${v}`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        if (!visited[u]) {
          visited[u] = true;
          queue.push(u);
          activeEdges.push({ source: Math.min(v, u), target: Math.max(v, u) });

          steps.push({
            type: 'insert',
            array: [...input],
            highlightedIndices: [u],
            secondaryIndices: [...queue],
            sortedIndices: [...visitOrder],
            pseudocodeLine: 10,
            description: `Enqueue unvisited node ${u} (value ${input[u]})`,
            graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
          });
        }
      }
    }

    steps.push({
      type: 'sorted',
      array: [...input],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: visitOrder,
      pseudocodeLine: 4,
      description: `BFS complete. Visit order: ${visitOrder.join(' → ')}`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
