import Foundation

struct QueueAlgorithm: AlgorithmExecutable {
    let id = "queue"
    let name = "Queue"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(1)", worst: "O(1)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure enqueue(Q: queue, value)"),
        (1, "  Q.rear ← Q.rear + 1"),
        (2, "  Q[Q.rear] ← value"),
        (3, ""),
        (4, "procedure dequeue(Q: queue)"),
        (5, "  if isEmpty(Q) then error"),
        (6, "  value ← Q[Q.front]"),
        (7, "  Q.front ← Q.front + 1"),
        (8, "  return value"),
        (9, ""),
        (10, "procedure peek(Q: queue)"),
        (11, "  if isEmpty(Q) then error"),
        (12, "  return Q[Q.front]")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var queue: [Int] = []

        // Initial empty queue state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: queue,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Queue is empty. Beginning operations."
        ))

        // Phase 1: Enqueue all input values
        for value in input {
            queue.append(value)
            let rearIndex = queue.count - 1

            steps.append(AlgorithmStep(
                type: .insert,
                array: queue,
                highlightedIndices: [rearIndex],
                secondaryIndices: queue.count > 1 ? [0] : [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Enqueue \(value) at the rear (index \(rearIndex)). Front is \(queue[0])."
            ))
        }

        // Phase 2: Peek at the front element
        if !queue.isEmpty {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: queue,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Peek: front element is \(queue[0]) at index 0"
            ))
        }

        // Phase 3: Dequeue elements from the front (FIFO order)
        let dequeueCount = min(queue.count, input.count)
        for _ in 0..<dequeueCount {
            guard !queue.isEmpty else { break }

            let dequeuedValue = queue[0]

            // Show which element will be dequeued
            steps.append(AlgorithmStep(
                type: .highlight,
                array: queue,
                highlightedIndices: [0],
                secondaryIndices: queue.count > 1 ? [queue.count - 1] : [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Accessing front element: \(dequeuedValue) at index 0"
            ))

            // Remove the front element
            queue.removeFirst()
            steps.append(AlgorithmStep(
                type: .remove,
                array: queue,
                highlightedIndices: queue.isEmpty ? [] : [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 7,
                description: "Dequeue \(dequeuedValue) from the front. \(queue.isEmpty ? "Queue is now empty." : "New front is \(queue[0]).")"
            ))
        }

        // Final state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: queue,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "All operations complete. Queue is \(queue.isEmpty ? "empty" : "not empty with \(queue.count) element(s)")."
        ))

        return steps
    }
}
