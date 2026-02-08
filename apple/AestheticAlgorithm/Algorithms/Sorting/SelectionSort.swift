import Foundation

struct SelectionSort: AlgorithmExecutable {
    let id = "selection-sort"
    let name = "Selection Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n²)", average: "O(n²)", worst: "O(n²)")
    let spaceComplexity = "O(1)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure selectionSort(A: list)"),
        (1, "  n ← length(A)"),
        (2, "  for i ← 0 to n - 2 do"),
        (3, "    minIndex ← i"),
        (4, "    for j ← i + 1 to n - 1 do"),
        (5, "      if A[j] < A[minIndex] then"),
        (6, "        minIndex ← j"),
        (7, "    if minIndex ≠ i then"),
        (8, "      swap(A[i], A[minIndex])"),
        (9, "  return A")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        let n = array.count
        var sortedIndices: [Int] = []

        for i in 0..<(n - 1) {
            var minIndex = i

            // Highlight the current position and initial min candidate
            steps.append(AlgorithmStep(
                type: .select,
                array: array,
                highlightedIndices: [minIndex],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 3,
                description: "Setting minIndex ← \(i), current minimum is \(array[i])"
            ))

            // Scan through unsorted portion for minimum
            for j in (i + 1)..<n {
                // Compare current element with current minimum
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: array,
                    highlightedIndices: [j, minIndex],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 5,
                    description: "Comparing \(array[j]) with current minimum \(array[minIndex])"
                ))

                if array[j] < array[minIndex] {
                    minIndex = j
                    // New minimum found
                    steps.append(AlgorithmStep(
                        type: .select,
                        array: array,
                        highlightedIndices: [minIndex],
                        secondaryIndices: [i],
                        sortedIndices: sortedIndices,
                        pseudocodeLine: 6,
                        description: "New minimum found: \(array[minIndex]) at index \(minIndex)"
                    ))
                }
            }

            // Swap minimum to its final position if needed
            if minIndex != i {
                steps.append(AlgorithmStep(
                    type: .swap,
                    array: array,
                    highlightedIndices: [i, minIndex],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 8,
                    description: "Swapping \(array[i]) at index \(i) with \(array[minIndex]) at index \(minIndex)"
                ))
                array.swapAt(i, minIndex)
            }

            // Mark position i as sorted
            sortedIndices.append(i)
            steps.append(AlgorithmStep(
                type: .sorted,
                array: array,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 2,
                description: "\(array[i]) is now in its final sorted position at index \(i)"
            ))
        }

        // The last element is sorted by default
        sortedIndices.append(n - 1)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: [n - 1],
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 9,
            description: "Last element \(array[n - 1]) is in its final position. Array is sorted."
        ))

        return steps
    }
}
