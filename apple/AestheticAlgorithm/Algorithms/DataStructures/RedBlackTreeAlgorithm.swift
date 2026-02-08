import Foundation

struct RedBlackTreeAlgorithm: AlgorithmExecutable {
    let id = "red-black-tree"
    let name = "Red-Black Tree"
    let category = "data-structures"
    let timeComplexity = (best: "O(log n)", average: "O(log n)", worst: "O(log n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(tree, value)"),
        (1, "  node ← new RedNode(value)"),
        (2, "  BST-insert node into tree"),
        (3, "  fix-up(tree, node)"),
        (4, ""),
        (5, "procedure fix-up(tree, z)"),
        (6, "  while z.parent is RED"),
        (7, "    if z.parent is left child"),
        (8, "      uncle ← z.parent.parent.right"),
        (9, "      if uncle is RED then"),
        (10, "        recolor parent, uncle, grandparent"),
        (11, "        z ← grandparent"),
        (12, "      else"),
        (13, "        if z is right child"),
        (14, "          left-rotate(z.parent)"),
        (15, "        recolor and right-rotate(grandparent)"),
        (16, "    else (mirror cases)"),
        (17, "  tree.root.color ← BLACK")
    ]

    // MARK: - Internal RBNode

    private enum Color {
        case red, black
    }

    private class RBNode {
        var value: Int
        var color: Color
        var left: RBNode?
        var right: RBNode?
        weak var parent: RBNode?

        init(_ value: Int, color: Color = .red) {
            self.value = value
            self.color = color
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root: RBNode?

        let values = input.isEmpty ? [30, 20, 40, 10, 25, 35, 50, 5, 15] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Red-Black tree is empty. Beginning insertions."
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
                description: "Inserting value \(value) into the Red-Black tree"
            ))

            root = rbInsert(&root, value: value, steps: &steps)

            let updatedLevelOrder = levelOrderTraversal(root)
            let insertedIndex = updatedLevelOrder.firstIndex(of: value) ?? 0
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedLevelOrder,
                highlightedIndices: [insertedIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "Inserted \(value). Tree balanced. Level order: \(updatedLevelOrder)"
            ))
        }

        let finalLevelOrder = levelOrderTraversal(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalLevelOrder,
            highlightedIndices: Array(0..<finalLevelOrder.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalLevelOrder.count),
            pseudocodeLine: 0,
            description: "Red-Black tree construction complete. Level order: \(finalLevelOrder)"
        ))

        return steps
    }

    // MARK: - RB Insert

    private func rbInsert(_ root: inout RBNode?, value: Int, steps: inout [AlgorithmStep]) -> RBNode {
        let newNode = RBNode(value, color: .red)

        // Standard BST insert
        if root == nil {
            newNode.color = .black
            steps.append(AlgorithmStep(
                type: .insert,
                array: [value],
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "Insert \(value) as root (colored BLACK)"
            ))
            return newNode
        }

        var current = root
        var parent: RBNode?

        while let node = current {
            parent = node
            let currentLO = levelOrderTraversal(root)
            let nodeIdx = currentLO.firstIndex(of: node.value) ?? 0
            if value < node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: currentLO,
                    highlightedIndices: [nodeIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 2,
                    description: "\(value) < \(node.value) -- go left"
                ))
                current = node.left
            } else if value > node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: currentLO,
                    highlightedIndices: [nodeIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 2,
                    description: "\(value) > \(node.value) -- go right"
                ))
                current = node.right
            } else {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: currentLO,
                    highlightedIndices: [nodeIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 2,
                    description: "Value \(value) already exists. Skipping."
                ))
                return root!
            }
        }

        newNode.parent = parent
        if value < parent!.value {
            parent!.left = newNode
        } else {
            parent!.right = newNode
        }

        steps.append(AlgorithmStep(
            type: .insert,
            array: levelOrderTraversal(root),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "Inserted \(value) as RED node"
        ))

        // Fix-up
        fixInsert(&root, node: newNode, steps: &steps)

        return root!
    }

    private func fixInsert(_ root: inout RBNode?, node: RBNode, steps: inout [AlgorithmStep]) {
        var z = node

        while z.parent?.color == .red {
            let grandparent = z.parent!.parent!

            if z.parent === grandparent.left {
                let uncle = grandparent.right

                if uncle?.color == .red {
                    // Case 1: Uncle is red -- recolor
                    let lo = levelOrderTraversal(root)
                    let gpIdx = lo.firstIndex(of: grandparent.value) ?? 0
                    steps.append(AlgorithmStep(
                        type: .highlight,
                        array: lo,
                        highlightedIndices: [gpIdx],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 10,
                        description: "Uncle is RED. Recolor parent, uncle, grandparent(\(grandparent.value))"
                    ))

                    z.parent!.color = .black
                    uncle!.color = .black
                    grandparent.color = .red
                    z = grandparent
                } else {
                    if z === z.parent!.right {
                        // Case 2: z is right child -- left rotate
                        z = z.parent!
                        let lo = levelOrderTraversal(root)
                        let zIdx = lo.firstIndex(of: z.value) ?? 0
                        steps.append(AlgorithmStep(
                            type: .highlight,
                            array: lo,
                            highlightedIndices: [zIdx],
                            secondaryIndices: [],
                            sortedIndices: [],
                            pseudocodeLine: 14,
                            description: "Left-rotate at \(z.value)"
                        ))
                        leftRotate(&root, x: z)
                    }

                    // Case 3: z is left child -- recolor and right rotate
                    z.parent!.color = .black
                    grandparent.color = .red

                    let lo = levelOrderTraversal(root)
                    let gpIdx = lo.firstIndex(of: grandparent.value) ?? 0
                    steps.append(AlgorithmStep(
                        type: .highlight,
                        array: lo,
                        highlightedIndices: [gpIdx],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 15,
                        description: "Recolor and right-rotate at \(grandparent.value)"
                    ))
                    rightRotate(&root, y: grandparent)
                }
            } else {
                // Mirror cases: parent is right child of grandparent
                let uncle = grandparent.left

                if uncle?.color == .red {
                    let lo = levelOrderTraversal(root)
                    let gpIdx = lo.firstIndex(of: grandparent.value) ?? 0
                    steps.append(AlgorithmStep(
                        type: .highlight,
                        array: lo,
                        highlightedIndices: [gpIdx],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 10,
                        description: "Uncle is RED. Recolor parent, uncle, grandparent(\(grandparent.value))"
                    ))

                    z.parent!.color = .black
                    uncle!.color = .black
                    grandparent.color = .red
                    z = grandparent
                } else {
                    if z === z.parent!.left {
                        z = z.parent!
                        let lo = levelOrderTraversal(root)
                        let zIdx = lo.firstIndex(of: z.value) ?? 0
                        steps.append(AlgorithmStep(
                            type: .highlight,
                            array: lo,
                            highlightedIndices: [zIdx],
                            secondaryIndices: [],
                            sortedIndices: [],
                            pseudocodeLine: 16,
                            description: "Right-rotate at \(z.value) (mirror case)"
                        ))
                        rightRotate(&root, y: z)
                    }

                    z.parent!.color = .black
                    grandparent.color = .red

                    let lo = levelOrderTraversal(root)
                    let gpIdx = lo.firstIndex(of: grandparent.value) ?? 0
                    steps.append(AlgorithmStep(
                        type: .highlight,
                        array: lo,
                        highlightedIndices: [gpIdx],
                        secondaryIndices: [],
                        sortedIndices: [],
                        pseudocodeLine: 16,
                        description: "Recolor and left-rotate at \(grandparent.value) (mirror case)"
                    ))
                    leftRotate(&root, x: grandparent)
                }
            }
        }

        // Root must always be black
        root?.color = .black
        let lo = levelOrderTraversal(root)
        steps.append(AlgorithmStep(
            type: .highlight,
            array: lo,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 17,
            description: "Root colored BLACK. Fix-up complete."
        ))
    }

    // MARK: - Rotations

    private func leftRotate(_ root: inout RBNode?, x: RBNode) {
        guard let y = x.right else { return }
        x.right = y.left
        y.left?.parent = x
        y.parent = x.parent

        if x.parent == nil {
            root = y
        } else if x === x.parent!.left {
            x.parent!.left = y
        } else {
            x.parent!.right = y
        }
        y.left = x
        x.parent = y
    }

    private func rightRotate(_ root: inout RBNode?, y: RBNode) {
        guard let x = y.left else { return }
        y.left = x.right
        x.right?.parent = y
        x.parent = y.parent

        if y.parent == nil {
            root = x
        } else if y === y.parent!.left {
            y.parent!.left = x
        } else {
            y.parent!.right = x
        }
        x.right = y
        y.parent = x
    }

    // MARK: - Helpers

    private func levelOrderTraversal(_ root: RBNode?) -> [Int] {
        guard let root = root else { return [] }

        var result: [Int] = []
        var queue: [RBNode] = [root]

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
