import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

interface BSTNode {
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

function toLevelOrder(root: BSTNode | null, maxDepth: number): number[] {
  const result: number[] = [];
  const queue: (BSTNode | null)[] = [root];
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

function getDepth(root: BSTNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getDepth(root.left), getDepth(root.right));
}

function getNodeIndex(root: BSTNode, target: number): number {
  // BFS to find the level-order index of a node with the given value
  const queue: { node: BSTNode | null; index: number }[] = [{ node: root, index: 0 }];
  while (queue.length > 0) {
    const { node, index } = queue.shift()!;
    if (!node) continue;
    if (node.value === target) return index;
    queue.push({ node: node.left, index: 2 * index + 1 });
    queue.push({ node: node.right, index: 2 * index + 2 });
  }
  return -1;
}

export const bst: AlgorithmImplementation = {
  id: 'bst',
  name: 'Binary Search Tree',
  category: 'data-structures',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(root, value)' },
    { line: 1, text: '  if root is null then' },
    { line: 2, text: '    return new Node(value)' },
    { line: 3, text: '  if value < root.value then' },
    { line: 4, text: '    root.left ← insert(root.left, value)' },
    { line: 5, text: '  else if value > root.value then' },
    { line: 6, text: '    root.right ← insert(root.right, value)' },
    { line: 7, text: '  return root' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let root: BSTNode | null = null;

    for (let i = 0; i < input.length; i++) {
      const value = input[i];
      const traversalPath: number[] = [];

      if (root === null) {
        // Insert root node
        root = { value, left: null, right: null };
        const depth = getDepth(root);
        const levelOrder = toLevelOrder(root, depth);

        steps.push({
          type: 'insert',
          array: [...levelOrder],
          highlightedIndices: [0],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 2,
          description: `Insert ${value} as root node`,
        });
      } else {
        // Traverse to find insertion point
        let current: BSTNode | null = root;
        let parent: BSTNode = root;
        let isLeft = false;

        while (current !== null) {
          const currentIndex = getNodeIndex(root, current.value);
          traversalPath.push(currentIndex);

          // Show traversal step
          const depth = getDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          steps.push({
            type: 'traverse',
            array: [...levelOrder],
            highlightedIndices: [currentIndex],
            secondaryIndices: [...traversalPath.slice(0, -1)],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: `Visiting node ${current.value} while inserting ${value}`,
          });

          if (value < current.value) {
            // Compare - going left
            steps.push({
              type: 'compare',
              array: [...levelOrder],
              highlightedIndices: [currentIndex],
              secondaryIndices: [...traversalPath.slice(0, -1)],
              sortedIndices: [],
              pseudocodeLine: 3,
              description: `${value} < ${current.value}, go left`,
            });
            parent = current;
            current = current.left;
            isLeft = true;
          } else if (value > current.value) {
            // Compare - going right
            steps.push({
              type: 'compare',
              array: [...levelOrder],
              highlightedIndices: [currentIndex],
              secondaryIndices: [...traversalPath.slice(0, -1)],
              sortedIndices: [],
              pseudocodeLine: 5,
              description: `${value} > ${current.value}, go right`,
            });
            parent = current;
            current = current.right;
            isLeft = false;
          } else {
            // Duplicate value, skip
            break;
          }
        }

        // Insert the new node
        if (current === null) {
          const newNode: BSTNode = { value, left: null, right: null };
          if (isLeft) {
            parent.left = newNode;
          } else {
            parent.right = newNode;
          }

          const depth = getDepth(root);
          const levelOrder = toLevelOrder(root, depth);
          const newIndex = getNodeIndex(root, value);

          steps.push({
            type: 'insert',
            array: [...levelOrder],
            highlightedIndices: [newIndex],
            secondaryIndices: [...traversalPath],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: `Insert ${value} as ${isLeft ? 'left' : 'right'} child of ${parent.value}`,
          });
        }
      }
    }

    return steps;
  },
};
