import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

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
    { line: 5, text: '    v \u2190 dequeue from Q' },
    { line: 6, text: '    process v' },
    { line: 7, text: '    for each neighbor u of v do' },
    { line: 8, text: '      if u is not visited then' },
    { line: 9, text: '        mark u as visited' },
    { line: 10, text: '        enqueue u into Q' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Build adjacency list from input
    // Treat input values as node labels (0 to n-1)
    // Create edges based on proximity and value relationships
    const n = input.length;
    if (n === 0) return steps;

    const adjList: number[][] = Array.from({ length: n }, () => []);

    // Build a connected graph: connect node i to nodes it can reach
    // Use a simple rule: connect nodes that are within a certain index distance
    // or that have similar values, ensuring the graph is interesting for BFS
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // Connect adjacent indices and those with values differing by 1 or 2
        const valueDiff = Math.abs(input[i] - input[j]);
        const indexDiff = Math.abs(i - j);
        if (indexDiff <= 2 || valueDiff <= 1) {
          if (!adjList[i].includes(j)) adjList[i].push(j);
          if (!adjList[j].includes(i)) adjList[j].push(i);
        }
      }
    }

    // BFS starting from node 0
    const visited: boolean[] = new Array(n).fill(false);
    const visitOrder: number[] = [];
    const queue: number[] = [];

    const startNode = 0;
    visited[startNode] = true;
    queue.push(startNode);

    // Show initial state
    steps.push({
      type: 'select',
      array: [...input],
      highlightedIndices: [startNode],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 3,
      description: `Start BFS from node ${startNode} (value ${input[startNode]})`,
    });

    while (queue.length > 0) {
      const v = queue.shift()!;
      visitOrder.push(v);

      // Dequeue and process
      steps.push({
        type: 'traverse',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...queue],
        sortedIndices: [...visitOrder.slice(0, -1)],
        pseudocodeLine: 5,
        description: `Dequeue node ${v} (value ${input[v]}). Queue: [${queue.map(q => q).join(', ')}]`,
      });

      // Visit node
      steps.push({
        type: 'highlight',
        array: [...input],
        highlightedIndices: [v],
        secondaryIndices: [...queue],
        sortedIndices: [...visitOrder],
        pseudocodeLine: 6,
        description: `Process node ${v} (value ${input[v]})`,
      });

      // Check neighbors
      for (const u of adjList[v]) {
        steps.push({
          type: 'compare',
          array: [...input],
          highlightedIndices: [v, u],
          secondaryIndices: [...queue],
          sortedIndices: [...visitOrder],
          pseudocodeLine: 7,
          description: `Check neighbor ${u} (value ${input[u]}) of node ${v}`,
        });

        if (!visited[u]) {
          visited[u] = true;
          queue.push(u);

          steps.push({
            type: 'insert',
            array: [...input],
            highlightedIndices: [u],
            secondaryIndices: [...queue],
            sortedIndices: [...visitOrder],
            pseudocodeLine: 10,
            description: `Enqueue unvisited node ${u} (value ${input[u]})`,
          });
        }
      }
    }

    // Final state: all visited
    steps.push({
      type: 'sorted',
      array: [...input],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: visitOrder,
      pseudocodeLine: 4,
      description: `BFS complete. Visit order: ${visitOrder.join(' \u2192 ')}`,
    });

    return steps;
  },
};
