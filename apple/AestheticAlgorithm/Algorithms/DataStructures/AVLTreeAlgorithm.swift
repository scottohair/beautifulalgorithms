import Foundation

struct AVLTreeAlgorithm: AlgorithmExecutable {
    let id = "avl-tree"
    let name = "AVL Tree"
    let category = "data-structures"
    let timeComplexity = (best: "O(log n)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(node, value)"),
        (1, "  if node is null then return new Node(value)"),
        (2, "  if value < node.value then"),
        (3, "    node.left ← insert(node.left, value)"),
        (4, "  else if value > node.value then"),
        (5, "    node.right ← insert(node.right, value)"),
        (6, "  else return node"),
        (7, ""),
        (8, "  node.height ← 1 + max(height(left), height(right))"),
        (9, "  balance ← getBalance(node)"),
        (10, ""),
        (11, "  // Left-Left case"),
        (12, "  if balance > 1 and value < node.left.value"),
        (13, "    return rightRotate(node)"),
        (14, "  // Right-Right case"),
        (15, "  if balance < -1 and value > node.right.value"),
        (16, "    return leftRotate(node)"),
        (17, "  // Left-Right case"),
        (18, "  if balance > 1 and value > node.left.value"),
        (19, "    node.left ← leftRotate(node.left)"),
        (20, "    return rightRotate(node)"),
        (21, "  // Right-Left case"),
        (22, "  if balance < -1 and value < node.right.value"),
        (23, "    node.right ← rightRotate(node.right)"),
        (24, "    return leftRotate(node)")
    ]

    // Internal AVL node with height tracking
    private class AVLNode {
        var value: Int
        var left: AVLNode?
        var right: AVLNode?
        var height: Int

        init(_ value: Int) {
            self.value = value
            self.height = 1
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root: AVLNode?

        let values = input.isEmpty ? [30, 20, 40, 10, 25, 35, 50, 5, 15] : Array(input)

        // Initial empty state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "AVL tree is empty. Beginning insertions."
        ))

        for value in values {
            let currentLevelOrder = levelOrderTraversal(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: currentLevelOrder,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting value \(value) into the AVL tree"
            ))

            root = insert(root, value: value, steps: &steps, treeRoot: root)

            let updatedLevelOrder = levelOrderTraversal(root)
            let insertedIndex = updatedLevelOrder.firstIndex(of: value) ?? 0
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedLevelOrder,
                highlightedIndices: [insertedIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "Inserted \(value). Tree balanced. Level order: \(updatedLevelOrder)"
            ))
        }

        // Final tree state
        let finalLevelOrder = levelOrderTraversal(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalLevelOrder,
            highlightedIndices: Array(0..<finalLevelOrder.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalLevelOrder.count),
            pseudocodeLine: 0,
            description: "AVL tree construction complete. Level order: \(finalLevelOrder)"
        ))

        return steps
    }

    // MARK: - AVL Insert with step generation

    private func insert(_ node: AVLNode?, value: Int, steps: inout [AlgorithmStep], treeRoot: AVLNode?) -> AVLNode {
        // Base case
        guard let node = node else {
            return AVLNode(value)
        }

        let currentLevelOrder = levelOrderTraversal(treeRoot)
        let currentIndex = currentLevelOrder.firstIndex(of: node.value) ?? 0

        if value < node.value {
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "\(value) < \(node.value) -- go left"
            ))

            steps.append(AlgorithmStep(
                type: .traverse,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "Traversing to left subtree of \(node.value)"
            ))

            node.left = insert(node.left, value: value, steps: &steps, treeRoot: treeRoot)
        } else if value > node.value {
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "\(value) > \(node.value) -- go right"
            ))

            steps.append(AlgorithmStep(
                type: .traverse,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Traversing to right subtree of \(node.value)"
            ))

            node.right = insert(node.right, value: value, steps: &steps, treeRoot: treeRoot)
        } else {
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentLevelOrder,
                highlightedIndices: [currentIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Value \(value) already exists. Skipping."
            ))
            return node
        }

        // Update height
        node.height = 1 + max(height(node.left), height(node.right))

        // Check balance
        let balance = getBalance(node)

        // Generate step showing balance check
        let afterLevelOrder = levelOrderTraversal(treeRoot)
        let nodeIndex = afterLevelOrder.firstIndex(of: node.value) ?? 0
        steps.append(AlgorithmStep(
            type: .highlight,
            array: afterLevelOrder,
            highlightedIndices: [nodeIndex],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: "Balance factor of \(node.value) is \(balance)"
        ))

        // Left-Left case
        if balance > 1 && value < (node.left?.value ?? 0) {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: afterLevelOrder,
                highlightedIndices: [nodeIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 13,
                description: "Left-Left case at \(node.value). Performing right rotation."
            ))
            return rightRotate(node)
        }

        // Right-Right case
        if balance < -1 && value > (node.right?.value ?? 0) {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: afterLevelOrder,
                highlightedIndices: [nodeIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 16,
                description: "Right-Right case at \(node.value). Performing left rotation."
            ))
            return leftRotate(node)
        }

        // Left-Right case
        if balance > 1 && value > (node.left?.value ?? 0) {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: afterLevelOrder,
                highlightedIndices: [nodeIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 19,
                description: "Left-Right case at \(node.value). Left rotate left child, then right rotate."
            ))
            node.left = leftRotate(node.left!)
            return rightRotate(node)
        }

        // Right-Left case
        if balance < -1 && value < (node.right?.value ?? 0) {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: afterLevelOrder,
                highlightedIndices: [nodeIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 23,
                description: "Right-Left case at \(node.value). Right rotate right child, then left rotate."
            ))
            node.right = rightRotate(node.right!)
            return leftRotate(node)
        }

        return node
    }

    // MARK: - AVL Rotations

    private func rightRotate(_ y: AVLNode) -> AVLNode {
        let x = y.left!
        let t2 = x.right

        x.right = y
        y.left = t2

        y.height = 1 + max(height(y.left), height(y.right))
        x.height = 1 + max(height(x.left), height(x.right))

        return x
    }

    private func leftRotate(_ x: AVLNode) -> AVLNode {
        let y = x.right!
        let t2 = y.left

        y.left = x
        x.right = t2

        x.height = 1 + max(height(x.left), height(x.right))
        y.height = 1 + max(height(y.left), height(y.right))

        return y
    }

    // MARK: - Helpers

    private func height(_ node: AVLNode?) -> Int {
        return node?.height ?? 0
    }

    private func getBalance(_ node: AVLNode?) -> Int {
        guard let node = node else { return 0 }
        return height(node.left) - height(node.right)
    }

    private func levelOrderTraversal(_ root: AVLNode?) -> [Int] {
        guard let root = root else { return [] }

        var result: [Int] = []
        var queue: [AVLNode] = [root]

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
