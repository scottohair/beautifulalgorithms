import Foundation

struct LeftistHeapAlgorithm: AlgorithmExecutable {
    let id = "leftist-heap"
    let name = "Leftist Heap"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure merge(h1, h2)"),
        (1, "  if h1 is null then return h2"),
        (2, "  if h2 is null then return h1"),
        (3, "  if h1.key > h2.key then swap h1, h2"),
        (4, "  h1.right ← merge(h1.right, h2)"),
        (5, "  if rank(h1.left) < rank(h1.right)"),
        (6, "    swap h1.left and h1.right"),
        (7, "  h1.rank ← rank(h1.right) + 1"),
        (8, "  return h1"),
        (9, ""),
        (10, "procedure insert(heap, value)"),
        (11, "  node ← new LeftistNode(value)"),
        (12, "  heap ← merge(heap, node)"),
        (13, ""),
        (14, "procedure extractMin(heap)"),
        (15, "  min ← heap.key"),
        (16, "  heap ← merge(heap.left, heap.right)"),
        (17, "  return min")
    ]

    // MARK: - Internal Node

    private class LeftistNode {
        var key: Int
        var rank: Int  // s-value (null path length)
        var left: LeftistNode?
        var right: LeftistNode?

        init(key: Int) {
            self.key = key
            self.rank = 1
            self.left = nil
            self.right = nil
        }
    }

    // MARK: - Helpers

    private func nodeRank(_ node: LeftistNode?) -> Int {
        return node?.rank ?? 0
    }

    /// Merge two leftist heaps recursively
    private func merge(_ h1: LeftistNode?, _ h2: LeftistNode?) -> LeftistNode? {
        guard let h1 = h1 else { return h2 }
        guard let h2 = h2 else { return h1 }

        // Ensure h1 has the smaller key
        var a = h1
        var b = h2
        if a.key > b.key {
            let temp = a
            a = b
            b = temp
        }

        // Recursively merge right subtree with h2
        a.right = merge(a.right, b)

        // Maintain leftist property: rank(left) >= rank(right)
        if nodeRank(a.left) < nodeRank(a.right) {
            let temp = a.left
            a.left = a.right
            a.right = temp
        }

        // Update rank
        a.rank = nodeRank(a.right) + 1

        return a
    }

    /// Flatten tree to array via level-order (BFS) traversal
    private func flattenToArray(_ root: LeftistNode?) -> [Int] {
        guard let root = root else { return [] }
        var result: [Int] = []
        var queue: [LeftistNode] = [root]
        while !queue.isEmpty {
            let node = queue.removeFirst()
            result.append(node.key)
            if let left = node.left {
                queue.append(left)
            }
            if let right = node.right {
                queue.append(right)
            }
        }
        return result
    }

    // MARK: - Generate Steps

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root: LeftistNode? = nil

        let values = input.isEmpty ? [15, 22, 8, 36, 1, 29, 43] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Leftist Heap is empty. Will insert \(values.count) values."
        ))

        // Insert all values
        for value in values {
            let flat = flattenToArray(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Inserting \(value) into the leftist heap"
            ))

            // Create single-node heap
            let newNode = LeftistNode(key: value)

            steps.append(AlgorithmStep(
                type: .insert,
                array: flat + [value],
                highlightedIndices: [flat.count],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 11,
                description: "Created new node with key \(value), rank 1"
            ))

            // Merge
            root = merge(root, newNode)
            let newFlat = flattenToArray(root)

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: newFlat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Merged. Root = \(root?.key ?? -1), rank = \(root?.rank ?? 0). Heap: \(newFlat)"
            ))
        }

        // Peek at minimum
        if let r = root {
            let flat = flattenToArray(root)
            steps.append(AlgorithmStep(
                type: .select,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Minimum value is \(r.key) at the root"
            ))
        }

        // Extract min three times
        let extractCount = min(3, values.count)
        for i in 0..<extractCount {
            guard let r = root else { break }
            let flat = flattenToArray(root)
            let minVal = r.key

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Extract min #\(i + 1): root key is \(minVal)"
            ))

            // Merge left and right children
            let leftChild = r.left
            let rightChild = r.right

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: flat.count > 1 ? [1] : [],
                sortedIndices: [],
                pseudocodeLine: 16,
                description: "Merging left subtree (root=\(leftChild?.key.description ?? "nil")) with right subtree (root=\(rightChild?.key.description ?? "nil"))"
            ))

            root = merge(leftChild, rightChild)
            let newFlat = flattenToArray(root)

            steps.append(AlgorithmStep(
                type: .remove,
                array: newFlat,
                highlightedIndices: newFlat.isEmpty ? [] : [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 17,
                description: "Extracted \(minVal). New root = \(root?.key.description ?? "nil"). Heap: \(newFlat)"
            ))
        }

        let finalFlat = flattenToArray(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalFlat,
            highlightedIndices: Array(0..<finalFlat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalFlat.count),
            pseudocodeLine: 0,
            description: "Leftist Heap operations complete. Final heap: \(finalFlat)"
        ))

        return steps
    }
}
