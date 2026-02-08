import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const heapSort: AlgorithmImplementation = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(1)',
  pseudocode: [
    { line: 0, text: 'procedure heapSort(A)' },
    { line: 1, text: '  buildMaxHeap(A)' },
    { line: 2, text: '  for i \u2190 n-1 downto 1 do' },
    { line: 3, text: '    swap A[0] and A[i]' },
    { line: 4, text: '    heapify(A, 0, i)' },
    { line: 5, text: 'procedure heapify(A, i, size)' },
    { line: 6, text: '  largest \u2190 i' },
    { line: 7, text: '  left \u2190 2*i + 1' },
    { line: 8, text: '  right \u2190 2*i + 2' },
    { line: 9, text: '  if left < size and A[left] > A[largest]' },
    { line: 10, text: '    largest \u2190 left' },
    { line: 11, text: '  if right < size and A[right] > A[largest]' },
    { line: 12, text: '    largest \u2190 right' },
    { line: 13, text: '  if largest \u2260 i then' },
    { line: 14, text: '    swap A[i] and A[largest]' },
    { line: 15, text: '    heapify(A, largest, size)' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const n = array.length;
    const sortedIndices: number[] = [];

    function heapify(size: number, i: number): void {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      // Show heapify start
      steps.push({
        type: 'highlight',
        array: [...array],
        highlightedIndices: [i],
        secondaryIndices: [
          ...(left < size ? [left] : []),
          ...(right < size ? [right] : []),
        ],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 6,
        description: `Heapify at index ${i} (value ${array[i]})`,
      });

      if (left < size) {
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [left, largest],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 9,
          description: `Compare left child ${array[left]} with ${array[largest]}`,
        });

        if (array[left] > array[largest]) {
          largest = left;
        }
      }

      if (right < size) {
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [right, largest],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 11,
          description: `Compare right child ${array[right]} with ${array[largest]}`,
        });

        if (array[right] > array[largest]) {
          largest = right;
        }
      }

      if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        steps.push({
          type: 'swap',
          array: [...array],
          highlightedIndices: [i, largest],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 14,
          description: `Swap ${array[i]} and ${array[largest]}`,
        });

        heapify(size, largest);
      }
    }

    // Build max heap
    steps.push({
      type: 'pass-complete',
      array: [...array],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 1,
      description: 'Building max heap',
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(n, i);
    }

    steps.push({
      type: 'pass-complete',
      array: [...array],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 1,
      description: 'Max heap built',
    });

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      // Swap root (max) with last unsorted element
      [array[0], array[i]] = [array[i], array[0]];
      steps.push({
        type: 'swap',
        array: [...array],
        highlightedIndices: [0, i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `Swap max element ${array[i]} with ${array[0]}`,
      });

      // Mark as sorted
      sortedIndices.push(i);
      steps.push({
        type: 'sorted',
        array: [...array],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 3,
        description: `${array[i]} is now in its final position`,
      });

      // Restore heap property
      heapify(i, 0);
    }

    // Mark the last remaining element as sorted
    sortedIndices.push(0);
    steps.push({
      type: 'sorted',
      array: [...array],
      highlightedIndices: [0],
      secondaryIndices: [],
      sortedIndices: [...sortedIndices],
      pseudocodeLine: 0,
      description: `${array[0]} is now in its final position. Array is fully sorted.`,
    });

    return steps;
  },
};
