import Foundation

struct LCSAlgorithm: AlgorithmExecutable {
    let id = "lcs"
    let name = "Longest Common Subsequence"
    let category = "dynamic-programming"
    let timeComplexity = (best: "O(m * n)", average: "O(m * n)", worst: "O(m * n)")
    let spaceComplexity = "O(m * n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure LCS(X, Y)"),
        (1, "  m ← length(X), n ← length(Y)"),
        (2, "  create dp[m+1][n+1] initialized to 0"),
        (3, "  for i ← 1 to m do"),
        (4, "    for j ← 1 to n do"),
        (5, "      if X[i-1] = Y[j-1] then"),
        (6, "        dp[i][j] ← dp[i-1][j-1] + 1"),
        (7, "      else"),
        (8, "        dp[i][j] ← max(dp[i-1][j], dp[i][j-1])"),
        (9, "  return dp[m][n]")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Split input at midpoint to form two sequences
        // If input is empty or too small, use defaults
        let seqX: [Int]
        let seqY: [Int]

        if input.count >= 4 {
            let mid = input.count / 2
            seqX = Array(input[0..<mid])
            seqY = Array(input[mid...])
        } else {
            seqX = [1, 3, 4, 1, 2]
            seqY = [3, 4, 1, 2, 1]
        }

        let m = seqX.count
        let n = seqY.count
        let cols = n + 1

        // 2D DP table flattened to 1D: dp[i][j] -> flat[i * cols + j]
        var flat = [Int](repeating: 0, count: (m + 1) * cols)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Finding LCS of X=\(seqX) and Y=\(seqY)"
        ))

        // Show initialized table
        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "Created \(m+1)x\(n+1) DP table initialized to 0"
        ))

        var filledIndices: [Int] = []
        // Mark the first row and first column as base cases
        for j in 0...n {
            filledIndices.append(j) // row 0
        }
        for i in 1...m {
            filledIndices.append(i * cols) // column 0
        }

        // Fill the DP table
        for i in 1...m {
            for j in 1...n {
                let currentIdx = i * cols + j
                let diagIdx = (i - 1) * cols + (j - 1)
                let upIdx = (i - 1) * cols + j
                let leftIdx = i * cols + (j - 1)

                if seqX[i - 1] == seqY[j - 1] {
                    // Match: dp[i][j] = dp[i-1][j-1] + 1
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: flat,
                        highlightedIndices: [currentIdx],
                        secondaryIndices: [diagIdx],
                        sortedIndices: filledIndices,
                        pseudocodeLine: 5,
                        description: "X[\(i-1)]=\(seqX[i-1]) == Y[\(j-1)]=\(seqY[j-1]) \u{2192} match!"
                    ))

                    flat[currentIdx] = flat[diagIdx] + 1

                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: flat,
                        highlightedIndices: [currentIdx],
                        secondaryIndices: [diagIdx],
                        sortedIndices: filledIndices,
                        pseudocodeLine: 6,
                        description: "dp[\(i)][\(j)] = dp[\(i-1)][\(j-1)] + 1 = \(flat[currentIdx])"
                    ))
                } else {
                    // No match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: flat,
                        highlightedIndices: [currentIdx],
                        secondaryIndices: [upIdx, leftIdx],
                        sortedIndices: filledIndices,
                        pseudocodeLine: 5,
                        description: "X[\(i-1)]=\(seqX[i-1]) != Y[\(j-1)]=\(seqY[j-1]) \u{2192} take max"
                    ))

                    flat[currentIdx] = max(flat[upIdx], flat[leftIdx])

                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: flat,
                        highlightedIndices: [currentIdx],
                        secondaryIndices: [upIdx, leftIdx],
                        sortedIndices: filledIndices,
                        pseudocodeLine: 8,
                        description: "dp[\(i)][\(j)] = max(dp[\(i-1)][\(j)], dp[\(i)][\(j-1)]) = max(\(flat[upIdx]), \(flat[leftIdx])) = \(flat[currentIdx])"
                    ))
                }

                filledIndices.append(currentIdx)
            }
        }

        // Final result
        let resultIdx = m * cols + n
        steps.append(AlgorithmStep(
            type: .sorted,
            array: flat,
            highlightedIndices: [resultIdx],
            secondaryIndices: [],
            sortedIndices: Array(0..<flat.count),
            pseudocodeLine: 9,
            description: "LCS length = \(flat[resultIdx]). Table is \(m+1) rows x \(n+1) cols."
        ))

        return steps
    }
}
