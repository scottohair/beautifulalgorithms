import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const changeMaking: AlgorithmImplementation = {
  id: 'change-making',
  name: 'Change Making (Coin Change)',
  category: 'dynamic-programming',
  timeComplexity: { best: 'O(n * amount)', average: 'O(n * amount)', worst: 'O(n * amount)' },
  spaceComplexity: 'O(amount)',
  pseudocode: [
    { line: 0, text: 'procedure coinChange(coins, amount)' },
    { line: 1, text: '  create dp[0..amount], fill with ∞' },
    { line: 2, text: '  dp[0] ← 0' },
    { line: 3, text: '  for i ← 1 to amount do' },
    { line: 4, text: '    for each coin in coins do' },
    { line: 5, text: '      if coin ≤ i then' },
    { line: 6, text: '        dp[i] ← min(dp[i], dp[i - coin] + 1)' },
    { line: 7, text: '  if dp[amount] = ∞ then return -1' },
    { line: 8, text: '  return dp[amount]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Derive coins from unique sorted input values, amount from sum of first few
    const coins = [...new Set(input.map(v => Math.max(1, Math.abs(v))))].sort((a, b) => a - b);
    // Use a reasonable amount: sum of first 3 input values, clamped
    const amount = Math.min(
      input.slice(0, 3).reduce((s, v) => s + Math.abs(v), 0),
      20
    );

    if (amount === 0) {
      steps.push({
        type: 'sorted',
        array: [0],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [0],
        pseudocodeLine: 8,
        description: 'Amount is 0, no coins needed.',
      });
      return steps;
    }

    const INF = amount + 1;
    const dp: number[] = new Array(amount + 1).fill(INF);
    const sortedIndices: number[] = [];

    // Show initialization
    steps.push({
      type: 'highlight',
      array: [...dp],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: `Initialize dp table of size ${amount + 1} with ∞ (${INF}). Coins: [${coins.join(', ')}], Amount: ${amount}`,
    });

    // Base case
    dp[0] = 0;
    sortedIndices.push(0);
    steps.push({
      type: 'select',
      array: [...dp],
      highlightedIndices: [0],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 2,
      description: `Set dp[0] = 0 (base case: 0 coins needed for amount 0)`,
    });

    // Fill DP table
    for (let i = 1; i <= amount; i++) {
      steps.push({
        type: 'highlight',
        array: [...dp],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `Computing minimum coins for amount ${i}`,
      });

      for (const coin of coins) {
        if (coin <= i) {
          const prevIdx = i - coin;

          // Show comparison
          steps.push({
            type: 'compare',
            array: [...dp],
            highlightedIndices: [i, prevIdx],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 5,
            description: `Coin ${coin}: compare dp[${i}] = ${dp[i] >= INF ? '∞' : dp[i]} with dp[${prevIdx}] + 1 = ${dp[prevIdx] >= INF ? '∞' : dp[prevIdx] + 1}`,
          });

          if (dp[prevIdx] + 1 < dp[i]) {
            dp[i] = dp[prevIdx] + 1;

            steps.push({
              type: 'swap',
              array: [...dp],
              highlightedIndices: [i],
              secondaryIndices: [prevIdx],
              sortedIndices: [...sortedIndices],
              pseudocodeLine: 6,
              description: `Update dp[${i}] = dp[${prevIdx}] + 1 = ${dp[i]} (using coin ${coin})`,
            });
          }
        }
      }

      sortedIndices.push(i);
      steps.push({
        type: 'pass-complete',
        array: [...dp],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `dp[${i}] = ${dp[i] >= INF ? '∞ (impossible)' : dp[i]}`,
      });
    }

    // Final result
    const result = dp[amount] >= INF ? -1 : dp[amount];
    steps.push({
      type: 'sorted',
      array: [...dp],
      highlightedIndices: [amount],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 8,
      description: result === -1
        ? `Cannot make amount ${amount} with coins [${coins.join(', ')}]`
        : `Minimum coins for amount ${amount} = ${result}`,
    });

    return steps;
  },
};
