import Foundation

struct InsertionSort: AlgorithmExecutable {
    let id = "insertion-sort"
    let name = "Insertion Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n)", average: "O(n²)", worst: "O(n²)")
    let spaceComplexity = "O(1)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insertionSort(A: list)"),
        (1, "  for i ← 1 to length(A) - 1 do"),
        (2, "    key ← A[i]"),
        (3, "    j ← i - 1"),
        (4, "    while j ≥ 0 and A[j] > key do"),
        (5, "      A[j + 1] ← A[j]"),
        (6, "      j ← j - 1"),
        (7, "    A[j + 1] ← key"),
        (8, "  return A")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        let n = array.count
        var sortedIndices: [Int] = [0]

        // Initial step: first element is trivially sorted
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 0,
            description: "Element \(array[0]) at index 0 is trivially sorted"
        ))

        for i in 1..<n {
            let key = array[i]

            // Highlight the key being inserted
            steps.append(AlgorithmStep(
                type: .highlight,
                array: array,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 2,
                description: "Key ← \(key) (element at index \(i))"
            ))

            var j = i - 1

            // Compare and shift elements
            while j >= 0 && array[j] > key {
                // Compare step
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: array,
                    highlightedIndices: [j, j + 1],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 4,
                    description: "Comparing \(array[j]) > \(key) — true, shift needed"
                ))

                // Shift element right
                array[j + 1] = array[j]
                steps.append(AlgorithmStep(
                    type: .swap,
                    array: array,
                    highlightedIndices: [j, j + 1],
                    secondaryIndices: [],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 5,
                    description: "Shifting \(array[j]) from index \(j) to index \(j + 1)"
                ))

                j -= 1
            }

            // If we stopped early due to a comparison that was false, show that step
            if j >= 0 {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: array,
                    highlightedIndices: [j],
                    secondaryIndices: [j + 1],
                    sortedIndices: sortedIndices,
                    pseudocodeLine: 4,
                    description: "Comparing \(array[j]) > \(key) — false, stop shifting"
                ))
            }

            // Insert key at correct position
            array[j + 1] = key
            sortedIndices.append(i)
            let insertIndex = j + 1
            steps.append(AlgorithmStep(
                type: .insert,
                array: array,
                highlightedIndices: [insertIndex],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 7,
                description: "Inserting \(key) at index \(insertIndex)"
            ))

            // Mark sorted portion
            steps.append(AlgorithmStep(
                type: .sorted,
                array: array,
                highlightedIndices: Array(0...i),
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 1,
                description: "Elements at indices 0 through \(i) are now sorted"
            ))
        }

        return steps
    }
}
