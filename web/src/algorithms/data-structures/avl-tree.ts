import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

class AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

function getHeight(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function getBalance(node: AVLNode): number {
  return getHeight(node.left) - getHeight(node.right);
}

function updateHeight(node: AVLNode): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getTreeDepth(root: AVLNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeDepth(root.left), getTreeDepth(root.right));
}

function toLevelOrder(root: AVLNode | null, maxDepth: number): number[] {
  const result: number[] = [];
  const queue: (AVLNode | null)[] = [root];
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

function getNodeIndex(root: AVLNode, target: number): number {
  const queue: { node: AVLNode | null; index: number }[] = [{ node: root, index: 0 }];
  while (queue.length > 0) {
    const { node, index } = queue.shift()!;
    if (!node) continue;
    if (node.value === target) return index;
    queue.push({ node: node.left, index: 2 * index + 1 });
    queue.push({ node: node.right, index: 2 * index + 2 });
  }
  return -1;
}

export const avlTree: AlgorithmImplementation = {
  id: 'avl-tree',
  name: 'AVL Tree',
  category: 'data-structures',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(node, value)' },
    { line: 1, text: '  perform BST insert' },
    { line: 2, text: '  update height of node' },
    { line: 3, text: '  balance \u2190 getBalance(node)' },
    { line: 4, text: '  if balance > 1 and value < node.left.value' },
    { line: 5, text: '    return rightRotate(node)' },
    { line: 6, text: '  if balance < -1 and value > node.right.value' },
    { line: 7, text: '    return leftRotate(node)' },
    { line: 8, text: '  if balance > 1 and value > node.left.value' },
    { line: 9, text: '    node.left \u2190 leftRotate(node.left)' },
    { line: 10, text: '    return rightRotate(node)' },
    { line: 11, text: '  if balance < -1 and value < node.right.value' },
    { line: 12, text: '    node.right \u2190 rightRotate(node.right)' },
    { line: 13, text: '    return leftRotate(node)' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let root: AVLNode | null = null;

    function rightRotate(y: AVLNode): AVLNode {
      const x = y.left!;
      const T2 = x.right;

      x.right = y;
      y.left = T2;

      updateHeight(y);
      updateHeight(x);

      return x;
    }

    function leftRotate(x: AVLNode): AVLNode {
      const y = x.right!;
      const T2 = y.left;

      y.left = x;
      x.right = T2;

      updateHeight(x);
      updateHeight(y);

      return y;
    }

    function insertNode(node: AVLNode | null, value: number): AVLNode {
      // Standard BST insert
      if (!node) {
        return new AVLNode(value);
      }

      if (root) {
        const depth = getTreeDepth(root);
        const levelOrder = toLevelOrder(root, depth);
        const nodeIdx = getNodeIndex(root, node.value);

        steps.push({
          type: 'compare',
          array: [...levelOrder],
          highlightedIndices: [nodeIdx],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 1,
          description: `Compare ${value} with ${node.value}`,
        });
      }

      if (value < node.value) {
        node.left = insertNode(node.left, value);
      } else if (value > node.value) {
        node.right = insertNode(node.right, value);
      } else {
        return node; // Duplicate values not allowed
      }

      updateHeight(node);

      const balance = getBalance(node);

      // Show balance check
      if (root) {
        const depth = getTreeDepth(root);
        const levelOrder = toLevelOrder(root, depth);
        const nodeIdx = getNodeIndex(root, node.value);

        if (Math.abs(balance) > 1) {
          steps.push({
            type: 'highlight',
            array: [...levelOrder],
            highlightedIndices: nodeIdx >= 0 ? [nodeIdx] : [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 3,
            description: `Node ${node.value} is unbalanced (balance = ${balance})`,
          });
        }
      }

      // Left Left Case
      if (balance > 1 && value < node.left!.value) {
        const rotated = rightRotate(node);
        if (root) {
          // Update root reference if needed
          const depth = getTreeDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          steps.push({
            type: 'swap',
            array: [...levelOrder],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 5,
            description: `Right rotate at node ${node.value}`,
          });
        }
        return rotated;
      }

      // Right Right Case
      if (balance < -1 && value > node.right!.value) {
        const rotated = leftRotate(node);
        if (root) {
          const depth = getTreeDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          steps.push({
            type: 'swap',
            array: [...levelOrder],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 7,
            description: `Left rotate at node ${node.value}`,
          });
        }
        return rotated;
      }

      // Left Right Case
      if (balance > 1 && value > node.left!.value) {
        node.left = leftRotate(node.left!);
        if (root) {
          const depth = getTreeDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          steps.push({
            type: 'swap',
            array: [...levelOrder],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: `Left rotate at node ${node.left!.value}, then right rotate`,
          });
        }
        return rightRotate(node);
      }

      // Right Left Case
      if (balance < -1 && value < node.right!.value) {
        node.right = rightRotate(node.right!);
        if (root) {
          const depth = getTreeDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          steps.push({
            type: 'swap',
            array: [...levelOrder],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 12,
            description: `Right rotate at node ${node.right!.value}, then left rotate`,
          });
        }
        return leftRotate(node);
      }

      return node;
    }

    for (let i = 0; i < input.length; i++) {
      const value = input[i];

      root = insertNode(root, value);

      // Show final state after insertion
      const depth = getTreeDepth(root);
      const levelOrder = toLevelOrder(root, depth);
      const newIdx = getNodeIndex(root, value);

      steps.push({
        type: 'insert',
        array: [...levelOrder],
        highlightedIndices: newIdx >= 0 ? [newIdx] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `Inserted ${value} into AVL tree`,
      });
    }

    return steps;
  },
};
