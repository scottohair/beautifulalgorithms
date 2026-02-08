import Foundation

struct FibonacciAlgorithm: AlgorithmExecutable {
    let id = "fibonacci-dp"
    let name = "Fibonacci (Dynamic Programming)"
    let category = "dynamic-programming"
    let timeComplexity = (best: "O(n)", average: "O(n)", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure fibonacci(n)"),
        (1, "  dp[0] ← 0"),
        (2, "  dp[1] ← 1"),
        (3, "  for i ← 2 to n do"),
        (4, "    dp[i] ← dp[i-1] + dp[i-2]"),
        (5, "  return dp[n]")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let n = max(2, min(input.first ?? 10, 30))

        // Initialize DP table
        var dp = [Int](repeating: 0, count: n + 1)
        dp[0] = 0

        steps.append(AlgorithmStep(
            type: .highlight,
            array: dp,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Computing Fibonacci(\(n)) using bottom-up tabulation"
        ))

        // Base case: dp[0] = 0
        steps.append(AlgorithmStep(
            type: .insert,
            array: dp,
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [0],
            pseudocodeLine: 1,
            description: "Base case: dp[0] = 0"
        ))

        // Base case: dp[1] = 1
        dp[1] = 1
        steps.append(AlgorithmStep(
            type: .insert,
            array: dp,
            highlightedIndices: [1],
            secondaryIndices: [],
            sortedIndices: [0, 1],
            pseudocodeLine: 2,
            description: "Base case: dp[1] = 1"
        ))

        var filledIndices = [0, 1]

        // Fill the DP table bottom-up
        for i in 2...n {
            // Show which two previous values we are reading
            steps.append(AlgorithmStep(
                type: .compare,
                array: dp,
                highlightedIndices: [i - 1, i - 2],
                secondaryIndices: [i],
                sortedIndices: filledIndices,
                pseudocodeLine: 4,
                description: "Computing dp[\(i)] = dp[\(i-1)] + dp[\(i-2)] = \(dp[i-1]) + \(dp[i-2])"
            ))

            dp[i] = dp[i - 1] + dp[i - 2]
            filledIndices.append(i)

            // Show the result being placed
            steps.append(AlgorithmStep(
                type: .insert,
                array: dp,
                highlightedIndices: [i],
                secondaryIndices: [i - 1, i - 2],
                sortedIndices: filledIndices,
                pseudocodeLine: 4,
                description: "dp[\(i)] = \(dp[i])"
            ))
        }

        // Final result
        steps.append(AlgorithmStep(
            type: .sorted,
            array: dp,
            highlightedIndices: [n],
            secondaryIndices: [],
            sortedIndices: Array(0...n),
            pseudocodeLine: 5,
            description: "Fibonacci(\(n)) = \(dp[n])"
        ))

        return steps
    }
}
