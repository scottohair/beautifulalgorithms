import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const huffmanCoding: AlgorithmImplementation = {
  id: 'huffman-coding',
  name: 'Huffman Coding',
  category: 'data-structures',
  timeComplexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure buildHuffmanTree(frequencies)' },
    { line: 1, text: '  create leaf node for each symbol' },
    { line: 2, text: '  insert all nodes into priority queue' },
    { line: 3, text: '  while queue.size > 1' },
    { line: 4, text: '    left \u2190 extractMin(queue)' },
    { line: 5, text: '    right \u2190 extractMin(queue)' },
    { line: 6, text: '    internal \u2190 new node(freq = left.freq + right.freq)' },
    { line: 7, text: '    internal.left \u2190 left, internal.right \u2190 right' },
    { line: 8, text: '    insert internal into queue' },
    { line: 9, text: '  return queue root (the Huffman tree)' },
    { line: 10, text: 'procedure generateCodes(node, prefix)' },
    { line: 11, text: '  if node is leaf: code[node.symbol] \u2190 prefix' },
    { line: 12, text: '  else: recurse left with prefix+"0", right with prefix+"1"' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    class HuffNode {
      freq: number;
      symbol: number | null; // null for internal nodes
      left: HuffNode | null;
      right: HuffNode | null;

      constructor(freq: number, symbol: number | null) {
        this.freq = freq;
        this.symbol = symbol;
        this.left = null;
        this.right = null;
      }
    }

    // Use input values as frequencies for different symbols (indices)
    // Build a simple priority queue using sorted array
    class PriorityQueue {
      private items: HuffNode[] = [];

      insert(node: HuffNode): void {
        this.items.push(node);
        this.items.sort((a, b) => a.freq - b.freq);
      }

      extractMin(): HuffNode | undefined {
        return this.items.shift();
      }

      size(): number {
        return this.items.length;
      }

      frequencies(): number[] {
        return this.items.map(n => n.freq);
      }
    }

    function flattenTree(node: HuffNode | null): number[] {
      if (node === null) return [];
      const result: number[] = [];
      // Level-order traversal
      const queue: HuffNode[] = [node];
      while (queue.length > 0) {
        const current = queue.shift()!;
        result.push(current.freq);
        if (current.left !== null) queue.push(current.left);
        if (current.right !== null) queue.push(current.right);
      }
      return result;
    }

    function generateCodes(
      node: HuffNode | null,
      prefix: string,
      codes: Map<number, string>
    ): void {
      if (node === null) return;

      if (node.symbol !== null) {
        // Leaf node
        codes.set(node.symbol, prefix || '0'); // Single node gets code '0'

        steps.push({
          type: 'traverse',
          array: flattenTree(root),
          highlightedIndices: [],
          secondaryIndices: [],
          sortedIndices: [],
          pseudocodeLine: 11,
          description: `Symbol ${node.symbol} (freq=${node.freq}): code = "${codes.get(node.symbol)}"`,
        });

        return;
      }

      steps.push({
        type: 'highlight',
        array: flattenTree(root),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 12,
        description: `Internal node (freq=${node.freq}): go left with "${prefix}0", right with "${prefix}1"`,
      });

      generateCodes(node.left, prefix + '0', codes);
      generateCodes(node.right, prefix + '1', codes);
    }

    // Use input values as frequencies
    const frequencies = input.map(v => Math.max(1, Math.abs(v))); // Ensure positive frequencies

    const pq = new PriorityQueue();

    // Phase 1: Create leaf nodes
    for (let i = 0; i < frequencies.length; i++) {
      const node = new HuffNode(frequencies[i], i);
      pq.insert(node);

      steps.push({
        type: 'insert',
        array: pq.frequencies(),
        highlightedIndices: [pq.frequencies().indexOf(frequencies[i])],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Create leaf: symbol ${i} with frequency ${frequencies[i]}`,
      });
    }

    steps.push({
      type: 'pass-complete',
      array: pq.frequencies(),
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 2,
      description: `Priority queue initialized with ${frequencies.length} leaf nodes: [${pq.frequencies().join(', ')}]`,
    });

    // Phase 2: Build the Huffman tree
    let root: HuffNode | null = null;
    let iteration = 0;

    while (pq.size() > 1) {
      iteration++;
      const left = pq.extractMin()!;
      const right = pq.extractMin()!;

      steps.push({
        type: 'select',
        array: [...pq.frequencies()],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 4,
        description: `Step ${iteration}: extract two smallest: ${left.freq} and ${right.freq}`,
      });

      const combined = new HuffNode(left.freq + right.freq, null);
      combined.left = left;
      combined.right = right;

      steps.push({
        type: 'highlight',
        array: [combined.freq, ...pq.frequencies()],
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Create internal node: freq = ${left.freq} + ${right.freq} = ${combined.freq}`,
      });

      pq.insert(combined);

      steps.push({
        type: 'insert',
        array: pq.frequencies(),
        highlightedIndices: [pq.frequencies().indexOf(combined.freq)],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 8,
        description: `Insert combined node (freq=${combined.freq}) back into queue. Queue: [${pq.frequencies().join(', ')}]`,
      });
    }

    // The root of the Huffman tree
    root = pq.extractMin() || null;

    if (root !== null) {
      steps.push({
        type: 'pass-complete',
        array: flattenTree(root),
        highlightedIndices: [0],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `Huffman tree built. Root frequency: ${root.freq}. Tree (level-order): [${flattenTree(root).join(', ')}]`,
      });

      // Phase 3: Generate codes
      steps.push({
        type: 'highlight',
        array: flattenTree(root),
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 10,
        description: `Generate Huffman codes by traversing the tree`,
      });

      const codes = new Map<number, string>();
      generateCodes(root, '', codes);

      // Build summary
      const codeSummary: string[] = [];
      codes.forEach((code, symbol) => {
        codeSummary.push(`${symbol}:${code}`);
      });

      const finalArr = flattenTree(root);
      steps.push({
        type: 'sorted',
        array: finalArr,
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: finalArr.map((_, i) => i),
        pseudocodeLine: 12,
        description: `Huffman codes: {${codeSummary.join(', ')}}. Tree: [${finalArr.join(', ')}]`,
      });
    } else {
      steps.push({
        type: 'sorted',
        array: [],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 9,
        description: `No elements to build Huffman tree`,
      });
    }

    return steps;
  },
};
