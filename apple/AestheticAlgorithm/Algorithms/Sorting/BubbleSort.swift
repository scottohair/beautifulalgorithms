import Foundation

struct BubbleSort: AlgorithmExecutable {
    let id = "bubble-sort"
    let name = "Bubble Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n)", average: "O(n²)", worst: "O(n²)")
    let spaceComplexity = "O(1)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure bubbleSort(A: list)"),
        (1, "  n ← length(A)"),
        (2, "  for i ← 0 to n-1 do"),
        (3, "    swapped ← false"),
        (4, "    for j ← 0 to n-i-2 do"),
        (5, "      if A[j] > A[j+1] then"),
        (6, "        swap(A[j], A[j+1])"),
        (7, "        swapped ← true"),
        (8, "    if not swapped then"),
        (9, "      break"),
        (10, "  return A")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        let n = array.count
        var sortedIndices: [Int] = []

        for i in 0..<n {
            var swapped = false
            for j in 0..<(n - i - 1) {
                // Compare step
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: array,
                    highlightedIndices: [j, j + 1],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 5,
                    description: "Comparing \(array[j]) and \(array[j + 1])"
                ))

                if array[j] > array[j + 1] {
                    // Swap step
                    array.swapAt(j, j + 1)
                    swapped = true
                    steps.append(AlgorithmStep(
                        type: .swap,
                        array: array,
                        highlightedIndices: [j, j + 1],
                        secondaryIndices: [],
                        sortedIndices: sortedIndices,
                        pseudocodeLine: 6,
                        description: "Swapping \(array[j]) and \(array[j + 1])"
                    ))
                }
            }

            sortedIndices.append(n - i - 1)
            steps.append(AlgorithmStep(
                type: .sorted,
                array: array,
                highlightedIndices: [n - i - 1],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 8,
                description: "\(array[n - i - 1]) is in its final position"
            ))

            if !swapped { break }
        }

        return steps
    }
}
