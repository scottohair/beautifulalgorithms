import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const skewHeap: AlgorithmImplementation = {
  id: 'skew-heap',
  name: 'Skew Heap',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(log n) amortized', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure merge(h1, h2)' },
    { line: 1, text: '  if h1 is null, return h2 (and vice versa)' },
    { line: 2, text: '  ensure h1.key \u2264 h2.key (swap if needed)' },
    { line: 3, text: '  h1.right \u2190 merge(h1.right, h2)' },
    { line: 4, text: '  swap h1.left and h1.right (unconditional)' },
    { line: 5, text: '  return h1' },
    { line: 6, text: 'procedure insert(heap, value)' },
    { line: 7, text: '  return merge(heap, new node(value))' },
    { line: 8, text: 'procedure extractMin(heap)' },
    { line: 9, text: '  min \u2190 heap.key' },
    { line: 10, text: '  return merge(heap.left, heap.right)' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    class SkewNode {
      key: number;
      left: SkewNode | null;
      right: SkewNode | null;

      constructor(key: number) {
        this.key = key;
        this.left = null;
        this.right = null;
      }
    }

    let root: SkewNode | null = null;

    function flatten(node: SkewNode | null): number[] {
      if (node === null) return [];
      const result: number[] = [];
      // Level-order traversal for visualization
      const queue: SkewNode[] = [node];
      while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current.key);
        if (current.left !== null) queue.push(current.left);
        if (current.right !== null) queue.push(current.right);
      }
      return result;
    }

    function merge(h1: SkewNode | null, h2: SkewNode | null): SkewNode | null {
      if (h1 === null) {
        if (h2 !== null) {
          steps.push({
            type: 'highlight',
            array: flatten(h2),
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: `Merge: h1 is null, return h2 (root=${h2.key})`,
          });
        }
        return h2;
      }
      if (h2 === null) {
        return h1;
      }

      // Ensure h1 has the smaller key
      if (h1.key > h2.key) {
        steps.push({
          type: 'compare',
          array: [...flatten(h1), ...flatten(h2)],
          highlightedIndices: [0],
          secondaryIndices: [flatten(h1).length],
          sortedIndices: [],
          pseudocodeLine: 2,
          description: `Merge: ${h1.key} > ${h2.key}, swap so smaller root comes first`,
        });
        const temp = h1;
        h1 = h2;
        h2 = temp;
      } else {
        steps.push({
          type: 'compare',
          array: [...flatten(h1), ...flatten(h2)],
          highlightedIndices: [0],
          secondaryIndices: [flatten(h1).length],
          sortedIndices: [],
          pseudocodeLine: 2,
          description: `Merge: ${h1.key} \u2264 ${h2.key}, h1 root stays`,
        });
      }

      // Recursively merge h1.right with h2
      steps.push({
        type: 'traverse',
        array: flatten(h1),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 3,
        description: `Recursively merge right subtree of ${h1.key} with ${h2.key}`,
      });

      h1.right = merge(h1.right, h2);

      // Unconditional swap of left and right children (the skew heap difference)
      steps.push({
        type: 'swap',
        array: flatten(h1),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 4,
        description: `Unconditional swap: swap left and right children of ${h1.key}`,
      });

      const temp = h1.left;
      h1.left = h1.right;
      h1.right = temp;

      return h1;
    }

    function insert(value: number): void {
      const newNode = new SkewNode(value);

      steps.push({
        type: 'insert',
        array: [...flatten(root), value],
        highlightedIndices: [flatten(root).length],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Insert ${value}: create single node and merge with heap`,
      });

      root = merge(root, newNode);
    }

    function extractMin(): number | undefined {
      if (root === null) return undefined;

      const minVal = root.key;

      steps.push({
        type: 'select',
        array: flatten(root),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `ExtractMin: minimum is ${minVal} (root)`,
      });

      const left = root.left;
      const right = root.right;

      steps.push({
        type: 'remove',
        array: [...flatten(left), ...flatten(right)],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 10,
        description: `Remove root ${minVal}, merge left and right subtrees`,
      });

      root = merge(left, right);

      steps.push({
        type: 'highlight',
        array: flatten(root),
        highlightedIndices: root ? [0] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 10,
        description: `After extractMin(${minVal}): new root = ${root ? root.key : 'empty'}`,
      });

      return minVal;
    }

    // Phase 1: Insert all elements
    for (const value of input) {
      insert(value);

      steps.push({
        type: 'highlight',
        array: flatten(root),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Skew heap after inserting ${value}: [${flatten(root).join(', ')}]`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: flatten(root),
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `All elements inserted. Skew heap: [${flatten(root).join(', ')}]`,
    });

    // Phase 2: Extract minimums
    const extractCount = Math.min(3, input.length);
    const extracted: number[] = [];

    for (let i = 0; i < extractCount; i++) {
      const val = extractMin();
      if (val !== undefined) {
        extracted.push(val);
      }
    }

    // Final state
    const finalArr = flatten(root);
    steps.push({
      type: 'sorted',
      array: finalArr,
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: finalArr.map((_, i) => i),
      pseudocodeLine: 10,
      description: `Extracted mins: [${extracted.join(', ')}]. Remaining skew heap: [${finalArr.join(', ')}]`,
    });

    return steps;
  },
};
