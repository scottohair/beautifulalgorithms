import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const dijkstra: AlgorithmImplementation = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  category: 'graph',
  timeComplexity: { best: 'O((V+E) log V)', average: 'O((V+E) log V)', worst: 'O((V+E) log V)' },
  spaceComplexity: 'O(V)',
  pseudocode: [
    { line: 0, text: "procedure Dijkstra(graph, source)" },
    { line: 1, text: '  dist[source] \u2190 0' },
    { line: 2, text: '  for each vertex v: dist[v] \u2190 \u221e' },
    { line: 3, text: '  add all vertices to priority queue Q' },
    { line: 4, text: '  while Q is not empty do' },
    { line: 5, text: '    u \u2190 extract-min from Q' },
    { line: 6, text: '    for each neighbor v of u do' },
    { line: 7, text: '      alt \u2190 dist[u] + weight(u, v)' },
    { line: 8, text: '      if alt < dist[v] then' },
    { line: 9, text: '        dist[v] \u2190 alt' },
    { line: 10, text: '        decrease-key v in Q' },
    { line: 11, text: '  return dist' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;
    if (n === 0) return steps;

    // Build a weighted adjacency matrix from input
    // Edge weights derived from value differences
    const weights: number[][] = Array.from({ length: n }, () =>
      new Array(n).fill(Infinity)
    );

    for (let i = 0; i < n; i++) {
      weights[i][i] = 0;
      for (let j = i + 1; j < n; j++) {
        const indexDiff = Math.abs(i - j);
        const valueDiff = Math.abs(input[i] - input[j]);
        // Connect nearby nodes with weight based on value difference
        if (indexDiff <= 2 || valueDiff <= 2) {
          const w = valueDiff + 1; // ensure positive weight
          weights[i][j] = w;
          weights[j][i] = w;
        }
      }
    }

    const source = 0;
    const dist: number[] = new Array(n).fill(Infinity);
    const visited: boolean[] = new Array(n).fill(false);
    const finalized: number[] = [];

    dist[source] = 0;

    // Show initial state
    steps.push({
      type: 'select',
      array: [...dist.map(d => d === Infinity ? -1 : d)],
      highlightedIndices: [source],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Initialize: dist[${source}] = 0, all others = \u221e`,
    });

    // Simple priority queue using linear scan
    for (let count = 0; count < n; count++) {
      // Find unvisited vertex with minimum distance
      let u = -1;
      let minDist = Infinity;
      for (let i = 0; i < n; i++) {
        if (!visited[i] && dist[i] < minDist) {
          minDist = dist[i];
          u = i;
        }
      }

      if (u === -1) break; // remaining vertices unreachable

      visited[u] = true;
      finalized.push(u);

      steps.push({
        type: 'select',
        array: [...dist.map(d => d === Infinity ? -1 : d)],
        highlightedIndices: [u],
        secondaryIndices: [],
        sortedIndices: [...finalized],
        pseudocodeLine: 5,
        description: `Extract min: vertex ${u} with dist = ${dist[u]}`,
      });

      // Relax edges
      for (let v = 0; v < n; v++) {
        if (visited[v] || weights[u][v] === Infinity) continue;

        const alt = dist[u] + weights[u][v];

        steps.push({
          type: 'compare',
          array: [...dist.map(d => d === Infinity ? -1 : d)],
          highlightedIndices: [u, v],
          secondaryIndices: [],
          sortedIndices: [...finalized],
          pseudocodeLine: 7,
          description: `Check edge (${u}\u2192${v}): dist[${u}] + ${weights[u][v]} = ${alt} vs dist[${v}] = ${dist[v] === Infinity ? '\u221e' : dist[v]}`,
        });

        if (alt < dist[v]) {
          dist[v] = alt;

          steps.push({
            type: 'swap',
            array: [...dist.map(d => d === Infinity ? -1 : d)],
            highlightedIndices: [v],
            secondaryIndices: [u],
            sortedIndices: [...finalized],
            pseudocodeLine: 9,
            description: `Relax: dist[${v}] updated to ${alt}`,
          });
        }
      }

      steps.push({
        type: 'pass-complete',
        array: [...dist.map(d => d === Infinity ? -1 : d)],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...finalized],
        pseudocodeLine: 4,
        description: `Vertex ${u} finalized. Distances: [${dist.map(d => d === Infinity ? '\u221e' : d).join(', ')}]`,
      });
    }

    // Final state
    steps.push({
      type: 'sorted',
      array: [...dist.map(d => d === Infinity ? -1 : d)],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: finalized,
      pseudocodeLine: 11,
      description: `Dijkstra complete. Shortest distances from ${source}: [${dist.map(d => d === Infinity ? '\u221e' : d).join(', ')}]`,
    });

    return steps;
  },
};
