import Foundation

struct SkewHeapAlgorithm: AlgorithmExecutable {
    let id = "skew-heap"
    let name = "Skew Heap"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(log n) amortized", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure merge(h1, h2)"),
        (1, "  if h1 is null then return h2"),
        (2, "  if h2 is null then return h1"),
        (3, "  if h1.key > h2.key then swap h1, h2"),
        (4, "  h1.right ← merge(h1.right, h2)"),
        (5, "  swap h1.left and h1.right"),
        (6, "  return h1"),
        (7, ""),
        (8, "procedure insert(heap, value)"),
        (9, "  node ← new SkewNode(value)"),
        (10, "  heap ← merge(heap, node)"),
        (11, ""),
        (12, "procedure extractMin(heap)"),
        (13, "  min ← heap.key"),
        (14, "  heap ← merge(heap.left, heap.right)"),
        (15, "  return min")
    ]

    // MARK: - Internal Node

    private class SkewNode {
        var key: Int
        var left: SkewNode?
        var right: SkewNode?

        init(key: Int) {
            self.key = key
            self.left = nil
            self.right = nil
        }
    }

    // MARK: - Helpers

    /// Merge two skew heaps - always swap children (unconditional swap)
    private func merge(_ h1: SkewNode?, _ h2: SkewNode?) -> SkewNode? {
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

        // Recursively merge right subtree with b
        a.right = merge(a.right, b)

        // Unconditional swap of left and right children
        let temp = a.left
        a.left = a.right
        a.right = temp

        return a
    }

    /// Flatten tree to array via level-order (BFS) traversal
    private func flattenToArray(_ root: SkewNode?) -> [Int] {
        guard let root = root else { return [] }
        var result: [Int] = []
        var queue: [SkewNode] = [root]
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
        var root: SkewNode? = nil

        let values = input.isEmpty ? [15, 22, 8, 36, 1, 29, 43] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Skew Heap is empty. Will insert \(values.count) values."
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
                pseudocodeLine: 8,
                description: "Inserting \(value) into the skew heap"
            ))

            let newNode = SkewNode(key: value)

            steps.append(AlgorithmStep(
                type: .insert,
                array: flat + [value],
                highlightedIndices: [flat.count],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 9,
                description: "Created new node with key \(value)"
            ))

            // Merge with unconditional swap
            root = merge(root, newNode)
            let newFlat = flattenToArray(root)

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: newFlat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Merged with unconditional swap. Root = \(root?.key ?? -1). Heap: \(newFlat)"
            ))
        }

        // Build a second heap and merge them for demonstration
        if values.count >= 4 {
            let flat = flattenToArray(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Building a second skew heap to demonstrate merge operation"
            ))

            var secondRoot: SkewNode? = nil
            let secondValues = [5, 18, 33]
            for val in secondValues {
                secondRoot = merge(secondRoot, SkewNode(key: val))
            }
            let secondFlat = flattenToArray(secondRoot)

            steps.append(AlgorithmStep(
                type: .highlight,
                array: secondFlat,
                highlightedIndices: Array(0..<secondFlat.count),
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Second heap built with keys \(secondValues). Heap: \(secondFlat)"
            ))

            root = merge(root, secondRoot)
            let mergedFlat = flattenToArray(root)

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: mergedFlat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Two heaps merged. Root = \(root?.key ?? -1). Heap: \(mergedFlat)"
            ))
        }

        // Extract min three times
        let extractCount = min(3, values.count)
        for i in 0..<extractCount {
            guard let r = root else { break }
            let flat = flattenToArray(root)
            let minVal = r.key

            steps.append(AlgorithmStep(
                type: .select,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 13,
                description: "Extract min #\(i + 1): root key is \(minVal)"
            ))

            let leftChild = r.left
            let rightChild = r.right

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 14,
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
                pseudocodeLine: 15,
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
            description: "Skew Heap operations complete. Final heap: \(finalFlat)"
        ))

        return steps
    }
}
