import { create } from 'zustand';
import type { AlgorithmImplementation } from '@/lib/types/algorithm';
import { bubbleSort } from '@/algorithms/sorting/bubble-sort';
import { insertionSort } from '@/algorithms/sorting/insertion-sort';
import { selectionSort } from '@/algorithms/sorting/selection-sort';
import { stack } from '@/algorithms/data-structures/stack';
import { queue } from '@/algorithms/data-structures/queue';
import { bst } from '@/algorithms/data-structures/bst';
import { mergeSort } from '@/algorithms/sorting/merge-sort';
import { quickSort } from '@/algorithms/sorting/quick-sort';
import { heapSort } from '@/algorithms/sorting/heap-sort';
import { linkedList } from '@/algorithms/data-structures/linked-list';
import { avlTree } from '@/algorithms/data-structures/avl-tree';
import { hashTable } from '@/algorithms/data-structures/hash-table';
import { bfs } from '@/algorithms/graph/bfs';
import { dfs } from '@/algorithms/graph/dfs';
import { redBlackTree } from '@/algorithms/data-structures/red-black-tree';
import { splayTree } from '@/algorithms/data-structures/splay-tree';
import { trie } from '@/algorithms/data-structures/trie';
import { bTree } from '@/algorithms/data-structures/b-tree';
import { minHeap } from '@/algorithms/data-structures/min-heap';
import { dijkstra } from '@/algorithms/graph/dijkstra';
import { prim } from '@/algorithms/graph/prim';
import { kruskal } from '@/algorithms/graph/kruskal';

interface VisualizationState {
  currentAlgorithm: AlgorithmImplementation | null;
  inputArray: number[];
  availableAlgorithms: AlgorithmImplementation[];
  selectAlgorithm: (algorithm: AlgorithmImplementation) => void;
  generateRandomInput: (count?: number) => void;
  setInputArray: (arr: number[]) => void;
}

export const useVisualizationStore = create<VisualizationState>((set) => ({
  currentAlgorithm: null,
  inputArray: [64, 34, 25, 12, 22, 11, 90, 45, 78, 33],
  availableAlgorithms: [
    bubbleSort, insertionSort, selectionSort, mergeSort, quickSort, heapSort,
    stack, queue, bst, linkedList, avlTree, hashTable,
    bfs, dfs, dijkstra, prim, kruskal,
    redBlackTree, splayTree, trie, bTree, minHeap,
  ],

  selectAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),

  generateRandomInput: (count = 10) =>
    set({
      inputArray: Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1),
    }),

  setInputArray: (arr) => set({ inputArray: arr }),
}));
