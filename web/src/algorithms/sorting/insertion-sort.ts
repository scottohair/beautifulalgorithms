import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const insertionSort: AlgorithmImplementation = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  pseudocode: [
    { line: 0, text: 'procedure insertionSort(A: list)' },
    { line: 1, text: '  for i ← 1 to length(A) - 1 do' },
    { line: 2, text: '    key ← A[i]' },
    { line: 3, text: '    j ← i - 1' },
    { line: 4, text: '    while j ≥ 0 and A[j] > key do' },
    { line: 5, text: '      A[j+1] ← A[j]' },
    { line: 6, text: '      j ← j - 1' },
    { line: 7, text: '    A[j+1] ← key' },
    { line: 8, text: '  return A' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const sortedIndices: number[] = [0]; // First element is trivially sorted

    for (let i = 1; i < array.length; i++) {
      const key = array[i];
      let j = i - 1;

      // Highlight key being inserted
      steps.push({
        type: 'select',
        array: [...array],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 2,
        description: `Key = ${key}, inserting into sorted portion`,
      });

      while (j >= 0 && array[j] > key) {
        // Compare
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [j, j + 1],
          secondaryIndices: [i],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 4,
          description: `Comparing ${array[j]} > ${key}`,
        });

        // Shift right
        array[j + 1] = array[j];
        steps.push({
          type: 'swap',
          array: [...array],
          highlightedIndices: [j, j + 1],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Shifting ${array[j]} to the right`,
        });
        j--;
      }

      // Insert key
      array[j + 1] = key;
      sortedIndices.push(i);
      steps.push({
        type: 'sorted',
        array: [...array],
        highlightedIndices: [j + 1],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 7,
        description: `Inserted ${key} at position ${j + 1}`,
      });
    }

    return steps;
  },
};
