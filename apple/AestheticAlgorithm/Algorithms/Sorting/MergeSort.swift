import Foundation

struct MergeSort: AlgorithmExecutable {
    let id = "merge-sort"
    let name = "Merge Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure mergeSort(A, left, right)"),
        (1, "  if left < right then"),
        (2, "    mid ← (left + right) / 2"),
        (3, "    mergeSort(A, left, mid)"),
        (4, "    mergeSort(A, mid+1, right)"),
        (5, "    merge(A, left, mid, right)"),
        (6, ""),
        (7, "procedure merge(A, left, mid, right)"),
        (8, "  create temp arrays L, R"),
        (9, "  while i < len(L) and j < len(R) do"),
        (10, "    if L[i] <= R[j] then"),
        (11, "      A[k] ← L[i]; i ← i + 1"),
        (12, "    else"),
        (13, "      A[k] ← R[j]; j ← j + 1"),
        (14, "    k ← k + 1"),
        (15, "  copy remaining elements"),
        (16, "  return A")
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
            description: "Starting merge sort on array of \(array.count) elements"
        ))

        mergeSort(&array, left: 0, right: array.count - 1, steps: &steps, sortedIndices: &sortedIndices)

        // Final sorted state
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: Array(0..<array.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<array.count),
            pseudocodeLine: 16,
            description: "Merge sort complete"
        ))

        return steps
    }

    private func mergeSort(_ array: inout [Int], left: Int, right: Int, steps: inout [AlgorithmStep], sortedIndices: inout [Int]) {
        guard left < right else { return }

        let mid = (left + right) / 2

        // Split step
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: Array(left...mid),
            secondaryIndices: Array((mid + 1)...right),
            sortedIndices: sortedIndices,
            pseudocodeLine: 2,
            description: "Splitting [\(left)...\(right)] at midpoint \(mid)"
        ))

        // Recurse left half
        mergeSort(&array, left: left, right: mid, steps: &steps, sortedIndices: &sortedIndices)

        // Recurse right half
        mergeSort(&array, left: mid + 1, right: right, steps: &steps, sortedIndices: &sortedIndices)

        // Merge the two halves
        merge(&array, left: left, mid: mid, right: right, steps: &steps, sortedIndices: &sortedIndices)
    }

    private func merge(_ array: inout [Int], left: Int, mid: Int, right: Int, steps: inout [AlgorithmStep], sortedIndices: inout [Int]) {
        let leftArray = Array(array[left...mid])
        let rightArray = Array(array[(mid + 1)...right])

        // Show merge start
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: Array(left...mid),
            secondaryIndices: Array((mid + 1)...right),
            sortedIndices: sortedIndices,
            pseudocodeLine: 8,
            description: "Merging [\(left)...\(mid)] and [\(mid + 1)...\(right)]"
        ))

        var i = 0
        var j = 0
        var k = left

        while i < leftArray.count && j < rightArray.count {
            // Compare step
            steps.append(AlgorithmStep(
                type: .compare,
                array: array,
                highlightedIndices: [k],
                secondaryIndices: [left + i, mid + 1 + j].filter { $0 <= right },
                sortedIndices: sortedIndices,
                pseudocodeLine: 10,
                description: "Comparing \(leftArray[i]) and \(rightArray[j])"
            ))

            if leftArray[i] <= rightArray[j] {
                array[k] = leftArray[i]
                steps.append(AlgorithmStep(
                    type: .insert,
                    array: array,
                    highlightedIndices: [k],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 11,
                    description: "Placing \(leftArray[i]) from left subarray at position \(k)"
                ))
                i += 1
            } else {
                array[k] = rightArray[j]
                steps.append(AlgorithmStep(
                    type: .insert,
                    array: array,
                    highlightedIndices: [k],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 13,
                    description: "Placing \(rightArray[j]) from right subarray at position \(k)"
                ))
                j += 1
            }
            k += 1
        }

        // Copy remaining left elements
        while i < leftArray.count {
            array[k] = leftArray[i]
            steps.append(AlgorithmStep(
                type: .insert,
                array: array,
                highlightedIndices: [k],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 15,
                description: "Copying remaining element \(leftArray[i]) from left subarray"
            ))
            i += 1
            k += 1
        }

        // Copy remaining right elements
        while j < rightArray.count {
            array[k] = rightArray[j]
            steps.append(AlgorithmStep(
                type: .insert,
                array: array,
                highlightedIndices: [k],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 15,
                description: "Copying remaining element \(rightArray[j]) from right subarray"
            ))
            j += 1
            k += 1
        }

        // Mark merged region as sorted if this is the final merge
        if left == 0 && right == array.count - 1 {
            sortedIndices = Array(0..<array.count)
        }

        // Show merged result
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: Array(left...right),
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 5,
            description: "Merged region [\(left)...\(right)]: \(Array(array[left...right]))"
        ))
    }
}
