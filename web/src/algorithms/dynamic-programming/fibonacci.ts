import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const fibonacciDP: AlgorithmImplementation = {
  id: 'fibonacci-dp',
  name: 'Fibonacci (Dynamic Programming)',
  category: 'dynamic-programming',
  timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure fibonacci(n)' },
    { line: 1, text: '  create table dp[0..n]' },
    { line: 2, text: '  dp[0] ← 0' },
    { line: 3, text: '  dp[1] ← 1' },
    { line: 4, text: '  for i ← 2 to n do' },
    { line: 5, text: '    dp[i] ← dp[i-1] + dp[i-2]' },
    { line: 6, text: '  return dp[n]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Use the length of input to determine n, clamped to a reasonable range
    const n = Math.min(Math.max(input.length, 2), 20);

    // Initialize DP table
    const dp: number[] = new Array(n + 1).fill(0);
    const sortedIndices: number[] = [];

    // Show initial table
    steps.push({
      type: 'highlight',
      array: [...dp],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Create DP table of size ${n + 1}, initialized to 0`,
    });

    // Base case: dp[0] = 0
    dp[0] = 0;
    sortedIndices.push(0);
    steps.push({
      type: 'select',
      array: [...dp],
      highlightedIndices: [0],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 2,
      description: `Set dp[0] = 0 (base case)`,
    });

    // Base case: dp[1] = 1
    if (n >= 1) {
      dp[1] = 1;
      sortedIndices.push(1);
      steps.push({
        type: 'select',
        array: [...dp],
        highlightedIndices: [1],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `Set dp[1] = 1 (base case)`,
      });
    }

    // Bottom-up tabulation
    for (let i = 2; i <= n; i++) {
      // Show which two cells we are reading
      steps.push({
        type: 'compare',
        array: [...dp],
        highlightedIndices: [i - 1, i - 2],
        secondaryIndices: [i],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 5,
        description: `Reading dp[${i - 1}] = ${dp[i - 1]} and dp[${i - 2}] = ${dp[i - 2]}`,
      });

      // Compute dp[i]
      dp[i] = dp[i - 1] + dp[i - 2];
      sortedIndices.push(i);

      steps.push({
        type: 'insert',
        array: [...dp],
        highlightedIndices: [i],
        secondaryIndices: [i - 1, i - 2],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 5,
        description: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
      });
    }

    // Final result
    steps.push({
      type: 'sorted',
      array: [...dp],
      highlightedIndices: [n],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 6,
      description: `Fibonacci(${n}) = ${dp[n]}. Table complete.`,
    });

    return steps;
  },
};
