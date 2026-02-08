import Foundation

struct BSTAlgorithm: AlgorithmExecutable {
    let id = "binary-search-tree"
    let name = "Binary Search Tree"
    let category = "data-structures"
    let timeComplexity = (best: "O(log n)", average: "O(log n)", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(root, value)"),
        (1, "  if root is null then"),
        (2, "    return new Node(value)"),
        (3, "  if value < root.value then"),
        (4, "    root.left ← insert(root.left, value)"),
        (5, "  else if value > root.value then"),
        (6, "    root.right ← insert(root.right, value)"),
        (7, "  return root"),
        (8, ""),
        (9, "procedure levelOrder(root)"),
        (10, "  queue ← [root]"),
        (11, "  while queue is not empty do"),
        (12, "    node ← dequeue(queue)"),
        (13, "    visit(node)"),
        (14, "    if node.left ≠ null then enqueue(node.left)"),
        (15, "    if node.right ≠ null then enqueue(node.right)")
    ]

    // Internal BST node for building the tree
    private class BSTNode {
        let value: Int
        var left: BSTNode?
        var right: BSTNode?

        init(_ value: Int) {
            self.value = value
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root: BSTNode?

        // Initial empty tree state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "BST is empty. Beginning insertions."
        ))

        for value in input {
            // Show what value we are about to insert
            let currentLevelOrder = levelOrderTraversal(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: currentLevelOrder,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting value \(value) into the BST"
            ))

            // Perform the insertion, generating traversal steps along the way
            root = insert(into: root, value: value, steps: &steps, root: root)

            // Show final tree state after insertion
            let updatedLevelOrder = levelOrderTraversal(root)
            let insertedIndex = updatedLevelOrder.firstIndex(of: value) ?? 0
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedLevelOrder,
                highlightedIndices: [insertedIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Inserted \(value) into the BST"
            ))
        }

        // Final complete tree
        let finalLevelOrder = levelOrderTraversal(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalLevelOrder,
            highlightedIndices: Array(0..<finalLevelOrder.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalLevelOrder.count),
            pseudocodeLine: 7,
            description: "BST construction complete. Level-order: \(finalLevelOrder)"
        ))

        return steps
    }

    /// Insert a value into the BST, generating comparison and traversal steps
    private func insert(into node: BSTNode?, value: Int, steps: inout [AlgorithmStep], root: BSTNode?) -> BSTNode {
        guard let node = node else {
            // Base case: null node, insert here
            return BSTNode(value)
        }

        let currentLevelOrder = levelOrderTraversal(root)
        let currentIndex = currentLevelOrder.firstIndex(of: node.value) ?? 0

        if value < node.value {
            // Compare: value < current node
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "Comparing \(value) < \(node.value) — true, go left"
            ))

            // Traverse left
            steps.append(AlgorithmStep(
                type: .traverse,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "Traversing to left subtree of \(node.value)"
            ))

            node.left = insert(into: node.left, value: value, steps: &steps, root: root)
        } else if value > node.value {
            // Compare: value > current node
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Comparing \(value) > \(node.value) — true, go right"
            ))

            // Traverse right
            steps.append(AlgorithmStep(
                type: .traverse,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Traversing to right subtree of \(node.value)"
            ))

            node.right = insert(into: node.right, value: value, steps: &steps, root: root)
        } else {
            // Duplicate value: no insertion
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Value \(value) already exists at node \(node.value). Skipping."
            ))
        }

        return node
    }

    /// Produce a level-order (BFS) traversal of the tree as an array
    private func levelOrderTraversal(_ root: BSTNode?) -> [Int] {
        guard let root = root else { return [] }

        var result: [Int] = []
        var queue: [BSTNode] = [root]

        while !queue.isEmpty {
            let node = queue.removeFirst()
            result.append(node.value)

            if let left = node.left {
                queue.append(left)
            }
            if let right = node.right {
                queue.append(right)
            }
        }

        return result
    }
}
