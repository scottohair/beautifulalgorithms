import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

class TrieNode {
  children: Map<number, TrieNode>;
  isEnd: boolean;
  value: number;

  constructor(value: number) {
    this.children = new Map();
    this.isEnd = false;
    this.value = value;
  }
}

function toBfsArray(root: TrieNode): number[] {
  const result: number[] = [];
  const queue: TrieNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node.value);
    // Sort children keys for consistent ordering
    const sortedKeys = [...node.children.keys()].sort((a, b) => a - b);
    for (const key of sortedKeys) {
      queue.push(node.children.get(key)!);
    }
  }

  return result;
}

function getNodeBfsIndex(root: TrieNode, target: TrieNode): number {
  const queue: { node: TrieNode; index: number }[] = [{ node: root, index: 0 }];
  let idx = 0;

  while (queue.length > 0) {
    const { node, index } = queue.shift()!;
    if (node === target) return index;
    const sortedKeys = [...node.children.keys()].sort((a, b) => a - b);
    for (const key of sortedKeys) {
      idx++;
      queue.push({ node: node.children.get(key)!, index: idx });
    }
  }

  return -1;
}

export const trie: AlgorithmImplementation = {
  id: 'trie',
  name: 'Trie (Prefix Tree)',
  category: 'data-structures',
  timeComplexity: { best: 'O(m)', average: 'O(m)', worst: 'O(m)' },
  spaceComplexity: 'O(n * m)',
  pseudocode: [
    { line: 0, text: 'procedure insert(root, word)' },
    { line: 1, text: '  node \u2190 root' },
    { line: 2, text: '  for each character c in word' },
    { line: 3, text: '    if c not in node.children' },
    { line: 4, text: '      node.children[c] \u2190 new TrieNode' },
    { line: 5, text: '    node \u2190 node.children[c]' },
    { line: 6, text: '  node.isEnd \u2190 true' },
    { line: 7, text: 'procedure search(root, word)' },
    { line: 8, text: '  node \u2190 root' },
    { line: 9, text: '  for each character c in word' },
    { line: 10, text: '    if c not in node.children' },
    { line: 11, text: '      return false' },
    { line: 12, text: '  return node.isEnd' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const root = new TrieNode(-1); // sentinel root

    // Treat input values as "words" to insert - each number is a sequence of digits
    // We'll use the raw values and insert them digit-by-digit into the trie
    // For visualization, we treat each number as a path of individual digits

    function insertWord(word: number[]): void {
      let node = root;

      steps.push({
        type: 'highlight',
        array: toBfsArray(root),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 1,
        description: `Start insertion at root. Word: [${word.join(', ')}]`,
      });

      for (let i = 0; i < word.length; i++) {
        const c = word[i];

        const bfsArr = toBfsArray(root);
        const nodeIdx = getNodeBfsIndex(root, node);

        if (!node.children.has(c)) {
          const newChild = new TrieNode(c);
          node.children.set(c, newChild);

          const newBfsArr = toBfsArray(root);
          const childIdx = getNodeBfsIndex(root, newChild);

          steps.push({
            type: 'insert',
            array: [...newBfsArr],
            highlightedIndices: childIdx >= 0 ? [childIdx] : [],
            secondaryIndices: nodeIdx >= 0 ? [nodeIdx] : [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: `Create new node for ${c}`,
          });
        } else {
          steps.push({
            type: 'traverse',
            array: [...bfsArr],
            highlightedIndices: nodeIdx >= 0 ? [nodeIdx] : [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 5,
            description: `Node for ${c} already exists, traverse to it`,
          });
        }

        node = node.children.get(c)!;
      }

      node.isEnd = true;
      const finalArr = toBfsArray(root);
      const endIdx = getNodeBfsIndex(root, node);

      steps.push({
        type: 'select',
        array: [...finalArr],
        highlightedIndices: endIdx >= 0 ? [endIdx] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Mark node ${node.value} as end of word [${word.join(', ')}]`,
      });
    }

    function searchWord(word: number[]): void {
      let node: TrieNode | null = root;

      steps.push({
        type: 'highlight',
        array: toBfsArray(root),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 8,
        description: `Search for word [${word.join(', ')}] starting at root`,
      });

      for (let i = 0; i < word.length; i++) {
        const c = word[i];
        const bfsArr = toBfsArray(root);
        const nodeIdx = node ? getNodeBfsIndex(root, node) : -1;

        if (!node || !node.children.has(c)) {
          steps.push({
            type: 'compare',
            array: [...bfsArr],
            highlightedIndices: nodeIdx >= 0 ? [nodeIdx] : [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 11,
            description: `${c} not found in children. Word not in trie.`,
          });
          return;
        }

        node = node.children.get(c)!;
        const nextIdx = getNodeBfsIndex(root, node);

        steps.push({
          type: 'traverse',
          array: [...bfsArr],
          highlightedIndices: nextIdx >= 0 ? [nextIdx] : [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 9,
          description: `Found ${c}, move to next node`,
        });
      }

      const bfsArr = toBfsArray(root);
      const endIdx = node ? getNodeBfsIndex(root, node) : -1;

      steps.push({
        type: node && node.isEnd ? 'sorted' : 'compare',
        array: [...bfsArr],
        highlightedIndices: endIdx >= 0 ? [endIdx] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 12,
        description: node && node.isEnd
          ? `Word [${word.join(', ')}] found in trie!`
          : `Reached end but node is not marked as word end`,
      });
    }

    // Insert each number as a sequence of its digits
    for (const val of input) {
      const digits = String(Math.abs(val)).split('').map(Number);
      insertWord(digits);
    }

    // Search for the first and last inserted values
    if (input.length > 0) {
      const searchDigits = String(Math.abs(input[0])).split('').map(Number);
      searchWord(searchDigits);
    }

    return steps;
  },
};
