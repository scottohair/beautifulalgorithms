import Foundation

struct HuffmanCodingAlgorithm: AlgorithmExecutable {
    let id = "huffman-coding"
    let name = "Huffman Coding"
    let category = "data-structures"
    let timeComplexity = (best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure buildHuffmanTree(frequencies)"),
        (1, "  create leaf node for each symbol"),
        (2, "  insert all nodes into priority queue"),
        (3, "  while queue.size > 1"),
        (4, "    left ← extractMin(queue)"),
        (5, "    right ← extractMin(queue)"),
        (6, "    internal ← new Node(left.freq + right.freq)"),
        (7, "    internal.left ← left"),
        (8, "    internal.right ← right"),
        (9, "    insert(queue, internal)"),
        (10, "  return queue.extractMin()"),
        (11, ""),
        (12, "procedure generateCodes(node, prefix)"),
        (13, "  if node is leaf"),
        (14, "    codes[node.symbol] ← prefix"),
        (15, "  generateCodes(node.left, prefix + \"0\")"),
        (16, "  generateCodes(node.right, prefix + \"1\")")
    ]

    // MARK: - Internal Node

    private class HuffmanNode: Comparable {
        let frequency: Int
        let symbol: String?  // nil for internal nodes
        var left: HuffmanNode?
        var right: HuffmanNode?

        init(frequency: Int, symbol: String?) {
            self.frequency = frequency
            self.symbol = symbol
            self.left = nil
            self.right = nil
        }

        static func < (lhs: HuffmanNode, rhs: HuffmanNode) -> Bool {
            return lhs.frequency < rhs.frequency
        }

        static func == (lhs: HuffmanNode, rhs: HuffmanNode) -> Bool {
            return lhs.frequency == rhs.frequency && lhs.symbol == rhs.symbol
        }
    }

    // MARK: - Priority Queue (Array-based min-heap)

    private struct PriorityQueue {
        var nodes: [HuffmanNode] = []

        var count: Int { nodes.count }

        mutating func insert(_ node: HuffmanNode) {
            nodes.append(node)
            var i = nodes.count - 1
            while i > 0 {
                let parent = (i - 1) / 2
                if nodes[i].frequency < nodes[parent].frequency {
                    nodes.swapAt(i, parent)
                    i = parent
                } else {
                    break
                }
            }
        }

        mutating func extractMin() -> HuffmanNode? {
            guard !nodes.isEmpty else { return nil }
            if nodes.count == 1 { return nodes.removeLast() }

            let min = nodes[0]
            nodes[0] = nodes.removeLast()
            var i = 0
            while true {
                let left = 2 * i + 1
                let right = 2 * i + 2
                var smallest = i
                if left < nodes.count && nodes[left].frequency < nodes[smallest].frequency {
                    smallest = left
                }
                if right < nodes.count && nodes[right].frequency < nodes[smallest].frequency {
                    smallest = right
                }
                if smallest != i {
                    nodes.swapAt(i, smallest)
                    i = smallest
                } else {
                    break
                }
            }
            return min
        }

        func frequencies() -> [Int] {
            return nodes.map { $0.frequency }
        }
    }

    // MARK: - Helpers

    /// Flatten Huffman tree to array via level-order (BFS) traversal
    private func flattenToArray(_ root: HuffmanNode?) -> [Int] {
        guard let root = root else { return [] }
        var result: [Int] = []
        var queue: [HuffmanNode] = [root]
        while !queue.isEmpty {
            let node = queue.removeFirst()
            result.append(node.frequency)
            if let left = node.left {
                queue.append(left)
            }
            if let right = node.right {
                queue.append(right)
            }
        }
        return result
    }

    /// Generate Huffman codes via DFS traversal
    private func generateCodes(_ node: HuffmanNode?, prefix: String, codes: inout [(symbol: String, code: String)]) {
        guard let node = node else { return }
        if let symbol = node.symbol {
            codes.append((symbol: symbol, code: prefix.isEmpty ? "0" : prefix))
            return
        }
        generateCodes(node.left, prefix: prefix + "0", codes: &codes)
        generateCodes(node.right, prefix: prefix + "1", codes: &codes)
    }

    // MARK: - Generate Steps

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let values = input.isEmpty ? [5, 9, 12, 13, 16, 45] : Array(input)
        let symbolNames = (0..<values.count).map { String(UnicodeScalar(65 + $0)!) } // A, B, C, ...

        steps.append(AlgorithmStep(
            type: .highlight,
            array: values,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Huffman Coding: building tree from \(values.count) symbols with frequencies \(values)"
        ))

        // Create leaf nodes and insert into priority queue
        var pq = PriorityQueue()
        for i in 0..<values.count {
            let leaf = HuffmanNode(frequency: values[i], symbol: symbolNames[i])
            pq.insert(leaf)

            steps.append(AlgorithmStep(
                type: .insert,
                array: pq.frequencies(),
                highlightedIndices: [pq.count - 1],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Inserted leaf '\(symbolNames[i])' with frequency \(values[i]) into priority queue. Queue: \(pq.frequencies())"
            ))
        }

        steps.append(AlgorithmStep(
            type: .passComplete,
            array: pq.frequencies(),
            highlightedIndices: Array(0..<pq.count),
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "All \(values.count) leaf nodes in priority queue. Ready to build Huffman tree."
        ))

        // Build the Huffman tree
        var iteration = 0
        while pq.count > 1 {
            iteration += 1
            let qFreqs = pq.frequencies()

            steps.append(AlgorithmStep(
                type: .highlight,
                array: qFreqs,
                highlightedIndices: qFreqs.count >= 2 ? [0] : [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "Iteration \(iteration): queue has \(pq.count) nodes. Extracting two minimum nodes."
            ))

            guard let left = pq.extractMin() else { break }
            let afterFirstExtract = pq.frequencies()

            steps.append(AlgorithmStep(
                type: .remove,
                array: afterFirstExtract,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "Extracted left child: \(left.symbol ?? "internal") (freq=\(left.frequency)). Queue: \(afterFirstExtract)"
            ))

            guard let right = pq.extractMin() else {
                pq.insert(left)
                break
            }
            let afterSecondExtract = pq.frequencies()

            steps.append(AlgorithmStep(
                type: .remove,
                array: afterSecondExtract,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Extracted right child: \(right.symbol ?? "internal") (freq=\(right.frequency)). Queue: \(afterSecondExtract)"
            ))

            // Create internal node
            let combined = left.frequency + right.frequency
            let internal_node = HuffmanNode(frequency: combined, symbol: nil)
            internal_node.left = left
            internal_node.right = right

            steps.append(AlgorithmStep(
                type: .highlight,
                array: afterSecondExtract + [combined],
                highlightedIndices: [afterSecondExtract.count],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Created internal node: freq = \(left.frequency) + \(right.frequency) = \(combined)"
            ))

            pq.insert(internal_node)
            let newQFreqs = pq.frequencies()

            steps.append(AlgorithmStep(
                type: .insert,
                array: newQFreqs,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 9,
                description: "Inserted internal node (freq=\(combined)) back into queue. Queue: \(newQFreqs)"
            ))
        }

        // Extract the root
        let root = pq.extractMin()
        let treeFlat = flattenToArray(root)

        steps.append(AlgorithmStep(
            type: .passComplete,
            array: treeFlat,
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 10,
            description: "Huffman tree complete. Root frequency = \(root?.frequency ?? 0). Tree (level-order): \(treeFlat)"
        ))

        // Generate codes
        var codes: [(symbol: String, code: String)] = []
        generateCodes(root, prefix: "", codes: &codes)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: treeFlat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 12,
            description: "Traversing tree to generate Huffman codes..."
        ))

        for (i, entry) in codes.enumerated() {
            let highlightIdx = min(i, treeFlat.count - 1)
            steps.append(AlgorithmStep(
                type: .traverse,
                array: treeFlat,
                highlightedIndices: highlightIdx >= 0 ? [highlightIdx] : [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 14,
                description: "Symbol '\(entry.symbol)': code = \(entry.code) (length \(entry.code.count))"
            ))
        }

        let codesSummary = codes.map { "'\($0.symbol)'=\($0.code)" }.joined(separator: ", ")

        steps.append(AlgorithmStep(
            type: .sorted,
            array: treeFlat,
            highlightedIndices: Array(0..<treeFlat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<treeFlat.count),
            pseudocodeLine: 0,
            description: "Huffman Coding complete. Codes: \(codesSummary)"
        ))

        return steps
    }
}
