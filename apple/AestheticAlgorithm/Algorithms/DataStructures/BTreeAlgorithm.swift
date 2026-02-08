import Foundation

struct BTreeAlgorithm: AlgorithmExecutable {
    let id = "b-tree"
    let name = "B-Tree"
    let category = "data-structures"
    let timeComplexity = (best: "O(log n)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(tree, key)"),
        (1, "  if root is full then"),
        (2, "    newRoot ← new BTreeNode"),
        (3, "    newRoot.children[0] ← old root"),
        (4, "    splitChild(newRoot, 0)"),
        (5, "    tree.root ← newRoot"),
        (6, "  insertNonFull(root, key)"),
        (7, ""),
        (8, "procedure insertNonFull(node, key)"),
        (9, "  if node is leaf then"),
        (10, "    insert key into node.keys in order"),
        (11, "  else"),
        (12, "    find child index i for key"),
        (13, "    if child[i] is full then"),
        (14, "      splitChild(node, i)"),
        (15, "      recalculate i"),
        (16, "    insertNonFull(child[i], key)")
    ]

    // Order 3 B-tree (2-3 tree): max 2 keys, min 1 key (except root), max 3 children
    private static let order = 3
    private static let maxKeys = order - 1  // 2
    private static let minKeys = 1

    // MARK: - Internal BTreeNode

    private class BTreeNode {
        var keys: [Int] = []
        var children: [BTreeNode] = []
        var isLeaf: Bool = true

        init() {}
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root = BTreeNode()

        let values = input.isEmpty ? [10, 20, 5, 6, 12, 30, 7, 17, 3, 25] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "B-Tree (order 3) is empty. Beginning insertions."
        ))

        for value in values {
            let currentArray = flattenTree(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: currentArray,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting key \(value) into B-Tree"
            ))

            root = insert(root, key: value, steps: &steps)

            let updatedArray = flattenTree(root)
            let insertedIndex = updatedArray.firstIndex(of: value) ?? 0
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedArray,
                highlightedIndices: [insertedIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Inserted \(value). B-Tree keys: \(updatedArray)"
            ))
        }

        let finalArray = flattenTree(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalArray,
            highlightedIndices: Array(0..<finalArray.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalArray.count),
            pseudocodeLine: 0,
            description: "B-Tree construction complete. All keys: \(finalArray)"
        ))

        return steps
    }

    // MARK: - Insert

    private func insert(_ root: BTreeNode, key: Int, steps: inout [AlgorithmStep]) -> BTreeNode {
        var currentRoot = root

        if currentRoot.keys.count == BTreeAlgorithm.maxKeys {
            // Root is full, need to split
            let newRoot = BTreeNode()
            newRoot.isLeaf = false
            newRoot.children.append(currentRoot)

            let treeArray = flattenTree(newRoot)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: treeArray,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "Root is full. Creating new root and splitting."
            ))

            splitChild(newRoot, index: 0, steps: &steps)
            currentRoot = newRoot
        }

        insertNonFull(currentRoot, key: key, steps: &steps)
        return currentRoot
    }

    // MARK: - Insert Non-Full

    private func insertNonFull(_ node: BTreeNode, key: Int, steps: inout [AlgorithmStep]) {
        if node.isLeaf {
            // Insert key in sorted order
            var i = node.keys.count - 1
            node.keys.append(0) // make room

            while i >= 0 && key < node.keys[i] {
                node.keys[i + 1] = node.keys[i]
                i -= 1
            }
            node.keys[i + 1] = key

            steps.append(AlgorithmStep(
                type: .insert,
                array: node.keys,
                highlightedIndices: [i + 1],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Inserted \(key) into leaf node. Keys: \(node.keys)"
            ))
        } else {
            // Find the child to descend to
            var i = node.keys.count - 1
            while i >= 0 && key < node.keys[i] {
                i -= 1
            }
            i += 1

            steps.append(AlgorithmStep(
                type: .traverse,
                array: node.keys,
                highlightedIndices: i < node.keys.count ? [i] : [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Descending to child \(i) of node with keys \(node.keys)"
            ))

            if node.children[i].keys.count == BTreeAlgorithm.maxKeys {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: node.children[i].keys,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 13,
                    description: "Child \(i) is full. Splitting."
                ))

                splitChild(node, index: i, steps: &steps)

                if key > node.keys[i] {
                    i += 1
                }
            }

            insertNonFull(node.children[i], key: key, steps: &steps)
        }
    }

    // MARK: - Split Child

    private func splitChild(_ parent: BTreeNode, index: Int, steps: inout [AlgorithmStep]) {
        let fullChild = parent.children[index]
        let newChild = BTreeNode()
        newChild.isLeaf = fullChild.isLeaf

        // The median key moves up to the parent
        let medianIndex = BTreeAlgorithm.maxKeys / 2
        let medianKey = fullChild.keys[medianIndex]

        // Move keys after median to new child
        newChild.keys = Array(fullChild.keys[(medianIndex + 1)...])

        // Move children after median to new child (if not leaf)
        if !fullChild.isLeaf {
            newChild.children = Array(fullChild.children[(medianIndex + 1)...])
            fullChild.children = Array(fullChild.children[0...medianIndex])
        }

        // Truncate full child's keys
        fullChild.keys = Array(fullChild.keys[0..<medianIndex])

        // Insert median key into parent
        parent.keys.insert(medianKey, at: index)
        parent.children.insert(newChild, at: index + 1)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: parent.keys,
            highlightedIndices: [index],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: "Split: promoted \(medianKey) to parent. Parent keys: \(parent.keys)"
        ))
    }

    // MARK: - Flatten Tree (BFS of all keys)

    private func flattenTree(_ root: BTreeNode) -> [Int] {
        var result: [Int] = []
        var queue: [BTreeNode] = [root]

        while !queue.isEmpty {
            let node = queue.removeFirst()
            result.append(contentsOf: node.keys)

            for child in node.children {
                queue.append(child)
            }
        }

        return result
    }
}
