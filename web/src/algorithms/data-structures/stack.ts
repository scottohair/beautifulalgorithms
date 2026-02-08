import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const stack: AlgorithmImplementation = {
  id: 'stack',
  name: 'Stack',
  category: 'data-structures',
  timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
  spaceComplexity: 'O(n)',
  pseudocode: [
    { line: 0, text: 'procedure push(S: stack, value)' },
    { line: 1, text: '  S.top ← S.top + 1' },
    { line: 2, text: '  S[S.top] ← value' },
    { line: 3, text: '' },
    { line: 4, text: 'procedure pop(S: stack)' },
    { line: 5, text: '  if S.top < 0 then error "underflow"' },
    { line: 6, text: '  value ← S[S.top]' },
    { line: 7, text: '  S.top ← S.top - 1' },
    { line: 8, text: '  return value' },
    { line: 9, text: '' },
    { line: 10, text: 'procedure peek(S: stack)' },
    { line: 11, text: '  return S[S.top]' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];
    const currentStack: number[] = [];

    // Push all values one by one
    for (let i = 0; i < input.length; i++) {
      currentStack.push(input[i]);
      const topIndex = currentStack.length - 1;

      steps.push({
        type: 'insert',
        array: [...currentStack],
        highlightedIndices: [topIndex],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 2,
        description: `Push ${input[i]} onto stack (top = index ${topIndex})`,
      });
    }

    // Pop half the values
    const popCount = Math.floor(currentStack.length / 2);
    for (let i = 0; i < popCount; i++) {
      const topIndex = currentStack.length - 1;
      const value = currentStack[topIndex];

      // Highlight element about to be popped
      steps.push({
        type: 'highlight',
        array: [...currentStack],
        highlightedIndices: [topIndex],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 6,
        description: `Popping ${value} from top of stack`,
      });

      currentStack.pop();

      steps.push({
        type: 'remove',
        array: [...currentStack],
        highlightedIndices: currentStack.length > 0 ? [currentStack.length - 1] : [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 7,
        description: `Removed ${value}, new top is ${currentStack.length > 0 ? currentStack[currentStack.length - 1] : 'empty'}`,
      });
    }

    // Peek at top
    if (currentStack.length > 0) {
      const topIndex = currentStack.length - 1;
      steps.push({
        type: 'highlight',
        array: [...currentStack],
        highlightedIndices: [topIndex],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 11,
        description: `Peek: top of stack is ${currentStack[topIndex]}`,
      });
    }

    return steps;
  },
};
