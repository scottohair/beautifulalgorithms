import { create } from 'zustand';
import type { AlgorithmImplementation } from '@/lib/types/algorithm';
import { bubbleSort } from '@/algorithms/sorting/bubble-sort';
import { insertionSort } from '@/algorithms/sorting/insertion-sort';
import { selectionSort } from '@/algorithms/sorting/selection-sort';
import { stack } from '@/algorithms/data-structures/stack';
import { queue } from '@/algorithms/data-structures/queue';
import { bst } from '@/algorithms/data-structures/bst';

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
  availableAlgorithms: [bubbleSort, insertionSort, selectionSort, stack, queue, bst],

  selectAlgorithm: (algorithm) => set({ currentAlgorithm: algorithm }),

  generateRandomInput: (count = 10) =>
    set({
      inputArray: Array.from({ length: count }, () => Math.floor(Math.random() * 100) + 1),
    }),

  setInputArray: (arr) => set({ inputArray: arr }),
}));
