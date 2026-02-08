import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const minHeap: AlgorithmImplementation = {
  id: 'min-heap',
  name: 'Min Heap',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(heap, value)' },
    { line: 1, text: '  append value to end of heap' },
    { line: 2, text: '  i \u2190 heap.size - 1' },
    { line: 3, text: '  while i > 0 and heap[i] < heap[parent(i)]' },
    { line: 4, text: '    swap heap[i] and heap[parent(i)]' },
    { line: 5, text: '    i \u2190 parent(i)' },
    { line: 6, text: 'procedure extractMin(heap)' },
    { line: 7, text: '  min \u2190 heap[0]' },
    { line: 8, text: '  heap[0] \u2190 heap[last]' },
    { line: 9, text: '  remove last element' },
    { line: 10, text: '  siftDown(heap, 0)' },
    { line: 11, text: '  return min' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const heap: number[] = [];

    function parentIdx(i: number): number {
      return Math.floor((i - 1) / 2);
    }

    function leftChild(i: number): number {
      return 2 * i + 1;
    }

    function rightChild(i: number): number {
      return 2 * i + 2;
    }

    function siftUp(i: number): void {
      while (i > 0) {
        const p = parentIdx(i);

        steps.push({
          type: 'compare',
          array: [...heap],
          highlightedIndices: [i, p],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 3,
          description: `Compare heap[${i}] = ${heap[i]} with parent heap[${p}] = ${heap[p]}`,
        });

        if (heap[i] < heap[p]) {
          // Swap
          [heap[i], heap[p]] = [heap[p], heap[i]];

          steps.push({
            type: 'swap',
            array: [...heap],
            highlightedIndices: [i, p],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: `Swap heap[${i}] and heap[${p}]: ${heap[p]} \u2194 ${heap[i]}`,
          });

          i = p;
        } else {
          break;
        }
      }
    }

    function siftDown(i: number): void {
      const size = heap.length;

      while (true) {
        let smallest = i;
        const left = leftChild(i);
        const right = rightChild(i);

        if (left < size) {
          steps.push({
            type: 'compare',
            array: [...heap],
            highlightedIndices: [smallest, left],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 10,
            description: `Compare heap[${smallest}] = ${heap[smallest]} with left child heap[${left}] = ${heap[left]}`,
          });

          if (heap[left] < heap[smallest]) {
            smallest = left;
          }
        }

        if (right < size) {
          steps.push({
            type: 'compare',
            array: [...heap],
            highlightedIndices: [smallest, right],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 10,
            description: `Compare heap[${smallest}] = ${heap[smallest]} with right child heap[${right}] = ${heap[right]}`,
          });

          if (heap[right] < heap[smallest]) {
            smallest = right;
          }
        }

        if (smallest !== i) {
          [heap[i], heap[smallest]] = [heap[smallest], heap[i]];

          steps.push({
            type: 'swap',
            array: [...heap],
            highlightedIndices: [i, smallest],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 10,
            description: `Sift down: swap heap[${i}] and heap[${smallest}]`,
          });

          i = smallest;
        } else {
          break;
        }
      }
    }

    function insert(value: number): void {
      heap.push(value);

      steps.push({
        type: 'insert',
        array: [...heap],
        highlightedIndices: [heap.length - 1],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `Insert ${value} at end of heap (index ${heap.length - 1})`,
      });

      siftUp(heap.length - 1);
    }

    function extractMin(): number | undefined {
      if (heap.length === 0) return undefined;

      const min = heap[0];

      steps.push({
        type: 'select',
        array: [...heap],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Extract min: ${min} (root of heap)`,
      });

      if (heap.length === 1) {
        heap.pop();
        steps.push({
          type: 'remove',
          array: [...heap],
          highlightedIndices: [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 9,
          description: `Heap is now empty after extracting ${min}`,
        });
        return min;
      }

      // Move last element to root
      heap[0] = heap[heap.length - 1];
      heap.pop();

      steps.push({
        type: 'swap',
        array: [...heap],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 8,
        description: `Move last element ${heap[0]} to root position`,
      });

      // Sift down from root
      siftDown(0);

      steps.push({
        type: 'remove',
        array: [...heap],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `Extracted min = ${min}. Heap restored.`,
      });

      return min;
    }

    // Phase 1: Insert all elements
    for (const value of input) {
      insert(value);

      steps.push({
        type: 'highlight',
        array: [...heap],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 0,
        description: `Heap after inserting ${value}: [${heap.join(', ')}]`,
      });
    }

    // Show the complete heap
    steps.push({
      type: 'pass-complete',
      array: [...heap],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `All elements inserted. Min heap: [${heap.join(', ')}]`,
    });

    // Phase 2: Extract a few minimums to demonstrate
    const extractCount = Math.min(3, heap.length);
    const extracted: number[] = [];

    for (let i = 0; i < extractCount; i++) {
      const min = extractMin();
      if (min !== undefined) {
        extracted.push(min);
      }
    }

    // Final state
    steps.push({
      type: 'sorted',
      array: [...heap],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: heap.map((_, i) => i),
      pseudocodeLine: 11,
      description: `Extracted minimums: [${extracted.join(', ')}]. Remaining heap: [${heap.join(', ')}]`,
    });

    return steps;
  },
};
