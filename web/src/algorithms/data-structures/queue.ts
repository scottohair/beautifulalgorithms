import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const queue: AlgorithmImplementation = {
  id: 'queue',
  name: 'Queue',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure enqueue(Q: queue, value)' },
    { line: 1, text: '  Q.rear ← Q.rear + 1' },
    { line: 2, text: '  Q[Q.rear] ← value' },
    { line: 3, text: '' },
    { line: 4, text: 'procedure dequeue(Q: queue)' },
    { line: 5, text: '  if Q.front > Q.rear then error "underflow"' },
    { line: 6, text: '  value ← Q[Q.front]' },
    { line: 7, text: '  Q.front ← Q.front + 1' },
    { line: 8, text: '  return value' },
    { line: 9, text: '' },
    { line: 10, text: 'procedure peek(Q: queue)' },
    { line: 11, text: '  return Q[Q.front]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const currentQueue: number[] = [];

    // Enqueue all values one by one
    for (let i = 0; i < input.length; i++) {
      currentQueue.push(input[i]);
      const rearIndex = currentQueue.length - 1;

      steps.push({
        type: 'insert',
        array: [...currentQueue],
        highlightedIndices: [rearIndex],
        secondaryIndices: [0],
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Enqueue ${input[i]} at rear (index ${rearIndex})`,
      });
    }

    // Dequeue half the values
    const dequeueCount = Math.floor(currentQueue.length / 2);
    for (let i = 0; i < dequeueCount; i++) {
      const value = currentQueue[0];

      // Highlight element about to be dequeued
      steps.push({
        type: 'highlight',
        array: [...currentQueue],
        highlightedIndices: [0],
        secondaryIndices: [currentQueue.length - 1],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Dequeuing ${value} from front of queue`,
      });

      currentQueue.shift();

      steps.push({
        type: 'remove',
        array: [...currentQueue],
        highlightedIndices: currentQueue.length > 0 ? [0] : [],
        secondaryIndices: currentQueue.length > 0 ? [currentQueue.length - 1] : [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Removed ${value}, new front is ${currentQueue.length > 0 ? currentQueue[0] : 'empty'}`,
      });
    }

    // Peek at front
    if (currentQueue.length > 0) {
      steps.push({
        type: 'highlight',
        array: [...currentQueue],
        highlightedIndices: [0],
        secondaryIndices: [currentQueue.length - 1],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `Peek: front of queue is ${currentQueue[0]}`,
      });
    }

    return steps;
  },
};
