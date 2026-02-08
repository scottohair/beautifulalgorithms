import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const lcs: AlgorithmImplementation = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'dynamic-programming',
  timeComplexity: { best: 'O(m * n)', average: 'O(m * n)', worst: 'O(m * n)' },
  spaceComplexity: 'O(m * n)',
  pseudocode: [
    { line: 0, text: 'procedure LCS(X, Y)' },
    { line: 1, text: '  m ← length(X), n ← length(Y)' },
    { line: 2, text: '  create dp[0..m][0..n] = 0' },
    { line: 3, text: '  for i ← 1 to m do' },
    { line: 4, text: '    for j ← 1 to n do' },
    { line: 5, text: '      if X[i-1] = Y[j-1] then' },
    { line: 6, text: '        dp[i][j] ← dp[i-1][j-1] + 1' },
    { line: 7, text: '      else' },
    { line: 8, text: '        dp[i][j] ← max(dp[i-1][j], dp[i][j-1])' },
    { line: 9, text: '  return dp[m][n]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Split input into two sequences for LCS comparison
    const mid = Math.floor(input.length / 2);
    const X = input.slice(0, mid);
    const Y = input.slice(mid);
    const m = X.length;
    const n = Y.length;

    if (m === 0 || n === 0) {
      steps.push({
        type: 'sorted',
        array: [0],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [0],
        pseudocodeLine: 9,
        description: 'One or both sequences are empty. LCS length = 0.',
      });
      return steps;
    }

    // Flattened 2D DP table: dp[i][j] stored at index i * (n+1) + j
    const cols = n + 1;
    const rows = m + 1;
    const dp: number[] = new Array(rows * cols).fill(0);
    const sortedIndices: number[] = [];

    // Helper to convert 2D index to flat index
    const idx = (i: number, j: number) => i * cols + j;

    // Show initialization
    steps.push({
      type: 'highlight',
      array: [...dp],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 2,
      description: `Initialize ${rows}x${cols} DP table. X=[${X.join(',')}], Y=[${Y.join(',')}]`,
    });

    // Mark base cases (row 0 and col 0) as solved
    for (let i = 0; i <= m; i++) sortedIndices.push(idx(i, 0));
    for (let j = 1; j <= n; j++) sortedIndices.push(idx(0, j));

    steps.push({
      type: 'select',
      array: [...dp],
      highlightedIndices: [idx(0, 0)],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 2,
      description: 'Base cases: first row and first column are all 0',
    });

    // Fill DP table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const current = idx(i, j);
        const diag = idx(i - 1, j - 1);
        const up = idx(i - 1, j);
        const left = idx(i, j - 1);

        // Compare characters
        steps.push({
          type: 'compare',
          array: [...dp],
          highlightedIndices: [current],
          secondaryIndices: [diag, up, left],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Compare X[${i - 1}]=${X[i - 1]} with Y[${j - 1}]=${Y[j - 1]}`,
        });

        if (X[i - 1] === Y[j - 1]) {
          // Match: take diagonal + 1
          dp[current] = dp[diag] + 1;

          steps.push({
            type: 'insert',
            array: [...dp],
            highlightedIndices: [current],
            secondaryIndices: [diag],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 6,
            description: `Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[current]}`,
          });
        } else {
          // No match: take max of up and left
          dp[current] = Math.max(dp[up], dp[left]);

          steps.push({
            type: 'insert',
            array: [...dp],
            highlightedIndices: [current],
            secondaryIndices: [up, left],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 8,
            description: `No match. dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dp[up]}, ${dp[left]}) = ${dp[current]}`,
          });
        }

        sortedIndices.push(current);
      }

      // Row complete
      steps.push({
        type: 'pass-complete',
        array: [...dp],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `Row ${i} complete`,
      });
    }

    // Final result
    steps.push({
      type: 'sorted',
      array: [...dp],
      highlightedIndices: [idx(m, n)],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 9,
      description: `LCS length = ${dp[idx(m, n)]}. Table complete.`,
    });

    return steps;
  },
};
