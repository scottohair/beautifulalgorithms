import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const countingSort: AlgorithmImplementation = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'sorting',
  timeComplexity: { best: 'O(n + k)', average: 'O(n + k)', worst: 'O(n + k)' },
  spaceComplexity: 'O(n + k)',
  pseudocode: [
    { line: 0, text: 'procedure countingSort(A)' },
    { line: 1, text: '  k ← max(A)' },
    { line: 2, text: '  create count[0..k] = 0' },
    { line: 3, text: '  for each element x in A do' },
    { line: 4, text: '    count[x] ← count[x] + 1' },
    { line: 5, text: '  for i ← 1 to k do' },
    { line: 6, text: '    count[i] ← count[i] + count[i-1]' },
    { line: 7, text: '  for j ← n-1 downto 0 do' },
    { line: 8, text: '    output[count[A[j]] - 1] ← A[j]' },
    { line: 9, text: '    count[A[j]] ← count[A[j]] - 1' },
    { line: 10, text: '  return output' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const n = input.length;

    if (n === 0) return steps;

    // Normalize: ensure all values are non-negative
    const minVal = Math.min(...input);
    const array = input.map(v => v - minVal);
    const k = Math.max(...array);

    // Phase 1: Count occurrences
    const count: number[] = new Array(k + 1).fill(0);

    steps.push({
      type: 'highlight',
      array: [...array],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 2,
      description: `Initialize count array of size ${k + 1}. Values range: ${minVal} to ${minVal + k}`,
    });

    // Count phase
    for (let i = 0; i < n; i++) {
      count[array[i]]++;

      steps.push({
        type: 'select',
        array: [...count],
        highlightedIndices: [array[i]],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 4,
        description: `Count element ${array[i] + minVal}: count[${array[i]}] = ${count[array[i]]}`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: [...count],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 4,
      description: `Count phase complete: [${count.join(', ')}]`,
    });

    // Cumulate phase
    for (let i = 1; i <= k; i++) {
      steps.push({
        type: 'compare',
        array: [...count],
        highlightedIndices: [i, i - 1],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 5,
        description: `Cumulate: count[${i}] = ${count[i]} + count[${i - 1}] = ${count[i - 1]}`,
      });

      count[i] += count[i - 1];

      steps.push({
        type: 'insert',
        array: [...count],
        highlightedIndices: [i],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `count[${i}] = ${count[i]}`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: [...count],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 6,
      description: `Cumulative count: [${count.join(', ')}]`,
    });

    // Place phase: build output array
    const output: number[] = new Array(n).fill(0);
    const sortedIndices: number[] = [];

    for (let j = n - 1; j >= 0; j--) {
      const val = array[j];
      const pos = count[val] - 1;
      output[pos] = val + minVal;
      count[val]--;
      sortedIndices.push(pos);

      steps.push({
        type: 'traverse',
        array: [...output],
        highlightedIndices: [pos],
        secondaryIndices: [],
        sortedIndices: [...sortedIndices],
        pseudocodeLine: 8,
        description: `Place ${val + minVal} (from input[${j}]) at output[${pos}]`,
      });
    }

    // Final sorted array
    steps.push({
      type: 'sorted',
      array: [...output],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: Array.from({ length: n }, (_, i) => i),
      pseudocodeLine: 10,
      description: 'Counting Sort complete. Array is sorted.',
    });

    return steps;
  },
};
