import Foundation

struct NQueensAlgorithm: AlgorithmExecutable {
    let id = "n-queens"
    let name = "N-Queens"
    let category = "backtracking"
    let timeComplexity = (best: "O(n!)", average: "O(n!)", worst: "O(n!)")
    let spaceComplexity = "O(n\u{00B2})"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure nQueens(board, row)"),
        (1, "  if row = n then"),
        (2, "    solution found"),
        (3, "  for col ← 0 to n-1 do"),
        (4, "    if isSafe(board, row, col) then"),
        (5, "      board[row][col] ← Q"),
        (6, "      nQueens(board, row + 1)"),
        (7, "      board[row][col] ← empty  // backtrack"),
        (8, ""),
        (9, "procedure isSafe(board, row, col)"),
        (10, "  check column, diagonals")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let n = max(4, min(input.first ?? 8, 12))

        // Board represented as 1D array: 0 = empty, 1 = queen
        var board = [Int](repeating: 0, count: n * n)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: board,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Solving \(n)-Queens problem using backtracking"
        ))

        _ = solve(&board, row: 0, n: n, steps: &steps)

        return steps
    }

    // MARK: - Backtracking solver

    private func solve(_ board: inout [Int], row: Int, n: Int, steps: inout [AlgorithmStep]) -> Bool {
        if row == n {
            // Solution found - highlight all queens
            let queenIndices = board.indices.filter { board[$0] == 1 }
            steps.append(AlgorithmStep(
                type: .sorted,
                array: board,
                highlightedIndices: queenIndices,
                secondaryIndices: [],
                sortedIndices: queenIndices,
                pseudocodeLine: 2,
                description: "Solution found! All \(n) queens placed safely."
            ))
            return true
        }

        for col in 0..<n {
            let index = row * n + col
            let queenIndices = board.indices.filter { board[$0] == 1 }

            // Show attempting to place queen
            steps.append(AlgorithmStep(
                type: .highlight,
                array: board,
                highlightedIndices: [index],
                secondaryIndices: queenIndices,
                sortedIndices: queenIndices,
                pseudocodeLine: 3,
                description: "Trying queen at row \(row), col \(col)"
            ))

            if isSafe(board, row: row, col: col, n: n) {
                // Show safety check passed
                let attackedCells = getAttackedCells(row: row, col: col, n: n)
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: board,
                    highlightedIndices: [index],
                    secondaryIndices: attackedCells.filter { board[$0] == 0 && $0 != index },
                    sortedIndices: queenIndices,
                    pseudocodeLine: 4,
                    description: "Position (\(row), \(col)) is safe"
                ))

                // Place queen
                board[index] = 1
                let updatedQueens = board.indices.filter { board[$0] == 1 }

                steps.append(AlgorithmStep(
                    type: .insert,
                    array: board,
                    highlightedIndices: [index],
                    secondaryIndices: [],
                    sortedIndices: updatedQueens,
                    pseudocodeLine: 5,
                    description: "Placed queen at row \(row), col \(col)"
                ))

                // Recurse to next row
                if solve(&board, row: row + 1, n: n, steps: &steps) {
                    return true
                }

                // Backtrack - remove queen
                board[index] = 0
                let afterRemoval = board.indices.filter { board[$0] == 1 }

                steps.append(AlgorithmStep(
                    type: .remove,
                    array: board,
                    highlightedIndices: [index],
                    secondaryIndices: [],
                    sortedIndices: afterRemoval,
                    pseudocodeLine: 7,
                    description: "Backtrack: removed queen from row \(row), col \(col)"
                ))
            } else {
                // Show safety check failed - find the conflicting queen(s)
                let conflicts = getConflicts(board, row: row, col: col, n: n)
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: board,
                    highlightedIndices: [index],
                    secondaryIndices: conflicts,
                    sortedIndices: queenIndices,
                    pseudocodeLine: 4,
                    description: "Position (\(row), \(col)) is NOT safe - conflicts detected"
                ))
            }
        }

        return false
    }

    // MARK: - Safety checks

    private func isSafe(_ board: [Int], row: Int, col: Int, n: Int) -> Bool {
        // Check column above
        for r in 0..<row {
            if board[r * n + col] == 1 { return false }
        }

        // Check upper-left diagonal
        var r = row - 1, c = col - 1
        while r >= 0 && c >= 0 {
            if board[r * n + c] == 1 { return false }
            r -= 1; c -= 1
        }

        // Check upper-right diagonal
        r = row - 1; c = col + 1
        while r >= 0 && c < n {
            if board[r * n + c] == 1 { return false }
            r -= 1; c += 1
        }

        return true
    }

    private func getConflicts(_ board: [Int], row: Int, col: Int, n: Int) -> [Int] {
        var conflicts: [Int] = []

        // Check column above
        for r in 0..<row {
            let idx = r * n + col
            if board[idx] == 1 { conflicts.append(idx) }
        }

        // Check upper-left diagonal
        var r = row - 1, c = col - 1
        while r >= 0 && c >= 0 {
            let idx = r * n + c
            if board[idx] == 1 { conflicts.append(idx) }
            r -= 1; c -= 1
        }

        // Check upper-right diagonal
        r = row - 1; c = col + 1
        while r >= 0 && c < n {
            let idx = r * n + c
            if board[idx] == 1 { conflicts.append(idx) }
            r -= 1; c += 1
        }

        return conflicts
    }

    private func getAttackedCells(row: Int, col: Int, n: Int) -> [Int] {
        var cells: [Int] = []

        for r in 0..<n {
            // Same column
            cells.append(r * n + col)
            // Diagonals
            let d1 = col + (r - row)
            let d2 = col - (r - row)
            if d1 >= 0 && d1 < n { cells.append(r * n + d1) }
            if d2 >= 0 && d2 < n && d2 != d1 { cells.append(r * n + d2) }
        }

        return Array(Set(cells))
    }
}
