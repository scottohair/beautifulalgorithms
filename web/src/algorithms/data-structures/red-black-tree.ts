import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

enum Color {
  RED = 0,
  BLACK = 1,
}

class RBNode {
  value: number;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
  color: Color;

  constructor(value: number, color: Color = Color.RED) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.color = color;
  }
}

function getTreeDepth(root: RBNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(getTreeDepth(root.left), getTreeDepth(root.right));
}

function toLevelOrder(root: RBNode | null, maxDepth: number): number[] {
  const result: number[] = [];
  const queue: (RBNode | null)[] = [root];
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

function getNodeIndex(root: RBNode, target: number): number {
  const queue: { node: RBNode | null; index: number }[] = [{ node: root, index: 0 }];
  while (queue.length > 0) {
    const { node, index } = queue.shift()!;
    if (!node) continue;
    if (node.value === target) return index;
    queue.push({ node: node.left, index: 2 * index + 1 });
    queue.push({ node: node.right, index: 2 * index + 2 });
  }
  return -1;
}

export const redBlackTree: AlgorithmImplementation = {
  id: 'red-black-tree',
  name: 'Red-Black Tree',
  category: 'data-structures',
  timeComplexity: { best: 'O(log n)', average: 'O(log n)', worst: 'O(log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure insert(tree, value)' },
    { line: 1, text: '  perform BST insert (new node is RED)' },
    { line: 2, text: '  fix-up(tree, node)' },
    { line: 3, text: 'procedure fix-up(tree, z)' },
    { line: 4, text: '  while z.parent is RED do' },
    { line: 5, text: '    if z.parent is left child' },
    { line: 6, text: '      uncle \u2190 z.parent.parent.right' },
    { line: 7, text: '      if uncle is RED then recolor' },
    { line: 8, text: '      else if z is right child, left rotate' },
    { line: 9, text: '      recolor and right rotate grandparent' },
    { line: 10, text: '    else mirror case (parent is right child)' },
    { line: 11, text: '  tree.root.color \u2190 BLACK' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    let root: RBNode | null = null;

    function leftRotate(x: RBNode): void {
      const y = x.right!;
      x.right = y.left;
      if (y.left) y.left.parent = x;
      y.parent = x.parent;
      if (!x.parent) {
        root = y;
      } else if (x === x.parent.left) {
        x.parent.left = y;
      } else {
        x.parent.right = y;
      }
      y.left = x;
      x.parent = y;
    }

    function rightRotate(y: RBNode): void {
      const x = y.left!;
      y.left = x.right;
      if (x.right) x.right.parent = y;
      x.parent = y.parent;
      if (!y.parent) {
        root = x;
      } else if (y === y.parent.left) {
        y.parent.left = x;
      } else {
        y.parent.right = x;
      }
      x.right = y;
      y.parent = x;
    }

    function fixInsert(z: RBNode): void {
      while (z.parent && z.parent.color === Color.RED) {
        if (z.parent === z.parent.parent?.left) {
          const uncle = z.parent.parent.right;

          if (root) {
            const depth = getTreeDepth(root);
            const levelOrder = toLevelOrder(root, depth);
            const zIdx = getNodeIndex(root, z.value);
            steps.push({
              type: 'compare',
              array: [...levelOrder],
              highlightedIndices: zIdx >= 0 ? [zIdx] : [],
              secondaryIndices: [],
              sortedIndices: [],
              pseudocodeLine: 5,
              description: `Parent ${z.parent.value} is left child. Check uncle.`,
            });
          }

          if (uncle && uncle.color === Color.RED) {
            // Case 1: uncle is red - recolor
            z.parent.color = Color.BLACK;
            uncle.color = Color.BLACK;
            z.parent.parent!.color = Color.RED;
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
                description: `Uncle is RED. Recolor parent, uncle to BLACK, grandparent to RED.`,
              });
            }
            z = z.parent.parent!;
          } else {
            if (z === z.parent.right) {
              // Case 2: z is right child - left rotate
              z = z.parent;
              leftRotate(z);
              if (root) {
                const depth = getTreeDepth(root);
                const levelOrder = toLevelOrder(root, depth);
                steps.push({
                  type: 'swap',
                  array: [...levelOrder],
                  highlightedIndices: [],
                  secondaryIndices: [],
                  sortedIndices: [],
                  pseudocodeLine: 8,
                  description: `Left rotate at node ${z.value}`,
                });
              }
            }
            // Case 3: z is left child - recolor and right rotate
            z.parent!.color = Color.BLACK;
            z.parent!.parent!.color = Color.RED;
            rightRotate(z.parent!.parent!);
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
                description: `Recolor and right rotate grandparent`,
              });
            }
          }
        } else {
          // Mirror: parent is right child
          const uncle = z.parent.parent?.left ?? null;

          if (root) {
            const depth = getTreeDepth(root);
            const levelOrder = toLevelOrder(root, depth);
            const zIdx = getNodeIndex(root, z.value);
            steps.push({
              type: 'compare',
              array: [...levelOrder],
              highlightedIndices: zIdx >= 0 ? [zIdx] : [],
              secondaryIndices: [],
              sortedIndices: [],
              pseudocodeLine: 10,
              description: `Parent ${z.parent.value} is right child. Check uncle.`,
            });
          }

          if (uncle && uncle.color === Color.RED) {
            z.parent.color = Color.BLACK;
            uncle.color = Color.BLACK;
            z.parent.parent!.color = Color.RED;
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
                description: `Uncle is RED. Recolor parent, uncle to BLACK, grandparent to RED.`,
              });
            }
            z = z.parent.parent!;
          } else {
            if (z === z.parent.left) {
              z = z.parent;
              rightRotate(z);
              if (root) {
                const depth = getTreeDepth(root);
                const levelOrder = toLevelOrder(root, depth);
                steps.push({
                  type: 'swap',
                  array: [...levelOrder],
                  highlightedIndices: [],
                  secondaryIndices: [],
                  sortedIndices: [],
                  pseudocodeLine: 8,
                  description: `Right rotate at node ${z.value}`,
                });
              }
            }
            z.parent!.color = Color.BLACK;
            z.parent!.parent!.color = Color.RED;
            leftRotate(z.parent!.parent!);
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
                description: `Recolor and left rotate grandparent`,
              });
            }
          }
        }
      }
      root!.color = Color.BLACK;
    }

    function bstInsert(value: number): RBNode {
      const newNode = new RBNode(value, Color.RED);

      if (!root) {
        root = newNode;
        root.color = Color.BLACK;
        return newNode;
      }

      let current: RBNode | null = root;
      let parent: RBNode | null = null;

      while (current) {
        parent = current;
        const depth = getTreeDepth(root);
        const levelOrder = toLevelOrder(root, depth);
        const curIdx = getNodeIndex(root, current.value);

        steps.push({
          type: 'compare',
          array: [...levelOrder],
          highlightedIndices: curIdx >= 0 ? [curIdx] : [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 1,
          description: `Compare ${value} with ${current.value}`,
        });

        if (value < current.value) {
          current = current.left;
        } else if (value > current.value) {
          current = current.right;
        } else {
          return current; // duplicate
        }
      }

      newNode.parent = parent;
      if (value < parent!.value) {
        parent!.left = newNode;
      } else {
        parent!.right = newNode;
      }

      return newNode;
    }

    for (let i = 0; i < input.length; i++) {
      const value = input[i];
      const node = bstInsert(value);

      if (node.value === value && (node.left || node.right || node === root)) {
        fixInsert(node);
      }

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
          pseudocodeLine: 11,
          description: `Inserted ${value} into Red-Black tree. Root is BLACK.`,
        });
      }
    }

    return steps;
  },
};
