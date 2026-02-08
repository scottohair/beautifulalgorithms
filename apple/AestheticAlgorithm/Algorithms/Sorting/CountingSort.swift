import Foundation

struct CountingSort: AlgorithmExecutable {
    let id = "counting-sort"
    let name = "Counting Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)")
    let spaceComplexity = "O(n + k)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure countingSort(A)"),
        (1, "  k ← max(A)"),
        (2, "  count[0..k] ← 0"),
        (3, "  // Count phase"),
        (4, "  for each element in A do"),
        (5, "    count[element] ← count[element] + 1"),
        (6, "  // Cumulative count"),
        (7, "  for i ← 1 to k do"),
        (8, "    count[i] ← count[i] + count[i-1]"),
        (9, "  // Placement phase"),
        (10, "  for i ← n-1 downto 0 do"),
        (11, "    output[count[A[i]] - 1] ← A[i]"),
        (12, "    count[A[i]] ← count[A[i]] - 1"),
        (13, "  return output")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        let array = input

        if array.isEmpty { return steps }

        let n = array.count
        let maxVal = array.max() ?? 0
        let k = maxVal + 1

        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Starting Counting Sort on \(n) elements. Max value = \(maxVal)"
        ))

        // Initialize count array
        var count = [Int](repeating: 0, count: k)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: count,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "Initialized count array of size \(k) to all zeros"
        ))

        // Count phase
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 3,
            description: "Phase 1: Counting occurrences of each element"
        ))

        for i in 0..<n {
            let val = array[i]

            // Highlight element being counted
            steps.append(AlgorithmStep(
                type: .select,
                array: array,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "Counting element \(val) at index \(i)"
            ))

            count[val] += 1

            // Show updated count array
            steps.append(AlgorithmStep(
                type: .insert,
                array: count,
                highlightedIndices: [val],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "count[\(val)] = \(count[val])"
            ))
        }

        // Cumulative count phase
        steps.append(AlgorithmStep(
            type: .highlight,
            array: count,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 6,
            description: "Phase 2: Computing cumulative counts"
        ))

        for i in 1..<k {
            steps.append(AlgorithmStep(
                type: .compare,
                array: count,
                highlightedIndices: [i],
                secondaryIndices: [i - 1],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "count[\(i)] = count[\(i)] + count[\(i-1)] = \(count[i]) + \(count[i-1])"
            ))

            count[i] += count[i - 1]

            steps.append(AlgorithmStep(
                type: .insert,
                array: count,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "count[\(i)] = \(count[i])"
            ))
        }

        // Placement phase
        var output = [Int](repeating: 0, count: n)
        var placedIndices: [Int] = []

        steps.append(AlgorithmStep(
            type: .highlight,
            array: output,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: "Phase 3: Placing elements into sorted output"
        ))

        for i in stride(from: n - 1, through: 0, by: -1) {
            let val = array[i]

            // Show element being placed
            steps.append(AlgorithmStep(
                type: .select,
                array: array,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Placing element \(val) from input[\(i)]"
            ))

            count[val] -= 1
            let outputIndex = count[val]
            output[outputIndex] = val
            placedIndices.append(outputIndex)

            // Show element placed in output
            steps.append(AlgorithmStep(
                type: .insert,
                array: output,
                highlightedIndices: [outputIndex],
                secondaryIndices: [],
                sortedIndices: placedIndices.sorted(),
                pseudocodeLine: 11,
                description: "output[\(outputIndex)] = \(val). count[\(val)] decremented to \(count[val])"
            ))
        }

        // Final sorted output
        steps.append(AlgorithmStep(
            type: .sorted,
            array: output,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: Array(0..<n),
            pseudocodeLine: 13,
            description: "Counting Sort complete"
        ))

        return steps
    }
}
