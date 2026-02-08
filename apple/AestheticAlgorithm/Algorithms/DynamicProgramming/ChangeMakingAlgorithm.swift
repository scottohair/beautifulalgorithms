import Foundation

struct ChangeMakingAlgorithm: AlgorithmExecutable {
    let id = "change-making"
    let name = "Change Making (Coin Change)"
    let category = "dynamic-programming"
    let timeComplexity = (best: "O(n * amount)", average: "O(n * amount)", worst: "O(n * amount)")
    let spaceComplexity = "O(amount)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure coinChange(coins, amount)"),
        (1, "  dp[0] ← 0"),
        (2, "  for i ← 1 to amount do"),
        (3, "    dp[i] ← ∞"),
        (4, "    for each coin in coins do"),
        (5, "      if coin ≤ i and dp[i - coin] + 1 < dp[i]"),
        (6, "        dp[i] ← dp[i - coin] + 1"),
        (7, "  return dp[amount]")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Parse input: coin denominations from input, target amount = last element
        // If input has fewer than 2 elements, use defaults
        let coins: [Int]
        let amount: Int

        if input.count >= 2 {
            let sortedInput = input.sorted()
            amount = sortedInput.last!
            coins = Array(Set(sortedInput.dropLast().filter { $0 > 0 })).sorted()
        } else {
            coins = [1, 3, 4]
            amount = input.first ?? 11
        }

        let targetAmount = max(1, min(amount, 50))
        let usableCoins = coins.isEmpty ? [1, 3, 4] : coins

        // Use a large sentinel value instead of Int.max to avoid overflow
        let INF = targetAmount + 1

        // Initialize DP table
        var dp = [Int](repeating: INF, count: targetAmount + 1)
        dp[0] = 0

        steps.append(AlgorithmStep(
            type: .highlight,
            array: dp,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Finding minimum coins for amount \(targetAmount) using coins \(usableCoins)"
        ))

        // Base case
        steps.append(AlgorithmStep(
            type: .insert,
            array: dp,
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [0],
            pseudocodeLine: 1,
            description: "Base case: dp[0] = 0 (zero coins needed for amount 0)"
        ))

        var filledIndices = [0]

        // Fill DP table
        for i in 1...targetAmount {
            // Show initialization of dp[i]
            steps.append(AlgorithmStep(
                type: .highlight,
                array: dp,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: filledIndices,
                pseudocodeLine: 3,
                description: "Initializing dp[\(i)] = \u{221E} (infinity)"
            ))

            for coin in usableCoins {
                if coin <= i {
                    let prevIndex = i - coin
                    let candidate = dp[prevIndex] + 1

                    // Show comparison step
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: dp,
                        highlightedIndices: [i],
                        secondaryIndices: [prevIndex],
                        sortedIndices: filledIndices,
                        pseudocodeLine: 5,
                        description: "Coin \(coin): dp[\(i) - \(coin)] + 1 = \(dp[prevIndex] == INF ? "\u{221E}" : "\(candidate)") vs dp[\(i)] = \(dp[i] == INF ? "\u{221E}" : "\(dp[i])")"
                    ))

                    if candidate < dp[i] {
                        dp[i] = candidate

                        // Show update step
                        steps.append(AlgorithmStep(
                            type: .swap,
                            array: dp,
                            highlightedIndices: [i],
                            secondaryIndices: [prevIndex],
                            sortedIndices: filledIndices,
                            pseudocodeLine: 6,
                            description: "Update dp[\(i)] = \(dp[i]) (using coin \(coin))"
                        ))
                    }
                }
            }

            filledIndices.append(i)

            // Show completed cell
            steps.append(AlgorithmStep(
                type: .insert,
                array: dp,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: filledIndices,
                pseudocodeLine: 2,
                description: "dp[\(i)] = \(dp[i] >= INF ? "-1 (impossible)" : "\(dp[i])")"
            ))
        }

        // Final result
        let result = dp[targetAmount] >= INF ? -1 : dp[targetAmount]
        steps.append(AlgorithmStep(
            type: .sorted,
            array: dp,
            highlightedIndices: [targetAmount],
            secondaryIndices: [],
            sortedIndices: Array(0...targetAmount),
            pseudocodeLine: 7,
            description: "Minimum coins for amount \(targetAmount) = \(result)"
        ))

        return steps
    }
}
