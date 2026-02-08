import Foundation

struct MinHeapAlgorithm: AlgorithmExecutable {
    let id = "min-heap"
    let name = "Min Heap"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(heap, value)"),
        (1, "  heap.append(value)"),
        (2, "  i ← heap.size - 1"),
        (3, "  while i > 0 and heap[i] < heap[parent(i)]"),
        (4, "    swap heap[i] and heap[parent(i)]"),
        (5, "    i ← parent(i)"),
        (6, ""),
        (7, "procedure extractMin(heap)"),
        (8, "  min ← heap[0]"),
        (9, "  heap[0] ← heap[last]"),
        (10, "  remove last element"),
        (11, "  bubbleDown(0)"),
        (12, ""),
        (13, "procedure bubbleDown(heap, i)"),
        (14, "  smallest ← i"),
        (15, "  if left < size and heap[left] < heap[smallest]"),
        (16, "    smallest ← left"),
        (17, "  if right < size and heap[right] < heap[smallest]"),
        (18, "    smallest ← right"),
        (19, "  if smallest ≠ i then"),
        (20, "    swap heap[i] and heap[smallest]"),
        (21, "    bubbleDown(smallest)")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var heap: [Int] = []

        let values = input.isEmpty ? [35, 20, 50, 10, 25, 40, 5, 30, 15, 45] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Min Heap is empty. Will insert \(values.count) values."
        ))

        // Insert all values
        for value in values {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: heap,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting \(value) into the min heap"
            ))

            // Append value
            heap.append(value)
            var i = heap.count - 1

            steps.append(AlgorithmStep(
                type: .insert,
                array: heap,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "Appended \(value) at index \(i). Heap: \(heap)"
            ))

            // Bubble up
            while i > 0 {
                let parentIdx = (i - 1) / 2

                steps.append(AlgorithmStep(
                    type: .compare,
                    array: heap,
                    highlightedIndices: [i],
                    secondaryIndices: [parentIdx],
                    sortedIndices: [],
                    pseudocodeLine: 3,
                    description: "Compare heap[\(i)]=\(heap[i]) with parent heap[\(parentIdx)]=\(heap[parentIdx])"
                ))

                if heap[i] < heap[parentIdx] {
                    heap.swapAt(i, parentIdx)

                    steps.append(AlgorithmStep(
                        type: .swap,
                        array: heap,
                        highlightedIndices: [parentIdx],
                        secondaryIndices: [i],
                        sortedIndices: [],
                        pseudocodeLine: 4,
                        description: "Swap heap[\(i)] and heap[\(parentIdx)]. Heap: \(heap)"
                    ))

                    i = parentIdx
                } else {
                    break
                }
            }

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: heap,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Insert complete. \(value) is at index \(i). Heap: \(heap)"
            ))
        }

        // Peek at the minimum
        if !heap.isEmpty {
            steps.append(AlgorithmStep(
                type: .select,
                array: heap,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "Peek: minimum value is \(heap[0]) at index 0"
            ))
        }

        // Extract min several times
        let extractCount = min(3, heap.count)
        for _ in 0..<extractCount {
            guard heap.count > 0 else { break }

            let minVal = heap[0]
            steps.append(AlgorithmStep(
                type: .highlight,
                array: heap,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "Extract min: \(minVal)"
            ))

            // Move last to root
            let lastVal = heap[heap.count - 1]
            heap[0] = lastVal
            heap.removeLast()

            if heap.isEmpty {
                steps.append(AlgorithmStep(
                    type: .remove,
                    array: heap,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "Extracted \(minVal). Heap is now empty."
                ))
                continue
            }

            steps.append(AlgorithmStep(
                type: .swap,
                array: heap,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 9,
                description: "Moved \(lastVal) to root. Bubble down. Heap: \(heap)"
            ))

            // Bubble down
            var i = 0
            while true {
                let left = 2 * i + 1
                let right = 2 * i + 2
                var smallest = i

                if left < heap.count {
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: heap,
                        highlightedIndices: [smallest],
                        secondaryIndices: [left],
                        sortedIndices: [],
                        pseudocodeLine: 15,
                        description: "Compare heap[\(smallest)]=\(heap[smallest]) with left child heap[\(left)]=\(heap[left])"
                    ))
                    if heap[left] < heap[smallest] {
                        smallest = left
                    }
                }

                if right < heap.count {
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: heap,
                        highlightedIndices: [smallest],
                        secondaryIndices: [right],
                        sortedIndices: [],
                        pseudocodeLine: 17,
                        description: "Compare heap[\(smallest)]=\(heap[smallest]) with right child heap[\(right)]=\(heap[right])"
                    ))
                    if heap[right] < heap[smallest] {
                        smallest = right
                    }
                }

                if smallest != i {
                    heap.swapAt(i, smallest)

                    steps.append(AlgorithmStep(
                        type: .swap,
                        array: heap,
                        highlightedIndices: [smallest],
                        secondaryIndices: [i],
                        sortedIndices: [],
                        pseudocodeLine: 20,
                        description: "Swap heap[\(i)] and heap[\(smallest)]. Heap: \(heap)"
                    ))

                    i = smallest
                } else {
                    break
                }
            }

            steps.append(AlgorithmStep(
                type: .remove,
                array: heap,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 11,
                description: "Extracted \(minVal). Heap after bubble-down: \(heap)"
            ))
        }

        steps.append(AlgorithmStep(
            type: .sorted,
            array: heap,
            highlightedIndices: Array(0..<heap.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<heap.count),
            pseudocodeLine: 0,
            description: "Min Heap operations complete. Final heap: \(heap)"
        ))

        return steps
    }
}
