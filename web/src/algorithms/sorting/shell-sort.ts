import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const shellSort: AlgorithmImplementation = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n log n)', average: 'O(n^(3/2))', worst: 'O(n²)' },
  spaceComplexity: 'O(1)',
  pseudocode: [
    { line: 0, text: 'procedure shellSort(A)' },
    { line: 1, text: '  n ← length(A)' },
    { line: 2, text: '  gap ← floor(n / 2)' },
    { line: 3, text: '  while gap > 0 do' },
    { line: 4, text: '    for i ← gap to n-1 do' },
    { line: 5, text: '      temp ← A[i]' },
    { line: 6, text: '      j ← i' },
    { line: 7, text: '      while j ≥ gap and A[j - gap] > temp do' },
    { line: 8, text: '        A[j] ← A[j - gap]' },
    { line: 9, text: '        j ← j - gap' },
    { line: 10, text: '      A[j] ← temp' },
    { line: 11, text: '    gap ← floor(gap / 2)' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const n = array.length;
    const sortedIndices: number[] = [];

    let gap = Math.floor(n / 2);

    // Show initial state
    steps.push({
      type: 'highlight',
      array: [...array],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `Starting Shell Sort with ${n} elements`,
    });

    while (gap > 0) {
      steps.push({
        type: 'pass-complete',
        array: [...array],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 2,
        description: `Gap = ${gap}`,
      });

      for (let i = gap; i < n; i++) {
        const temp = array[i];
        let j = i;

        // Show element being inserted
        steps.push({
          type: 'select',
          array: [...array],
          highlightedIndices: [i],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Pick element A[${i}] = ${temp} for gap-insertion (gap=${gap})`,
        });

        while (j >= gap && array[j - gap] > temp) {
          // Compare
          steps.push({
            type: 'compare',
            array: [...array],
            highlightedIndices: [j, j - gap],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 7,
            description: `Compare A[${j - gap}] = ${array[j - gap]} > ${temp}? Yes`,
          });

          // Shift
          array[j] = array[j - gap];
          steps.push({
            type: 'swap',
            array: [...array],
            highlightedIndices: [j, j - gap],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 8,
            description: `Shift A[${j - gap}] = ${array[j - gap]} to position ${j}`,
          });

          j -= gap;
        }

        if (j >= gap) {
          // Show comparison that ends the loop
          steps.push({
            type: 'compare',
            array: [...array],
            highlightedIndices: [j, j - gap],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 7,
            description: `Compare A[${j - gap}] = ${array[j - gap]} > ${temp}? No, stop shifting`,
          });
        }

        // Place temp at final position
        array[j] = temp;
        steps.push({
          type: 'insert',
          array: [...array],
          highlightedIndices: [j],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 10,
          description: `Place ${temp} at position ${j}`,
        });
      }

      gap = Math.floor(gap / 2);

      steps.push({
        type: 'pass-complete',
        array: [...array],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 11,
        description: gap > 0 ? `Pass complete. Next gap = ${gap}` : 'Final pass complete (gap was 1)',
      });
    }

    // Mark all as sorted
    for (let i = 0; i < n; i++) sortedIndices.push(i);
    steps.push({
      type: 'sorted',
      array: [...array],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 0,
      description: 'Shell Sort complete. Array is sorted.',
    });

    return steps;
  },
};
