import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const fibonacciHeap: AlgorithmImplementation = {
  id: 'fibonacci-heap',
  name: 'Fibonacci Heap',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(1) amortized insert', worst: 'O(log n) extractMin' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(heap, value)' },
    { line: 1, text: '  create new node with value' },
    { line: 2, text: '  add node to root list' },
    { line: 3, text: '  update min pointer if needed' },
    { line: 4, text: 'procedure extractMin(heap)' },
    { line: 5, text: '  z \u2190 min node' },
    { line: 6, text: '  add children of z to root list' },
    { line: 7, text: '  remove z from root list' },
    { line: 8, text: '  consolidate()' },
    { line: 9, text: 'procedure consolidate()' },
    { line: 10, text: '  for each node w in root list' },
    { line: 11, text: '    while A[w.degree] exists' },
    { line: 12, text: '      link trees of same degree' },
    { line: 13, text: '  update min pointer' },
    { line: 14, text: 'procedure decreaseKey(node, newKey)' },
    { line: 15, text: '  node.key \u2190 newKey' },
    { line: 16, text: '  if node.key < parent.key: cut and cascading cut' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    class FibNode {
      key: number;
      degree: number;
      marked: boolean;
      parent: FibNode | null;
      child: FibNode | null;
      left: FibNode;
      right: FibNode;

      constructor(key: number) {
        this.key = key;
        this.degree = 0;
        this.marked = false;
        this.parent = null;
        this.child = null;
        this.left = this;
        this.right = this;
      }
    }

    let min: FibNode | null = null;
    let nodeCount = 0;
    const allNodes: FibNode[] = [];

    function flattenRootList(): number[] {
      if (min === null) return [];
      const result: number[] = [];
      let current = min;
      do {
        flattenNode(current, result);
        current = current.right;
      } while (current !== min);
      return result;
    }

    function flattenNode(node: FibNode, result: number[]): void {
      result.push(node.key);
      if (node.child !== null) {
        let child = node.child;
        do {
          flattenNode(child, result);
          child = child.right;
        } while (child !== node.child);
      }
    }

    function addToRootList(node: FibNode): void {
      node.parent = null;
      if (min === null) {
        node.left = node;
        node.right = node;
        min = node;
      } else {
        node.left = min.left;
        node.right = min;
        min.left.right = node;
        min.left = node;
        if (node.key < min.key) {
          min = node;
        }
      }
    }

    function removeFromList(node: FibNode): void {
      if (node.right === node) {
        // Only node in the list
        return;
      }
      node.left.right = node.right;
      node.right.left = node.left;
    }

    function insert(value: number): FibNode {
      const node = new FibNode(value);
      allNodes.push(node);
      addToRootList(node);
      nodeCount++;

      steps.push({
        type: 'insert',
        array: flattenRootList(),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Insert ${value}: add to root list (lazy O(1) insert). Min = ${min!.key}`,
      });

      return node;
    }

    function link(y: FibNode, x: FibNode): void {
      // Remove y from root list and make it a child of x
      removeFromList(y);
      y.left = y;
      y.right = y;
      y.parent = x;

      if (x.child === null) {
        x.child = y;
      } else {
        y.left = x.child.left;
        y.right = x.child;
        x.child.left.right = y;
        x.child.left = y;
      }

      x.degree++;
      y.marked = false;
    }

    function consolidate(): void {
      const maxDegree = Math.floor(Math.log2(nodeCount)) + 2;
      const degreeTable: (FibNode | null)[] = new Array(maxDegree + 1).fill(null);

      // Collect all root nodes
      const roots: FibNode[] = [];
      if (min !== null) {
        let current = min;
        do {
          roots.push(current);
          current = current.right;
        } while (current !== min);
      }

      steps.push({
        type: 'traverse',
        array: flattenRootList(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 10,
        description: `Consolidate: ${roots.length} trees in root list`,
      });

      for (const w of roots) {
        let x = w;
        let d = x.degree;

        while (d < degreeTable.length && degreeTable[d] !== null) {
          let y = degreeTable[d]!;
          if (x.key > y.key) {
            const temp = x;
            x = y;
            y = temp;
          }

          steps.push({
            type: 'compare',
            array: flattenRootList(),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 12,
            description: `Link: degree-${d} trees (${x.key} and ${y.key}). Attach ${y.key} under ${x.key}`,
          });

          link(y, x);
          degreeTable[d] = null;
          d++;
        }

        if (d < degreeTable.length) {
          degreeTable[d] = x;
        }
      }

      // Rebuild root list from degree table
      min = null;
      for (const node of degreeTable) {
        if (node !== null) {
          node.left = node;
          node.right = node;
          addToRootList(node);
        }
      }

      const minKey = min ? (min as FibNode).key : null;
      steps.push({
        type: 'highlight',
        array: flattenRootList(),
        highlightedIndices: minKey !== null ? [0] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 13,
        description: `Consolidation complete. Min = ${minKey !== null ? minKey : 'none'}`,
      });
    }

    function extractMin(): number | undefined {
      if (min === null) return undefined;

      const z = min;
      const minVal = z.key;

      steps.push({
        type: 'select',
        array: flattenRootList(),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 5,
        description: `ExtractMin: minimum is ${minVal}`,
      });

      // Add children to root list
      if (z.child !== null) {
        const children: FibNode[] = [];
        let child = z.child;
        do {
          children.push(child);
          child = child.right;
        } while (child !== z.child);

        for (const c of children) {
          removeFromList(c);
          c.left = c;
          c.right = c;
          addToRootList(c);
          c.parent = null;
        }

        steps.push({
          type: 'highlight',
          array: flattenRootList(),
          highlightedIndices: [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 6,
          description: `Promote ${children.length} children of ${minVal} to root list`,
        });
      }

      // Remove z from root list
      if (z.right === z) {
        min = null;
      } else {
        min = z.right;
        removeFromList(z);
      }

      nodeCount--;

      steps.push({
        type: 'remove',
        array: flattenRootList(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Removed ${minVal} from root list`,
      });

      if (min !== null) {
        consolidate();
      }

      return minVal;
    }

    function decreaseKey(node: FibNode, newKey: number): void {
      if (newKey > node.key) return;

      const oldKey = node.key;
      node.key = newKey;

      steps.push({
        type: 'swap',
        array: flattenRootList(),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 15,
        description: `DecreaseKey: ${oldKey} \u2192 ${newKey}`,
      });

      const parent = node.parent;
      if (parent !== null && node.key < parent.key) {
        cut(node, parent);
        cascadingCut(parent);
      }

      if (min !== null && node.key < min.key) {
        min = node;
      }

      steps.push({
        type: 'highlight',
        array: flattenRootList(),
        highlightedIndices: min ? [0] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 16,
        description: `After decreaseKey: min = ${min ? (min as FibNode).key : 'none'}`,
      });
    }

    function cut(x: FibNode, y: FibNode): void {
      // Remove x from child list of y
      if (x.right === x) {
        y.child = null;
      } else {
        if (y.child === x) {
          y.child = x.right;
        }
        removeFromList(x);
      }
      y.degree--;

      x.left = x;
      x.right = x;
      addToRootList(x);
      x.marked = false;
    }

    function cascadingCut(y: FibNode): void {
      const z = y.parent;
      if (z !== null) {
        if (!y.marked) {
          y.marked = true;
        } else {
          cut(y, z);
          cascadingCut(z);
        }
      }
    }

    // Phase 1: Insert all elements
    const insertedNodes: FibNode[] = [];
    for (const value of input) {
      const node = insert(value);
      insertedNodes.push(node);
    }

    steps.push({
      type: 'pass-complete',
      array: flattenRootList(),
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `All ${input.length} elements inserted (lazy). Root list: [${flattenRootList().join(', ')}]`,
    });

    // Phase 2: Extract min (triggers consolidation)
    const extractCount = Math.min(2, insertedNodes.length);
    const extracted: number[] = [];

    for (let i = 0; i < extractCount; i++) {
      const val = extractMin();
      if (val !== undefined) {
        extracted.push(val);
      }
    }

    steps.push({
      type: 'pass-complete',
      array: flattenRootList(),
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 8,
      description: `Extracted mins: [${extracted.join(', ')}]. Heap after consolidation: [${flattenRootList().join(', ')}]`,
    });

    // Phase 3: Demonstrate decreaseKey if nodes remain
    if (insertedNodes.length > 3 && min !== null) {
      // Find a non-root node to decrease
      const target = allNodes.find(n => n.parent !== null && n.key > 1);
      if (target) {
        const newKey = Math.max(0, target.key - Math.floor(target.key / 2) - 1);
        decreaseKey(target, newKey);
      }
    }

    // Final state
    const finalArr = flattenRootList();
    steps.push({
      type: 'sorted',
      array: finalArr,
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: finalArr.map((_, i) => i),
      pseudocodeLine: 13,
      description: `Fibonacci heap final state: [${finalArr.join(', ')}]. Min = ${min ? (min as FibNode).key : 'empty'}`,
    });

    return steps;
  },
};
