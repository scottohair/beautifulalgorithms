import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const quickSort: AlgorithmImplementation = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n\u00b2)' },
  spaceComplexity: 'O(log n)',
  pseudocode: [
    { line: 0, text: 'procedure quickSort(A, low, high)' },
    { line: 1, text: '  if low < high then' },
    { line: 2, text: '    p \u2190 partition(A, low, high)' },
    { line: 3, text: '    quickSort(A, low, p - 1)' },
    { line: 4, text: '    quickSort(A, p + 1, high)' },
    { line: 5, text: 'procedure partition(A, low, high)' },
    { line: 6, text: '  pivot \u2190 A[high]' },
    { line: 7, text: '  i \u2190 low - 1' },
    { line: 8, text: '  for j \u2190 low to high - 1 do' },
    { line: 9, text: '    if A[j] \u2264 pivot then' },
    { line: 10, text: '      i \u2190 i + 1' },
    { line: 11, text: '      swap A[i] and A[j]' },
    { line: 12, text: '  swap A[i+1] and A[high]' },
    { line: 13, text: '  return i + 1' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const sortedIndices: number[] = [];

    function quickSortRecursive(low: number, high: number): void {
      if (low >= high) {
        if (low === high && !sortedIndices.includes(low)) {
          sortedIndices.push(low);
          steps.push({
            type: 'sorted',
            array: [...array],
            highlightedIndices: [low],
            secondaryIndices: [],
            sortedIndices: [...sortedIndices],
            pseudocodeLine: 1,
            description: `Element ${array[low]} is in its final position`,
          });
        }
        return;
      }

      const p = partition(low, high);
      quickSortRecursive(low, p - 1);
      quickSortRecursive(p + 1, high);
    }

    function partition(low: number, high: number): number {
      const pivot = array[high];

      // Highlight pivot selection
      steps.push({
        type: 'select',
        array: [...array],
        highlightedIndices: [high],
        secondaryIndices: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 6,
        description: `Select pivot: ${pivot} (last element)`,
      });

      let i = low - 1;

      for (let j = low; j < high; j++) {
        // Compare with pivot
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [j, high],
          secondaryIndices: i >= low ? [i] : [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 9,
          description: `Compare ${array[j]} with pivot ${pivot}`,
        });

        if (array[j] <= pivot) {
          i++;
          if (i !== j) {
            [array[i], array[j]] = [array[j], array[i]];
            steps.push({
              type: 'swap',
              array: [...array],
              highlightedIndices: [i, j],
              secondaryIndices: [high],
              sortedIndices: [...sortedIndices],
              pseudocodeLine: 11,
              description: `Swap ${array[i]} and ${array[j]}`,
            });
          }
        }
      }

      // Final pivot swap
      const pivotIndex = i + 1;
      if (pivotIndex !== high) {
        [array[pivotIndex], array[high]] = [array[high], array[pivotIndex]];
        steps.push({
          type: 'swap',
          array: [...array],
          highlightedIndices: [pivotIndex, high],
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 12,
          description: `Swap pivot ${pivot} into position ${pivotIndex}`,
        });
      }

      // Mark pivot as sorted
      sortedIndices.push(pivotIndex);
      steps.push({
        type: 'sorted',
        array: [...array],
        highlightedIndices: [pivotIndex],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 13,
        description: `Pivot ${pivot} is now in its final sorted position ${pivotIndex}`,
      });

      return pivotIndex;
    }

    quickSortRecursive(0, array.length - 1);

    return steps;
  },
};
