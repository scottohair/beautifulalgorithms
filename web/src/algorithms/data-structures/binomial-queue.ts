import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const binomialQueue: AlgorithmImplementation = {
  id: 'binomial-queue',
  name: 'Binomial Queue',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(queue, value)' },
    { line: 1, text: '  create single-node tree with value' },
    { line: 2, text: '  merge single-node tree into queue' },
    { line: 3, text: 'procedure merge(h1, h2)' },
    { line: 4, text: '  carry \u2190 null' },
    { line: 5, text: '  for k = 0 to max order' },
    { line: 6, text: '    combine trees of same order (like binary addition)' },
    { line: 7, text: '    attach larger root under smaller root' },
    { line: 8, text: 'procedure extractMin(queue)' },
    { line: 9, text: '  find tree with minimum root' },
    { line: 10, text: '  remove that tree from queue' },
    { line: 11, text: '  reverse its children into a new queue' },
    { line: 12, text: '  merge new queue back into original' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    class BinomialNode {
      key: number;
      order: number;
      children: BinomialNode[];

      constructor(key: number) {
        this.key = key;
        this.order = 0;
        this.children = [];
      }
    }

    // The queue is an array of BinomialNode | null indexed by order
    let trees: (BinomialNode | null)[] = [];

    function flatten(): number[] {
      const result: number[] = [];
      for (const tree of trees) {
        if (tree !== null) {
          flattenTree(tree, result);
        }
      }
      return result;
    }

    function flattenTree(node: BinomialNode, result: number[]): void {
      result.push(node.key);
      for (const child of node.children) {
        flattenTree(child, result);
      }
    }

    function linkTrees(t1: BinomialNode, t2: BinomialNode): BinomialNode {
      // Attach larger root under smaller root
      if (t1.key > t2.key) {
        t2.children.push(t1);
        t2.order = t2.order + 1;
        return t2;
      } else {
        t1.children.push(t2);
        t1.order = t1.order + 1;
        return t1;
      }
    }

    function mergeInto(node: BinomialNode): void {
      let carry: BinomialNode | null = node;
      let k = 0;

      while (carry !== null) {
        if (k >= trees.length) {
          trees.push(null);
        }

        if (trees[k] === null) {
          trees[k] = carry;
          carry = null;
        } else {
          const existing = trees[k]!;

          steps.push({
            type: 'compare',
            array: flatten(),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 6,
            description: `Merge: two order-${k} trees (roots ${existing.key} and ${carry.key}), combine into order-${k + 1}`,
          });

          carry = linkTrees(existing, carry);
          trees[k] = null;

          steps.push({
            type: 'swap',
            array: flatten(),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 7,
            description: `Linked into order-${carry.order} tree with root ${carry.key}`,
          });
        }

        k++;
      }
    }

    function insert(value: number): void {
      const node = new BinomialNode(value);

      steps.push({
        type: 'insert',
        array: [...flatten(), value],
        highlightedIndices: [flatten().length],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `Insert ${value}: create single-node binomial tree`,
      });

      mergeInto(node);
    }

    function findMinIndex(): number {
      let minIdx = -1;
      let minVal = Infinity;
      for (let i = 0; i < trees.length; i++) {
        if (trees[i] !== null && trees[i]!.key < minVal) {
          minVal = trees[i]!.key;
          minIdx = i;
        }
      }
      return minIdx;
    }

    function extractMin(): number | undefined {
      const minIdx = findMinIndex();
      if (minIdx === -1) return undefined;

      const minTree = trees[minIdx]!;
      const minVal = minTree.key;

      steps.push({
        type: 'select',
        array: flatten(),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `Find minimum root: ${minVal} in order-${minIdx} tree`,
      });

      // Remove the min tree
      trees[minIdx] = null;

      steps.push({
        type: 'remove',
        array: flatten(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 10,
        description: `Remove order-${minIdx} tree with root ${minVal}`,
      });

      // Reverse children and merge back
      const children = minTree.children.slice().reverse();

      steps.push({
        type: 'highlight',
        array: flatten(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `Reverse ${children.length} children of removed root into new queue`,
      });

      for (const child of children) {
        mergeInto(child);
      }

      steps.push({
        type: 'traverse',
        array: flatten(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 12,
        description: `Merged children back. Extracted min = ${minVal}. Queue: [${flatten().join(', ')}]`,
      });

      return minVal;
    }

    // Phase 1: Insert all elements
    for (const value of input) {
      insert(value);

      steps.push({
        type: 'highlight',
        array: flatten(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Queue after inserting ${value}: [${flatten().join(', ')}]`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: flatten(),
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `All elements inserted into binomial queue: [${flatten().join(', ')}]`,
    });

    // Phase 2: Extract a few minimums
    const extractCount = Math.min(3, input.length);
    const extracted: number[] = [];

    for (let i = 0; i < extractCount; i++) {
      const min = extractMin();
      if (min !== undefined) {
        extracted.push(min);
      }
    }

    // Final state
    const finalArr = flatten();
    steps.push({
      type: 'sorted',
      array: finalArr,
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: finalArr.map((_, i) => i),
      pseudocodeLine: 12,
      description: `Extracted minimums: [${extracted.join(', ')}]. Remaining queue: [${finalArr.join(', ')}]`,
    });

    return steps;
  },
};
