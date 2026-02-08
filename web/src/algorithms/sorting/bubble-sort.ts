import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const bubbleSort: AlgorithmImplementation = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  pseudocode: [
    { line: 0, text: 'procedure bubbleSort(A: list)' },
    { line: 1, text: '  n ← length(A)' },
    { line: 2, text: '  for i ← 0 to n-1 do' },
    { line: 3, text: '    swapped ← false' },
    { line: 4, text: '    for j ← 0 to n-i-2 do' },
    { line: 5, text: '      if A[j] > A[j+1] then' },
    { line: 6, text: '        swap(A[j], A[j+1])' },
    { line: 7, text: '        swapped ← true' },
    { line: 8, text: '    if not swapped then' },
    { line: 9, text: '      break' },
    { line: 10, text: '  return A' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const n = array.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [j, j + 1],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Comparing ${array[j]} and ${array[j + 1]}`,
        });

        if (array[j] > array[j + 1]) {
          // Swap
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swapped = true;

          steps.push({
            type: 'swap',
            array: [...array],
            highlightedIndices: [j, j + 1],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 6,
            description: `Swapping ${array[j]} and ${array[j + 1]}`,
          });
        }
      }

      sortedIndices.push(n - i - 1);
      steps.push({
        type: 'sorted',
        array: [...array],
        highlightedIndices: [n - i - 1],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 8,
        description: `${array[n - i - 1]} is in its final position`,
      });

      if (!swapped) break;
    }

    return steps;
  },
};
