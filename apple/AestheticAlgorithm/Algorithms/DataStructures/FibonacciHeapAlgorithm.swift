import Foundation

struct FibonacciHeapAlgorithm: AlgorithmExecutable {
    let id = "fibonacci-heap"
    let name = "Fibonacci Heap"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(1) amortized", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(heap, value)"),
        (1, "  create new node with key = value"),
        (2, "  add node to root list"),
        (3, "  update min pointer if needed"),
        (4, ""),
        (5, "procedure extractMin(heap)"),
        (6, "  z ← min node"),
        (7, "  add z's children to root list"),
        (8, "  remove z from root list"),
        (9, "  consolidate trees by degree"),
        (10, "  update min pointer"),
        (11, ""),
        (12, "procedure decreaseKey(heap, node, newKey)"),
        (13, "  node.key ← newKey"),
        (14, "  if node.key < parent.key"),
        (15, "    cut node, add to root list"),
        (16, "    cascadingCut(parent)"),
        (17, ""),
        (18, "procedure consolidate(heap)"),
        (19, "  for each node in root list"),
        (20, "    while degree[d] exists"),
        (21, "      link trees of same degree"),
        (22, "      d ← d + 1")
    ]

    // MARK: - Internal Node

    private class FibNode {
        var key: Int
        var degree: Int
        var marked: Bool
        var child: FibNode?
        var parent: FibNode?
        // Doubly-linked circular sibling list
        var left: FibNode?
        var right: FibNode?

        init(key: Int) {
            self.key = key
            self.degree = 0
            self.marked = false
            self.child = nil
            self.parent = nil
            self.left = nil
            self.right = nil
        }
    }

    // MARK: - Fibonacci Heap Structure

    private class FibHeap {
        var min: FibNode?
        var count: Int = 0
        var rootList: [FibNode] = [] // Simplified: use array for root list

        func insert(_ key: Int) -> FibNode {
            let node = FibNode(key: key)
            rootList.append(node)
            if min == nil || key < min!.key {
                min = node
            }
            count += 1
            return node
        }

        func extractMin() -> Int? {
            guard let z = min else { return nil }
            let minKey = z.key

            // Add children of z to root list
            let children = getChildren(z)
            for child in children {
                child.parent = nil
                child.marked = false
                rootList.append(child)
            }

            // Remove z from root list
            rootList.removeAll { $0 === z }
            count -= 1

            if rootList.isEmpty {
                min = nil
            } else {
                consolidate()
                // Update min
                min = rootList.min(by: { $0.key < $1.key })
            }

            return minKey
        }

        func decreaseKey(_ node: FibNode, to newKey: Int) {
            guard newKey < node.key else { return }
            node.key = newKey

            if let parent = node.parent, node.key < parent.key {
                cut(node, from: parent)
                cascadingCut(parent)
            }

            if let m = min, node.key < m.key {
                min = node
            }
        }

        private func cut(_ node: FibNode, from parent: FibNode) {
            // Remove node from parent's children
            let children = getChildren(parent)
            parent.child = nil
            parent.degree = 0
            for child in children where child !== node {
                addChild(parent, child: child)
            }
            node.parent = nil
            node.marked = false
            rootList.append(node)
        }

        private func cascadingCut(_ node: FibNode) {
            guard let parent = node.parent else { return }
            if !node.marked {
                node.marked = true
            } else {
                cut(node, from: parent)
                cascadingCut(parent)
            }
        }

        private func consolidate() {
            let maxDegree = Int(log2(Double(max(count, 1)))) + 2
            var degreeTable = [Int: FibNode]()

            let currentRoots = rootList
            rootList = []

            for node in currentRoots {
                var x = node
                x.parent = nil
                var d = x.degree

                while let y = degreeTable[d] {
                    degreeTable.removeValue(forKey: d)
                    // Link: smaller key becomes parent
                    if x.key > y.key {
                        let temp = x
                        x = y
                        y.parent = nil
                        addChild(x, child: temp)
                    } else {
                        addChild(x, child: y)
                    }
                    d += 1
                    x.degree = d
                }
                degreeTable[d] = x
            }

            for (_, node) in degreeTable {
                rootList.append(node)
            }
        }

        private func addChild(_ parent: FibNode, child: FibNode) {
            child.parent = parent
            let existing = getChildren(parent)
            parent.child = child
            child.left = nil
            child.right = nil

            // Simple linked list via right pointers
            if !existing.isEmpty {
                child.right = existing.first
            }
            parent.degree = existing.count + 1
        }

        func getChildren(_ node: FibNode) -> [FibNode] {
            var children: [FibNode] = []
            var current = node.child
            var visited = Set<ObjectIdentifier>()
            while let c = current, !visited.contains(ObjectIdentifier(c)) {
                visited.insert(ObjectIdentifier(c))
                children.append(c)
                current = c.right
            }
            return children
        }

        /// Flatten heap to array via BFS over root list and then their children
        func flatten() -> [Int] {
            var result: [Int] = []
            var queue: [FibNode] = rootList
            while !queue.isEmpty {
                let node = queue.removeFirst()
                result.append(node.key)
                let children = getChildren(node)
                queue.append(contentsOf: children)
            }
            return result
        }
    }

    // MARK: - Generate Steps

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        let heap = FibHeap()

        let values = input.isEmpty ? [15, 22, 8, 36, 1, 29, 43, 50, 12] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Fibonacci Heap is empty. Will insert \(values.count) values."
        ))

        // Track inserted nodes for decreaseKey demo
        var insertedNodes: [FibNode] = []

        // Insert all values (lazy insert)
        for value in values {
            let flat = heap.flatten()
            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting \(value) into the Fibonacci heap"
            ))

            let node = heap.insert(value)
            insertedNodes.append(node)
            let newFlat = heap.flatten()

            steps.append(AlgorithmStep(
                type: .insert,
                array: newFlat,
                highlightedIndices: [newFlat.count - 1],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Added \(value) to root list. Min = \(heap.min?.key ?? -1). Heap: \(newFlat)"
            ))
        }

        // Extract min twice
        for i in 0..<2 {
            let flat = heap.flatten()
            guard !flat.isEmpty else { break }

            let minVal = heap.min?.key ?? -1
            steps.append(AlgorithmStep(
                type: .select,
                array: flat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Extract min #\(i + 1): minimum is \(minVal)"
            ))

            if let extracted = heap.extractMin() {
                let afterFlat = heap.flatten()

                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: afterFlat,
                    highlightedIndices: afterFlat.isEmpty ? [] : [0],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 9,
                    description: "Consolidating trees after extracting \(extracted). Root list has \(heap.rootList.count) trees."
                ))

                steps.append(AlgorithmStep(
                    type: .remove,
                    array: afterFlat,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "Extracted \(extracted). New min = \(heap.min?.key ?? -1). Heap: \(afterFlat)"
                ))
            }
        }

        // Decrease key demo: find a node with a large key still in the heap
        let validNodes = insertedNodes.filter { node in
            heap.flatten().contains(node.key)
        }
        if let target = validNodes.last, target.key > 2 {
            let oldKey = target.key
            let newKey = 2
            let flat = heap.flatten()

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Decrease key: changing \(oldKey) to \(newKey)"
            ))

            heap.decreaseKey(target, to: newKey)
            let afterFlat = heap.flatten()

            steps.append(AlgorithmStep(
                type: .swap,
                array: afterFlat,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Decreased key from \(oldKey) to \(newKey). Cut if needed. Min = \(heap.min?.key ?? -1). Heap: \(afterFlat)"
            ))
        }

        let finalFlat = heap.flatten()
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalFlat,
            highlightedIndices: Array(0..<finalFlat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalFlat.count),
            pseudocodeLine: 0,
            description: "Fibonacci Heap operations complete. Final heap: \(finalFlat)"
        ))

        return steps
    }
}
