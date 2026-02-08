import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

class SplayNode {
  value: number;
  left: SplayNode | null;
  right: SplayNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function getTreeDepth(root: SplayNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeDepth(root.left), getTreeDepth(root.right));
}

function toLevelOrder(root: SplayNode | null, maxDepth: number): number[] {
  const result: number[] = [];
  const queue: (SplayNode | null)[] = [root];
  let level = 0;

  while (level < maxDepth) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      if (node) {
        result.push(node.value);
        queue.push(node.left);
        queue.push(node.right);
      } else {
        result.push(0);
        queue.push(null);
        queue.push(null);
      }
    }
    level++;
  }

  return result;
}

function getNodeIndex(root: SplayNode, target: number): number {
  const queue: { node: SplayNode | null; index: number }[] = [{ node: root, index: 0 }];
  while (queue.length > 0) {
    const { node, index } = queue.shift()!;
    if (!node) continue;
    if (node.value === target) return index;
    queue.push({ node: node.left, index: 2 * index + 1 });
    queue.push({ node: node.right, index: 2 * index + 2 });
  }
  return -1;
}

export const splayTree: AlgorithmImplementation = {
  id: 'splay-tree',
  name: 'Splay Tree',
  category: 'data-structures',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure splay(node, value)' },
    { line: 1, text: '  if node is null or node.value = value' },
    { line: 2, text: '    return node' },
    { line: 3, text: '  if value < node.value (left subtree)' },
    { line: 4, text: '    zig-zig: rotate right twice' },
    { line: 5, text: '    zig-zag: rotate left child, then right' },
    { line: 6, text: '    zig: rotate right once' },
    { line: 7, text: '  else (right subtree)' },
    { line: 8, text: '    zig-zig: rotate left twice' },
    { line: 9, text: '    zig-zag: rotate right child, then left' },
    { line: 10, text: '    zig: rotate left once' },
    { line: 11, text: 'procedure insert(root, value)' },
    { line: 12, text: '  BST insert, then splay the new node to root' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    function rightRotate(x: SplayNode): SplayNode {
      const y = x.left!;
      x.left = y.right;
      y.right = x;
      return y;
    }

    function leftRotate(x: SplayNode): SplayNode {
      const y = x.right!;
      x.right = y.left;
      y.left = x;
      return y;
    }

    function splay(root: SplayNode | null, value: number): SplayNode | null {
      if (!root || root.value === value) return root;

      if (value < root.value) {
        // Value is in left subtree
        if (!root.left) return root;

        if (value < root.left.value) {
          // Zig-Zig (Left Left)
          root.left.left = splay(root.left.left, value);
          root = rightRotate(root);

          steps.push({
            type: 'swap',
            array: root ? toLevelOrder(root, getTreeDepth(root)) : [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: `Zig-Zig: double right rotation for ${value}`,
          });
        } else if (value > root.left.value) {
          // Zig-Zag (Left Right)
          root.left.right = splay(root.left.right, value);
          if (root.left.right) {
            root.left = leftRotate(root.left);
          }

          steps.push({
            type: 'swap',
            array: root ? toLevelOrder(root, getTreeDepth(root)) : [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 5,
            description: `Zig-Zag: left rotate child, then right rotate for ${value}`,
          });
        }

        if (!root.left) return root;
        return rightRotate(root);
      } else {
        // Value is in right subtree
        if (!root.right) return root;

        if (value > root.right.value) {
          // Zig-Zig (Right Right)
          root.right.right = splay(root.right.right, value);
          root = leftRotate(root);

          steps.push({
            type: 'swap',
            array: root ? toLevelOrder(root, getTreeDepth(root)) : [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 8,
            description: `Zig-Zig: double left rotation for ${value}`,
          });
        } else if (value < root.right.value) {
          // Zig-Zag (Right Left)
          root.right.left = splay(root.right.left, value);
          if (root.right.left) {
            root.right = rightRotate(root.right);
          }

          steps.push({
            type: 'swap',
            array: root ? toLevelOrder(root, getTreeDepth(root)) : [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: `Zig-Zag: right rotate child, then left rotate for ${value}`,
          });
        }

        if (!root.right) return root;
        return leftRotate(root);
      }
    }

    function insert(root: SplayNode | null, value: number): SplayNode {
      if (!root) return new SplayNode(value);

      // Splay the closest value to root
      root = splay(root, value)!;

      if (root.value === value) return root; // duplicate

      const newNode = new SplayNode(value);

      if (value < root.value) {
        newNode.right = root;
        newNode.left = root.left;
        root.left = null;
      } else {
        newNode.left = root;
        newNode.right = root.right;
        root.right = null;
      }

      return newNode;
    }

    let root: SplayNode | null = null;

    for (let i = 0; i < input.length; i++) {
      const value = input[i];

      if (root) {
        const depth = getTreeDepth(root);
        const levelOrder = toLevelOrder(root, depth);
        steps.push({
          type: 'compare',
          array: [...levelOrder],
          highlightedIndices: [0],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 11,
          description: `Insert ${value}: splay tree to find position`,
        });
      }

      root = insert(root, value);

      if (root) {
        const depth = getTreeDepth(root);
        const levelOrder = toLevelOrder(root, depth);
        const newIdx = getNodeIndex(root, value);

        steps.push({
          type: 'insert',
          array: [...levelOrder],
          highlightedIndices: newIdx >= 0 ? [newIdx] : [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 12,
          description: `Inserted ${value}. It is now the root of the splay tree.`,
        });
      }
    }

    // Demonstrate search by splaying each value
    if (root && input.length > 0) {
      const searchVal = input[0];
      const depth = getTreeDepth(root);
      const levelOrder = toLevelOrder(root, depth);

      steps.push({
        type: 'highlight',
        array: [...levelOrder],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 0,
        description: `Search for ${searchVal}: splay it to root`,
      });

      root = splay(root, searchVal);

      if (root) {
        const d2 = getTreeDepth(root);
        const lo2 = toLevelOrder(root, d2);
        const idx = getNodeIndex(root, searchVal);
        steps.push({
          type: 'select',
          array: [...lo2],
          highlightedIndices: idx >= 0 ? [idx] : [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 2,
          description: `Found ${searchVal}. It is now at the root.`,
        });
      }
    }

    return steps;
  },
};
