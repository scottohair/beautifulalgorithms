import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

const ORDER = 3; // 2-3 tree
const MAX_KEYS = ORDER - 1;

class BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;

  constructor(isLeaf: boolean = true) {
    this.keys = [];
    this.children = [];
    this.isLeaf = isLeaf;
  }
}

function toBfsArray(root: BTreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: BTreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    // Push all keys of this node (use 0 as separator between nodes)
    for (const key of node.keys) {
      result.push(key);
    }
    // Add a separator between nodes unless this is the last one
    if (queue.length > 0 || node.children.length > 0) {
      result.push(0);
    }
    for (const child of node.children) {
      queue.push(child);
    }
  }

  return result;
}

function flattenKeys(root: BTreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: BTreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    for (const key of node.keys) {
      result.push(key);
    }
    for (const child of node.children) {
      queue.push(child);
    }
  }

  return result;
}

function findKeyIndex(root: BTreeNode, target: number): number {
  const flat = flattenKeys(root);
  return flat.indexOf(target);
}

export const bTree: AlgorithmImplementation = {
  id: 'b-tree',
  name: 'B-Tree (2-3 Tree)',
  category: 'data-structures',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(tree, key)' },
    { line: 1, text: '  find leaf node for key' },
    { line: 2, text: '  insert key into leaf' },
    { line: 3, text: '  if leaf has overflow (> max keys)' },
    { line: 4, text: '    split node' },
    { line: 5, text: '    median key moves to parent' },
    { line: 6, text: '    left keys \u2190 left child' },
    { line: 7, text: '    right keys \u2190 right child' },
    { line: 8, text: '    if parent overflows, split recursively' },
    { line: 9, text: '    if root splits, create new root' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let root: BTreeNode | null = null;

    function splitChild(parent: BTreeNode, index: number): void {
      const child = parent.children[index];
      const midIndex = Math.floor(child.keys.length / 2);
      const medianKey = child.keys[midIndex];

      const leftNode = new BTreeNode(child.isLeaf);
      leftNode.keys = child.keys.slice(0, midIndex);

      const rightNode = new BTreeNode(child.isLeaf);
      rightNode.keys = child.keys.slice(midIndex + 1);

      if (!child.isLeaf) {
        leftNode.children = child.children.slice(0, midIndex + 1);
        rightNode.children = child.children.slice(midIndex + 1);
      }

      // Insert median into parent
      parent.keys.splice(index, 0, medianKey);
      parent.children.splice(index, 1, leftNode, rightNode);

      if (root) {
        const flat = flattenKeys(root);
        const medIdx = flat.indexOf(medianKey);

        steps.push({
          type: 'swap',
          array: [...flat],
          highlightedIndices: medIdx >= 0 ? [medIdx] : [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 5,
          description: `Split node. Median ${medianKey} promoted to parent.`,
        });
      }
    }

    function insertNonFull(node: BTreeNode, key: number): void {
      if (node.isLeaf) {
        // Find position and insert
        let i = node.keys.length - 1;
        while (i >= 0 && node.keys[i] > key) {
          i--;
        }
        node.keys.splice(i + 1, 0, key);

        if (root) {
          const flat = flattenKeys(root);
          const keyIdx = flat.indexOf(key);

          steps.push({
            type: 'insert',
            array: [...flat],
            highlightedIndices: keyIdx >= 0 ? [keyIdx] : [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: `Insert ${key} into leaf node`,
          });
        }
      } else {
        // Find child to recurse into
        let i = node.keys.length - 1;
        while (i >= 0 && node.keys[i] > key) {
          i--;
        }
        i++;

        if (root) {
          const flat = flattenKeys(root);
          steps.push({
            type: 'compare',
            array: [...flat],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: `Navigate to child ${i} for key ${key}`,
          });
        }

        if (node.children[i].keys.length === MAX_KEYS + 1) {
          // This shouldn't happen in our approach but handle proactively
          splitChild(node, i);
          if (key > node.keys[i]) {
            i++;
          }
        }

        insertNonFull(node.children[i], key);

        // Check if child needs splitting after insertion
        if (node.children[i] && node.children[i].keys.length > MAX_KEYS) {
          splitChild(node, i);
        }
      }
    }

    for (const value of input) {
      if (!root) {
        root = new BTreeNode(true);
        root.keys.push(value);

        steps.push({
          type: 'insert',
          array: [value],
          highlightedIndices: [0],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 2,
          description: `Create root with key ${value}`,
        });
        continue;
      }

      // Search step
      const flat = flattenKeys(root);
      steps.push({
        type: 'traverse',
        array: [...flat],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `Find position to insert ${value}`,
      });

      insertNonFull(root, value);

      // Check if root itself needs splitting
      if (root.keys.length > MAX_KEYS) {
        const newRoot = new BTreeNode(false);
        newRoot.children.push(root);
        splitChild(newRoot, 0);
        root = newRoot;

        const flat2 = flattenKeys(root);
        steps.push({
          type: 'swap',
          array: [...flat2],
          highlightedIndices: [0],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 9,
          description: `Root was split. New root created.`,
        });
      }

      // Show state after insertion
      const finalFlat = flattenKeys(root);
      steps.push({
        type: 'highlight',
        array: [...finalFlat],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 0,
        description: `B-Tree state after inserting ${value}: [${finalFlat.join(', ')}]`,
      });
    }

    // Final sorted state
    if (root) {
      const finalFlat = flattenKeys(root);
      steps.push({
        type: 'sorted',
        array: [...finalFlat],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: finalFlat.map((_, i) => i),
        pseudocodeLine: 0,
        description: `B-Tree complete. All keys in level-order: [${finalFlat.join(', ')}]`,
      });
    }

    return steps;
  },
};
