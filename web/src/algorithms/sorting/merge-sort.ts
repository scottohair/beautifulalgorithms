import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const mergeSort: AlgorithmImplementation = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure mergeSort(A, left, right)' },
    { line: 1, text: '  if left < right then' },
    { line: 2, text: '    mid \u2190 (left + right) / 2' },
    { line: 3, text: '    mergeSort(A, left, mid)' },
    { line: 4, text: '    mergeSort(A, mid+1, right)' },
    { line: 5, text: '    merge(A, left, mid, right)' },
    { line: 6, text: 'procedure merge(A, left, mid, right)' },
    { line: 7, text: '  while i \u2264 mid and j \u2264 right do' },
    { line: 8, text: '    if A[i] \u2264 A[j] then copy A[i]' },
    { line: 9, text: '    else copy A[j]' },
    { line: 10, text: '  copy remaining elements' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const array = [...input];
    const steps: AlgorithmStep[] = [];
    const sortedIndices: number[] = [];

    function mergeSortRecursive(left: number, right: number): void {
      if (left >= right) return;

      const mid = Math.floor((left + right) / 2);

      // Show the split
      steps.push({
        type: 'select',
        array: [...array],
        highlightedIndices: [mid],
        secondaryIndices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 2,
        description: `Split array at index ${mid}: [${left}..${mid}] and [${mid + 1}..${right}]`,
      });

      mergeSortRecursive(left, mid);
      mergeSortRecursive(mid + 1, right);
      merge(left, mid, right);
    }

    function merge(left: number, mid: number, right: number): void {
      const leftArr = array.slice(left, mid + 1);
      const rightArr = array.slice(mid + 1, right + 1);
      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        // Compare step
        steps.push({
          type: 'compare',
          array: [...array],
          highlightedIndices: [left + i, mid + 1 + j],
          secondaryIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 7,
          description: `Comparing ${leftArr[i]} and ${rightArr[j]}`,
        });

        if (leftArr[i] <= rightArr[j]) {
          array[k] = leftArr[i];
          i++;
        } else {
          array[k] = rightArr[j];
          j++;
        }

        // Show merge placement
        steps.push({
          type: 'swap',
          array: [...array],
          highlightedIndices: [k],
          secondaryIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          sortedIndices: [...sortedIndices],
          pseudocodeLine: leftArr[i - 1] !== undefined && i > 0 && array[k] === leftArr[i - 1] ? 8 : 9,
          description: `Place ${array[k]} at position ${k}`,
        });

        k++;
      }

      while (i < leftArr.length) {
        array[k] = leftArr[i];
        steps.push({
          type: 'insert',
          array: [...array],
          highlightedIndices: [k],
          secondaryIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 10,
          description: `Copy remaining element ${leftArr[i]} to position ${k}`,
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        array[k] = rightArr[j];
        steps.push({
          type: 'insert',
          array: [...array],
          highlightedIndices: [k],
          secondaryIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 10,
          description: `Copy remaining element ${rightArr[j]} to position ${k}`,
        });
        j++;
        k++;
      }

      // If this merge covers the full array, mark all as sorted
      if (left === 0 && right === array.length - 1) {
        for (let idx = left; idx <= right; idx++) {
          sortedIndices.push(idx);
        }
        steps.push({
          type: 'sorted',
          array: [...array],
          highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Merged subarray [${left}..${right}] is now sorted`,
        });
      } else {
        steps.push({
          type: 'pass-complete',
          array: [...array],
          highlightedIndices: Array.from({ length: right - left + 1 }, (_, idx) => left + idx),
          secondaryIndices: [],
          sortedIndices: [...sortedIndices],
          pseudocodeLine: 5,
          description: `Merged subarray [${left}..${right}]`,
        });
      }
    }

    mergeSortRecursive(0, array.length - 1);

    return steps;
  },
};
