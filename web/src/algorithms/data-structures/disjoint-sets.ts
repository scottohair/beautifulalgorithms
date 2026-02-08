import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const disjointSets: AlgorithmImplementation = {
  id: 'disjoint-sets',
  name: 'Disjoint Sets (Union-Find)',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(\u03B1(n))', worst: 'O(\u03B1(n))' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure makeSet(x)' },
    { line: 1, text: '  parent[x] \u2190 x' },
    { line: 2, text: '  rank[x] \u2190 0' },
    { line: 3, text: 'procedure find(x)' },
    { line: 4, text: '  if parent[x] \u2260 x' },
    { line: 5, text: '    parent[x] \u2190 find(parent[x])  // path compression' },
    { line: 6, text: '  return parent[x]' },
    { line: 7, text: 'procedure union(x, y)' },
    { line: 8, text: '  rx \u2190 find(x), ry \u2190 find(y)' },
    { line: 9, text: '  if rx = ry, return  // already same set' },
    { line: 10, text: '  if rank[rx] < rank[ry]: swap rx, ry' },
    { line: 11, text: '  parent[ry] \u2190 rx  // union by rank' },
    { line: 12, text: '  if rank[rx] = rank[ry]: rank[rx]++' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;

    // Use input values as the elements; parent array indexed 0..n-1
    // parent[i] stores the parent of element i
    // For visualization, the array shows parent values
    const parent: number[] = new Array(n);
    const rank: number[] = new Array(n);

    // Phase 1: MakeSet for each element
    for (let i = 0; i < n; i++) {
      parent[i] = i;
      rank[i] = 0;

      steps.push({
        type: 'insert',
        array: [...parent],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `MakeSet(${i}): parent[${i}] = ${i}, rank[${i}] = 0 (element value: ${input[i]})`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: [...parent],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `All ${n} singleton sets created. Parent array: [${parent.join(', ')}]`,
    });

    function find(x: number): number {
      steps.push({
        type: 'traverse',
        array: [...parent],
        highlightedIndices: [x],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 3,
        description: `Find(${x}): current parent[${x}] = ${parent[x]}`,
      });

      if (parent[x] !== x) {
        steps.push({
          type: 'highlight',
          array: [...parent],
          highlightedIndices: [x, parent[x]],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 5,
          description: `Path compression: find(${parent[x]}) to find root`,
        });

        parent[x] = find(parent[x]);

        steps.push({
          type: 'swap',
          array: [...parent],
          highlightedIndices: [x],
          secondaryIndices: [parent[x]],
          sortedIndices: [],
          pseudocodeLine: 5,
          description: `Path compression: parent[${x}] now points directly to root ${parent[x]}`,
        });
      }

      return parent[x];
    }

    function union(x: number, y: number): void {
      steps.push({
        type: 'highlight',
        array: [...parent],
        highlightedIndices: [x, y],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Union(${x}, ${y}): find representatives`,
      });

      const rx = find(x);
      const ry = find(y);

      steps.push({
        type: 'compare',
        array: [...parent],
        highlightedIndices: [rx, ry],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 8,
        description: `Representatives: find(${x}) = ${rx}, find(${y}) = ${ry}`,
      });

      if (rx === ry) {
        steps.push({
          type: 'highlight',
          array: [...parent],
          highlightedIndices: [rx],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 9,
          description: `${x} and ${y} already in same set (root = ${rx}), skip`,
        });
        return;
      }

      let rootX = rx;
      let rootY = ry;

      // Union by rank
      if (rank[rootX] < rank[rootY]) {
        steps.push({
          type: 'compare',
          array: [...parent],
          highlightedIndices: [rootX, rootY],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 10,
          description: `rank[${rootX}]=${rank[rootX]} < rank[${rootY}]=${rank[rootY]}, swap roots`,
        });
        const temp = rootX;
        rootX = rootY;
        rootY = temp;
      }

      parent[rootY] = rootX;

      steps.push({
        type: 'swap',
        array: [...parent],
        highlightedIndices: [rootY],
        secondaryIndices: [rootX],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `Union by rank: parent[${rootY}] = ${rootX}. Set {${rootY}} merged under {${rootX}}`,
      });

      if (rank[rootX] === rank[rootY]) {
        rank[rootX]++;

        steps.push({
          type: 'highlight',
          array: [...parent],
          highlightedIndices: [rootX],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 12,
          description: `Equal ranks: increment rank[${rootX}] to ${rank[rootX]}`,
        });
      }
    }

    // Phase 2: Perform unions to build interesting structure
    // Union consecutive pairs first
    if (n >= 2) {
      for (let i = 0; i < n - 1; i += 2) {
        union(i, i + 1);

        steps.push({
          type: 'pass-complete',
          array: [...parent],
          highlightedIndices: [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 11,
          description: `After Union(${i}, ${i + 1}): parent = [${parent.join(', ')}]`,
        });
      }
    }

    // Union pairs of pairs to build larger sets
    if (n >= 4) {
      for (let i = 0; i < n - 2; i += 4) {
        union(i, i + 2);

        steps.push({
          type: 'pass-complete',
          array: [...parent],
          highlightedIndices: [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 11,
          description: `After Union(${i}, ${i + 2}): parent = [${parent.join(', ')}]`,
        });
      }
    }

    // Union to create a single connected set if enough elements
    if (n >= 8) {
      union(0, 4);

      steps.push({
        type: 'pass-complete',
        array: [...parent],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `After Union(0, 4): parent = [${parent.join(', ')}]`,
      });
    }

    // Phase 3: Demonstrate path compression with a find on a deep element
    if (n >= 4) {
      const deepElement = n - 1;

      steps.push({
        type: 'highlight',
        array: [...parent],
        highlightedIndices: [deepElement],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 3,
        description: `Demonstrate path compression: Find(${deepElement})`,
      });

      find(deepElement);

      steps.push({
        type: 'highlight',
        array: [...parent],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 5,
        description: `After path compression on ${deepElement}: parent = [${parent.join(', ')}]`,
      });
    }

    // Final state
    steps.push({
      type: 'sorted',
      array: [...parent],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: parent.map((_, i) => i),
      pseudocodeLine: 6,
      description: `Final parent array: [${parent.join(', ')}]. Ranks: [${rank.join(', ')}]`,
    });

    return steps;
  },
};
