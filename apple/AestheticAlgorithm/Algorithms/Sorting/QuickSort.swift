import Foundation

struct QuickSort: AlgorithmExecutable {
    let id = "quick-sort"
    let name = "Quick Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n log n)", average: "O(n log n)", worst: "O(n\u{00B2})")
    let spaceComplexity = "O(log n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure quickSort(A, low, high)"),
        (1, "  if low < high then"),
        (2, "    pivot ← partition(A, low, high)"),
        (3, "    quickSort(A, low, pivot - 1)"),
        (4, "    quickSort(A, pivot + 1, high)"),
        (5, ""),
        (6, "procedure partition(A, low, high)"),
        (7, "  pivot ← A[high]"),
        (8, "  i ← low - 1"),
        (9, "  for j ← low to high - 1 do"),
        (10, "    if A[j] <= pivot then"),
        (11, "      i ← i + 1"),
        (12, "      swap(A[i], A[j])"),
        (13, "  swap(A[i+1], A[high])"),
        (14, "  return i + 1")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        var sortedIndices: [Int] = []

        if array.isEmpty { return steps }

        // Initial state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Starting quick sort on array of \(array.count) elements"
        ))

        quickSort(&array, low: 0, high: array.count - 1, steps: &steps, sortedIndices: &sortedIndices)

        // Final sorted state
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: Array(0..<array.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<array.count),
            pseudocodeLine: 14,
            description: "Quick sort complete"
        ))

        return steps
    }

    private func quickSort(_ array: inout [Int], low: Int, high: Int, steps: inout [AlgorithmStep], sortedIndices: inout [Int]) {
        guard low < high else {
            if low == high && !sortedIndices.contains(low) {
                sortedIndices.append(low)
                steps.append(AlgorithmStep(
                    type: .sorted,
                    array: array,
                    highlightedIndices: [low],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 1,
                    description: "\(array[low]) is in its final position"
                ))
            }
            return
        }

        let pivotIndex = partition(&array, low: low, high: high, steps: &steps, sortedIndices: &sortedIndices)

        // Pivot is now in final position
        if !sortedIndices.contains(pivotIndex) {
            sortedIndices.append(pivotIndex)
        }
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: [pivotIndex],
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 2,
            description: "Pivot \(array[pivotIndex]) is in its final sorted position at index \(pivotIndex)"
        ))

        quickSort(&array, low: low, high: pivotIndex - 1, steps: &steps, sortedIndices: &sortedIndices)
        quickSort(&array, low: pivotIndex + 1, high: high, steps: &steps, sortedIndices: &sortedIndices)
    }

    private func partition(_ array: inout [Int], low: Int, high: Int, steps: inout [AlgorithmStep], sortedIndices: inout [Int]) -> Int {
        let pivot = array[high]

        // Show pivot selection
        steps.append(AlgorithmStep(
            type: .select,
            array: array,
            highlightedIndices: [high],
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 7,
            description: "Selecting pivot: \(pivot) at index \(high)"
        ))

        var i = low - 1

        for j in low..<high {
            // Compare step
            steps.append(AlgorithmStep(
                type: .compare,
                array: array,
                highlightedIndices: [j],
                secondaryIndices: [high],
                sortedIndices: sortedIndices,
                pseudocodeLine: 10,
                description: "Comparing \(array[j]) with pivot \(pivot)"
            ))

            if array[j] <= pivot {
                i += 1
                if i != j {
                    array.swapAt(i, j)
                    steps.append(AlgorithmStep(
                        type: .swap,
                        array: array,
                        highlightedIndices: [i, j],
                        secondaryIndices: [high],
                        sortedIndices: sortedIndices,
                        pseudocodeLine: 12,
                        description: "Swapping \(array[i]) and \(array[j])"
                    ))
                }
            }
        }

        // Place pivot in correct position
        if i + 1 != high {
            array.swapAt(i + 1, high)
            steps.append(AlgorithmStep(
                type: .swap,
                array: array,
                highlightedIndices: [i + 1, high],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 13,
                description: "Placing pivot \(array[i + 1]) at position \(i + 1)"
            ))
        }

        return i + 1
    }
}
