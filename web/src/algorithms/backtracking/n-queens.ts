import type { AlgorithmImplementation, AlgorithmStep } from '@/lib/types/algorithm';

export const nQueens: AlgorithmImplementation = {
  id: 'n-queens',
  name: 'N-Queens',
  category: 'backtracking',
  timeComplexity: { best: 'O(n!)', average: 'O(n!)', worst: 'O(n!)' },
  spaceComplexity: 'O(n²)',
  pseudocode: [
    { line: 0, text: 'procedure nQueens(board, row)' },
    { line: 1, text: '  if row = n then' },
    { line: 2, text: '    solution found!' },
    { line: 3, text: '  for col ← 0 to n-1 do' },
    { line: 4, text: '    if isSafe(board, row, col) then' },
    { line: 5, text: '      place queen at (row, col)' },
    { line: 6, text: '      nQueens(board, row + 1)' },
    { line: 7, text: '      remove queen from (row, col)' },
    { line: 8, text: 'procedure isSafe(board, row, col)' },
    { line: 9, text: '  check column, diagonals for conflicts' },
  ],

  generateSteps(input: number[]): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Board size derived from input length, clamped between 4 and 8
    const n = Math.min(Math.max(Math.floor(Math.sqrt(input.length)), 4), 8);

    // Board as 1D array of size n*n: 0 = empty, 1 = queen
    // board[row * n + col]
    const board: number[] = new Array(n * n).fill(0);
    const placedQueens: number[] = []; // indices of placed queens
    let solutionFound = false;

    // Show initial empty board
    steps.push({
      type: 'highlight',
      array: [...board],
      highlightedIndices: [],
      secondaryIndices: [],
      sortedIndices: [],
      pseudocodeLine: 0,
      description: `Starting N-Queens with ${n}x${n} board`,
    });

    function isSafe(row: number, col: number): boolean {
      // Check column
      for (let r = 0; r < row; r++) {
        if (board[r * n + col] === 1) return false;
      }
      // Check upper-left diagonal
      for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
        if (board[r * n + c] === 1) return false;
      }
      // Check upper-right diagonal
      for (let r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
        if (board[r * n + c] === 1) return false;
      }
      return true;
    }

    function getConflictIndices(row: number, col: number): number[] {
      const conflicts: number[] = [];
      // Column conflicts
      for (let r = 0; r < row; r++) {
        conflicts.push(r * n + col);
      }
      // Upper-left diagonal
      for (let r = row - 1, c = col - 1; r >= 0 && c >= 0; r--, c--) {
        conflicts.push(r * n + c);
      }
      // Upper-right diagonal
      for (let r = row - 1, c = col + 1; r >= 0 && c < n; r--, c++) {
        conflicts.push(r * n + c);
      }
      return conflicts;
    }

    function solve(row: number): boolean {
      if (solutionFound) return true;

      if (row === n) {
        solutionFound = true;
        steps.push({
          type: 'sorted',
          array: [...board],
          highlightedIndices: [...placedQueens],
          secondaryIndices: [],
          sortedIndices: [...placedQueens],
          pseudocodeLine: 2,
          description: `Solution found! All ${n} queens placed safely.`,
        });
        return true;
      }

      for (let col = 0; col < n; col++) {
        const cellIdx = row * n + col;
        const safe = isSafe(row, col);

        if (safe) {
          // Show safety check passed
          steps.push({
            type: 'compare',
            array: [...board],
            highlightedIndices: [cellIdx],
            secondaryIndices: getConflictIndices(row, col),
            sortedIndices: [...placedQueens],
            pseudocodeLine: 4,
            description: `Row ${row}, Col ${col}: safe to place queen`,
          });

          // Place queen
          board[cellIdx] = 1;
          placedQueens.push(cellIdx);

          steps.push({
            type: 'insert',
            array: [...board],
            highlightedIndices: [cellIdx],
            secondaryIndices: [],
            sortedIndices: [...placedQueens],
            pseudocodeLine: 5,
            description: `Place queen at (${row}, ${col})`,
          });

          // Recurse
          if (solve(row + 1)) return true;

          // Backtrack: remove queen
          board[cellIdx] = 0;
          placedQueens.pop();

          steps.push({
            type: 'remove',
            array: [...board],
            highlightedIndices: [cellIdx],
            secondaryIndices: [],
            sortedIndices: [...placedQueens],
            pseudocodeLine: 7,
            description: `Backtrack: remove queen from (${row}, ${col})`,
          });
        } else {
          // Show conflict
          steps.push({
            type: 'compare',
            array: [...board],
            highlightedIndices: [cellIdx],
            secondaryIndices: getConflictIndices(row, col),
            sortedIndices: [...placedQueens],
            pseudocodeLine: 9,
            description: `Row ${row}, Col ${col}: conflict detected, skip`,
          });
        }
      }

      return false;
    }

    solve(0);

    if (!solutionFound) {
      steps.push({
        type: 'sorted',
        array: [...board],
        highlightedIndices: [],
        secondaryIndices: [],
        sortedIndices: [],
        pseudocodeLine: 0,
        description: `No solution exists for ${n}-Queens.`,
      });
    }

    return steps;
  },
};
