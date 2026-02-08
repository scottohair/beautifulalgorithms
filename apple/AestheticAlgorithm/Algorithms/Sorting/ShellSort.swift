import Foundation

struct ShellSort: AlgorithmExecutable {
    let id = "shell-sort"
    let name = "Shell Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n log n)", average: "O(n^(4/3))", worst: "O(n\u{00B2})")
    let spaceComplexity = "O(1)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure shellSort(A)"),
        (1, "  n ← length(A)"),
        (2, "  gap ← n / 2"),
        (3, "  while gap > 0 do"),
        (4, "    for i ← gap to n-1 do"),
        (5, "      temp ← A[i]"),
        (6, "      j ← i"),
        (7, "      while j >= gap and A[j - gap] > temp do"),
        (8, "        A[j] ← A[j - gap]"),
        (9, "        j ← j - gap"),
        (10, "      A[j] ← temp"),
        (11, "    gap ← gap / 2"),
        (12, "  return A")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        let n = array.count

        if n <= 1 {
            return steps
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Starting Shell Sort on array of \(n) elements"
        ))

        var gap = n / 2

        while gap > 0 {
            // Show current gap
            steps.append(AlgorithmStep(
                type: .highlight,
                array: array,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "Gap = \(gap): performing insertion sort on gap-separated sublists"
            ))

            for i in gap..<n {
                let temp = array[i]
                var j = i

                // Show the element being inserted
                steps.append(AlgorithmStep(
                    type: .select,
                    array: array,
                    highlightedIndices: [i],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 5,
                    description: "Gap \(gap): inserting element \(temp) at index \(i)"
                ))

                while j >= gap && array[j - gap] > temp {
                    // Compare step
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: array,
                        highlightedIndices: [j, j - gap],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 7,
                        description: "Comparing: A[\(j - gap)]=\(array[j - gap]) > \(temp)? Yes"
                    ))

                    // Shift element
                    array[j] = array[j - gap]

                    steps.append(AlgorithmStep(
                        type: .swap,
                        array: array,
                        highlightedIndices: [j, j - gap],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 8,
                        description: "Shifting \(array[j]) from index \(j - gap) to index \(j)"
                    ))

                    j -= gap
                }

                if j != i {
                    // Place temp in its correct position
                    array[j] = temp

                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: array,
                        highlightedIndices: [j],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 10,
                        description: "Placed \(temp) at index \(j)"
                    ))
                } else if j >= gap {
                    // No shift needed, show compare that stopped the loop
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: array,
                        highlightedIndices: [j, j - gap],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 7,
                        description: "Comparing: A[\(j - gap)]=\(array[j - gap]) > \(temp)? No, element stays"
                    ))
                }
            }

            // Pass complete for this gap
            steps.append(AlgorithmStep(
                type: .passComplete,
                array: array,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 11,
                description: "Gap \(gap) pass complete. Array: \(array)"
            ))

            gap /= 2
        }

        // Final sorted state
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: Array(0..<n),
            pseudocodeLine: 12,
            description: "Shell Sort complete"
        ))

        return steps
    }
}
