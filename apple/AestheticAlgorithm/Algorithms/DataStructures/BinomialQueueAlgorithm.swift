import Foundation

struct BinomialQueueAlgorithm: AlgorithmExecutable {
    let id = "binomial-queue"
    let name = "Binomial Queue"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(queue, value)"),
        (1, "  create single-node tree with value"),
        (2, "  queue ← merge(queue, singleNode)"),
        (3, ""),
        (4, "procedure merge(h1, h2)"),
        (5, "  combine root lists of h1 and h2"),
        (6, "  walk through roots in order of degree"),
        (7, "  if two trees have same degree"),
        (8, "    link smaller root under larger"),
        (9, "    degree ← degree + 1"),
        (10, ""),
        (11, "procedure extractMin(queue)"),
        (12, "  find root with minimum key"),
        (13, "  remove that tree from queue"),
        (14, "  reverse its children into new queue"),
        (15, "  queue ← merge(queue, childrenQueue)")
    ]

    // MARK: - Internal Node

    private class BinomialNode {
        var key: Int
        var degree: Int
        var children: [BinomialNode]
        var sibling: BinomialNode?

        init(key: Int) {
            self.key = key
            self.degree = 0
            self.children = []
            self.sibling = nil
        }
    }

    // MARK: - Helpers

    /// Link tree with larger root under tree with smaller root (both same degree)
    private func linkTrees(_ a: BinomialNode, _ b: BinomialNode) -> BinomialNode {
        if a.key <= b.key {
            a.children.append(b)
            a.degree += 1
            b.sibling = nil
            return a
        } else {
            b.children.append(a)
            b.degree += 1
            a.sibling = nil
            return b
        }
    }

    /// Merge two binomial queues (lists of root nodes sorted by degree)
    private func mergeQueues(_ q1: [BinomialNode], _ q2: [BinomialNode]) -> [BinomialNode] {
        // Combine and sort by degree
        var combined = q1 + q2
        combined.sort { $0.degree < $1.degree }

        if combined.count <= 1 { return combined }

        var result: [BinomialNode] = []
        var i = 0
        while i < combined.count {
            if i + 1 < combined.count && combined[i].degree == combined[i + 1].degree {
                let merged = linkTrees(combined[i], combined[i + 1])
                // Check if next also has same degree (carry propagation)
                if i + 2 < combined.count && combined[i + 2].degree == merged.degree {
                    // Put merged back to combine with next
                    combined[i + 2] = linkTrees(merged, combined[i + 2])
                    i += 2
                } else {
                    result.append(merged)
                    i += 2
                }
            } else {
                result.append(combined[i])
                i += 1
            }
        }
        return result
    }

    /// Flatten all binomial trees in the queue to an array via BFS
    private func flattenToArray(_ roots: [BinomialNode]) -> [Int] {
        var result: [Int] = []
        var queue: [BinomialNode] = roots
        while !queue.isEmpty {
            let node = queue.removeFirst()
            result.append(node.key)
            for child in node.children {
                queue.append(child)
            }
        }
        return result
    }

    /// Find index of root with minimum key
    private func findMinRootIndex(_ roots: [BinomialNode]) -> Int {
        guard !roots.isEmpty else { return -1 }
        var minIdx = 0
        for i in 1..<roots.count {
            if roots[i].key < roots[minIdx].key {
                minIdx = i
            }
        }
        return minIdx
    }

    // MARK: - Generate Steps

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var roots: [BinomialNode] = []

        let values = input.isEmpty ? [15, 22, 8, 36, 1, 29, 43, 50, 12] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Binomial Queue is empty. Will insert \(values.count) values."
        ))

        // Insert all values
        for value in values {
            let flat = flattenToArray(roots)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting \(value) into the binomial queue"
            ))

            // Create single-node tree
            let newNode = BinomialNode(key: value)

            steps.append(AlgorithmStep(
                type: .insert,
                array: flat + [value],
                highlightedIndices: [flat.count],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "Created single-node binomial tree with key \(value)"
            ))

            // Merge
            roots = mergeQueues(roots, [newNode])
            let newFlat = flattenToArray(roots)

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: newFlat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Merged into queue. Trees: \(roots.count), degrees: \(roots.map { $0.degree }). Queue: \(newFlat)"
            ))
        }

        // Extract min twice
        let extractCount = min(2, roots.count)
        for _ in 0..<extractCount {
            guard !roots.isEmpty else { break }

            let minIdx = findMinRootIndex(roots)
            let minVal = roots[minIdx].key
            let flat = flattenToArray(roots)

            steps.append(AlgorithmStep(
                type: .select,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Extract min: minimum root is \(minVal)"
            ))

            // Remove the min root
            let minRoot = roots.remove(at: minIdx)

            // Reverse children to form a new binomial queue
            let childrenQueue = minRoot.children.reversed().map { $0 }

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flattenToArray(roots),
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 14,
                description: "Removed \(minVal). Reversing its \(childrenQueue.count) children into a new queue."
            ))

            // Merge remaining roots with children queue
            roots = mergeQueues(roots, childrenQueue)
            let newFlat = flattenToArray(roots)

            steps.append(AlgorithmStep(
                type: .remove,
                array: newFlat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Extracted \(minVal). Merged children back. Queue: \(newFlat)"
            ))
        }

        let finalFlat = flattenToArray(roots)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalFlat,
            highlightedIndices: Array(0..<finalFlat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalFlat.count),
            pseudocodeLine: 0,
            description: "Binomial Queue operations complete. Final queue: \(finalFlat)"
        ))

        return steps
    }
}
