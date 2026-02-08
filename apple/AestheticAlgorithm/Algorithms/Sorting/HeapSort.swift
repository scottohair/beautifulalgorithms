import Foundation

struct HeapSort: AlgorithmExecutable {
    let id = "heap-sort"
    let name = "Heap Sort"
    let category = "sorting"
    let timeComplexity = (best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)")
    let spaceComplexity = "O(1)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure heapSort(A)"),
        (1, "  n ← length(A)"),
        (2, "  // Build max heap"),
        (3, "  for i ← n/2 - 1 downto 0 do"),
        (4, "    heapify(A, n, i)"),
        (5, "  // Extract elements from heap"),
        (6, "  for i ← n - 1 downto 1 do"),
        (7, "    swap(A[0], A[i])"),
        (8, "    heapify(A, i, 0)"),
        (9, ""),
        (10, "procedure heapify(A, n, i)"),
        (11, "  largest ← i"),
        (12, "  left ← 2*i + 1"),
        (13, "  right ← 2*i + 2"),
        (14, "  if left < n and A[left] > A[largest]"),
        (15, "    largest ← left"),
        (16, "  if right < n and A[right] > A[largest]"),
        (17, "    largest ← right"),
        (18, "  if largest ≠ i then"),
        (19, "    swap(A[i], A[largest])"),
        (20, "    heapify(A, n, largest)")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var array = input
        var steps: [AlgorithmStep] = []
        var sortedIndices: [Int] = []
        let n = array.count

        if n == 0 { return steps }

        // Initial state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Starting heap sort on array of \(n) elements"
        ))

        // Build max heap phase
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "Phase 1: Building max heap"
        ))

        for i in stride(from: n / 2 - 1, through: 0, by: -1) {
            heapify(&array, heapSize: n, rootIndex: i, steps: &steps, sortedIndices: &sortedIndices)
        }

        // Max heap built
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 4,
            description: "Max heap built: \(array)"
        ))

        // Extraction phase
        steps.append(AlgorithmStep(
            type: .highlight,
            array: array,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: sortedIndices,
            pseudocodeLine: 5,
            description: "Phase 2: Extracting elements from heap"
        ))

        for i in stride(from: n - 1, through: 1, by: -1) {
            // Swap root (max) with last unsorted element
            steps.append(AlgorithmStep(
                type: .compare,
                array: array,
                highlightedIndices: [0, i],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 7,
                description: "Moving max element \(array[0]) to position \(i)"
            ))

            array.swapAt(0, i)

            steps.append(AlgorithmStep(
                type: .swap,
                array: array,
                highlightedIndices: [0, i],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 7,
                description: "Swapped \(array[0]) and \(array[i])"
            ))

            // Mark as sorted
            sortedIndices.append(i)
            steps.append(AlgorithmStep(
                type: .sorted,
                array: array,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 7,
                description: "\(array[i]) is now in its final sorted position"
            ))

            // Restore heap property for reduced heap
            heapify(&array, heapSize: i, rootIndex: 0, steps: &steps, sortedIndices: &sortedIndices)
        }

        // First element is sorted by default
        sortedIndices.append(0)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: array,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: Array(0..<n),
            pseudocodeLine: 0,
            description: "Heap sort complete"
        ))

        return steps
    }

    private func heapify(_ array: inout [Int], heapSize: Int, rootIndex: Int, steps: inout [AlgorithmStep], sortedIndices: inout [Int]) {
        var largest = rootIndex
        let left = 2 * rootIndex + 1
        let right = 2 * rootIndex + 2

        // Compare with left child
        if left < heapSize {
            steps.append(AlgorithmStep(
                type: .compare,
                array: array,
                highlightedIndices: [largest, left],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 14,
                description: "Comparing \(array[largest]) with left child \(array[left])"
            ))

            if array[left] > array[largest] {
                largest = left
            }
        }

        // Compare with right child
        if right < heapSize {
            steps.append(AlgorithmStep(
                type: .compare,
                array: array,
                highlightedIndices: [largest, right],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 16,
                description: "Comparing \(array[largest]) with right child \(array[right])"
            ))

            if array[right] > array[largest] {
                largest = right
            }
        }

        // Swap if needed and recurse
        if largest != rootIndex {
            steps.append(AlgorithmStep(
                type: .swap,
                array: array,
                highlightedIndices: [rootIndex, largest],
                secondaryIndices: [],
                sortedIndices: sortedIndices,
                pseudocodeLine: 19,
                description: "Swapping \(array[rootIndex]) and \(array[largest]) to maintain heap property"
            ))

            array.swapAt(rootIndex, largest)

            // Recursively heapify the affected subtree
            heapify(&array, heapSize: heapSize, rootIndex: largest, steps: &steps, sortedIndices: &sortedIndices)
        }
    }
}
