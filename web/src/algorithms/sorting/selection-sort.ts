import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const selectionSort: AlgorithmImplementation = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  pseudocode: [
    { line: 0, text: 'procedure selectionSort(A: list)' },
    { line: 1, text: '  n ← length(A)' },
    { line: 2, text: '  for i ← 0 to n - 2 do' },
    { line: 3, text: '    minIdx ← i' },
    { line: 4, text: '    for j ← i + 1 to n - 1 do' },
    { line: 5, text: '      if A[j] < A[minIdx] then' },
    { line: 6, text: '        minIdx ← j' },
    { line: 7, text: '    swap(A[i], A[minIdx])' },
    { line: 8, text: '  return A' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const n = array.length;
    const sortedIndices: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Select current position
      steps.push({
        type: 'select',
        array: [...array],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `Finding minimum in unsorted portion starting at index ${i}`,
      });

      for (let j = i + 1; j < n; j++) {
        // Compare current element with current minimum
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [j, minIdx],
          secondaryIndices: [i],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Comparing ${array[j]} with current min ${array[minIdx]}`,
        });

        if (array[j] < array[minIdx]) {
          minIdx = j;

          // New minimum found
          steps.push({
            type: 'select',
            array: [...array],
            highlightedIndices: [minIdx],
            secondaryIndices: [i],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 6,
            description: `New minimum found: ${array[minIdx]} at index ${minIdx}`,
          });
        }
      }

      // Swap minimum to its final position
      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]];

        steps.push({
          type: 'swap',
          array: [...array],
          highlightedIndices: [i, minIdx],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 7,
          description: `Swapping ${array[i]} into position ${i}`,
        });
      }

      // Mark position as sorted
      sortedIndices.push(i);
      steps.push({
        type: 'sorted',
        array: [...array],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 7,
        description: `${array[i]} is in its final position`,
      });
    }

    // Last element is automatically sorted
    sortedIndices.push(n - 1);
    steps.push({
      type: 'sorted',
      array: [...array],
      highlightedIndices: [n - 1],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 8,
      description: `${array[n - 1]} is in its final position`,
    });

    return steps;
  },
};
