import type { AlgorithmImplementation, AlgorithmStep, GraphEdge } from '@/lib/types/algorithm';
import { adjListToEdges, createGraphData } from '@/lib/graph-utils';

export const dfs: AlgorithmImplementation = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'graph',
  timeComplexity: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
  spaceComplexity: 'O(V)',
  pseudocode: [
    { line: 0, text: 'procedure DFS(graph, start)' },
    { line: 1, text: '  create stack S' },
    { line: 2, text: '  push start onto S' },
    { line: 3, text: '  while S is not empty do' },
    { line: 4, text: '    v ← pop from S' },
    { line: 5, text: '    if v is not visited then' },
    { line: 6, text: '      mark v as visited' },
    { line: 7, text: '      process v' },
    { line: 8, text: '      for each neighbor u of v do' },
    { line: 9, text: '        if u is not visited then' },
    { line: 10, text: '          push u onto S' },
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
    const stack: number[] = [];

    const startNode = 0;
    stack.push(startNode);

    steps.push({
      type: 'select',
      array: [...input],
      highlightedIndices: [startNode],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 2,
      description: `Start DFS from node ${startNode} (value ${input[startNode]})`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    while (stack.length > 0) {
      const v = stack.pop()!;

      steps.push({
        type: 'traverse',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...stack],
        sortedIndices: [...visitOrder],
        pseudocodeLine: 4,
        description: `Pop node ${v} (value ${input[v]}) from stack. Stack: [${stack.join(', ')}]`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      if (visited[v]) {
        steps.push({
          type: 'compare',
          array: [...input],
          highlightedIndices: [v],
          secondaryIndices: [...stack],
          sortedIndices: [...visitOrder],
          pseudocodeLine: 5,
          description: `Node ${v} already visited, skip`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });
        continue;
      }

      visited[v] = true;
      visitOrder.push(v);

      // Track DFS tree edge from parent (the last visited node that connects to v)
      if (visitOrder.length > 1) {
        // Find the parent: the most recently visited node that has v as neighbor
        for (let k = visitOrder.length - 2; k >= 0; k--) {
          const parent = visitOrder[k];
          if (adjList[parent].includes(v)) {
            activeEdges.push({ source: Math.min(parent, v), target: Math.max(parent, v) });
            break;
          }
        }
      }

      steps.push({
        type: 'highlight',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...stack],
        sortedIndices: [...visitOrder],
        pseudocodeLine: 7,
        description: `Process node ${v} (value ${input[v]})`,
        graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
      });

      const neighbors = [...adjList[v]].reverse();
      for (const u of neighbors) {
        steps.push({
          type: 'compare',
          array: [...input],
          highlightedIndices: [v, u],
          secondaryIndices: [...stack],
          sortedIndices: [...visitOrder],
          pseudocodeLine: 8,
          description: `Check neighbor ${u} (value ${input[u]}) of node ${v}`,
          graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
        });

        if (!visited[u]) {
          stack.push(u);

          steps.push({
            type: 'insert',
            array: [...input],
            highlightedIndices: [u],
            secondaryIndices: [...stack],
            sortedIndices: [...visitOrder],
            pseudocodeLine: 10,
            description: `Push unvisited node ${u} (value ${input[u]}) onto stack`,
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
      pseudocodeLine: 3,
      description: `DFS complete. Visit order: ${visitOrder.join(' → ')}`,
      graphData: { ...baseGraphData, activeEdges: [...activeEdges] },
    });

    return steps;
  },
};
