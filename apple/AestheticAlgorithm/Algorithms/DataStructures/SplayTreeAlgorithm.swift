import Foundation

struct SplayTreeAlgorithm: AlgorithmExecutable {
    let id = "splay-tree"
    let name = "Splay Tree"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(log n)", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure splay(tree, node)"),
        (1, "  while node is not root"),
        (2, "    if node.parent is root"),
        (3, "      zig(node)              // single rotation"),
        (4, "    else if zig-zig case"),
        (5, "      rotate parent, then node  // same direction"),
        (6, "    else  // zig-zag case"),
        (7, "      rotate node twice         // opposite directions"),
        (8, ""),
        (9, "procedure insert(tree, value)"),
        (10, "  BST-insert value"),
        (11, "  splay(tree, new node)"),
        (12, ""),
        (13, "procedure search(tree, value)"),
        (14, "  node ← BST-search(value)"),
        (15, "  if node found then splay(tree, node)")
    ]

    // MARK: - Internal SplayNode

    private class SplayNode {
        var value: Int
        var left: SplayNode?
        var right: SplayNode?
        weak var parent: SplayNode?

        init(_ value: Int) {
            self.value = value
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var root: SplayNode?

        let values = input.isEmpty ? [30, 20, 40, 10, 25, 35, 50, 5, 15] : Array(input)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: "Splay tree is empty. Beginning insertions."
        ))

        for value in values {
            let currentLO = levelOrderTraversal(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: currentLO,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 9,
                description: "Inserting value \(value) into the Splay tree"
            ))

            root = insert(root, value: value, steps: &steps)

            let updatedLO = levelOrderTraversal(root)
            let insertedIndex = updatedLO.firstIndex(of: value) ?? 0
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedLO,
                highlightedIndices: [insertedIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 11,
                description: "Inserted and splayed \(value) to root. Level order: \(updatedLO)"
            ))
        }

        // Demonstrate search by searching for a few values
        let searchValues = values.count >= 3
            ? [values[values.count / 2], values[0]]
            : values
        for sv in searchValues {
            let lo = levelOrderTraversal(root)
            steps.append(AlgorithmStep(
                type: .highlight,
                array: lo,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 13,
                description: "Searching for value \(sv)"
            ))

            root = search(root, value: sv, steps: &steps)

            let afterLO = levelOrderTraversal(root)
            steps.append(AlgorithmStep(
                type: .select,
                array: afterLO,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Found \(sv). Splayed to root. Level order: \(afterLO)"
            ))
        }

        let finalLO = levelOrderTraversal(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalLO,
            highlightedIndices: Array(0..<finalLO.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalLO.count),
            pseudocodeLine: 0,
            description: "Splay tree operations complete. Level order: \(finalLO)"
        ))

        return steps
    }

    // MARK: - Insert

    private func insert(_ root: SplayNode?, value: Int, steps: inout [AlgorithmStep]) -> SplayNode? {
        guard let root = root else {
            return SplayNode(value)
        }

        var current: SplayNode? = root
        var parent: SplayNode?

        while let node = current {
            parent = node
            let lo = levelOrderTraversal(root)
            let idx = lo.firstIndex(of: node.value) ?? 0
            if value < node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: lo,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "\(value) < \(node.value) -- go left"
                ))
                current = node.left
            } else if value > node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: lo,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "\(value) > \(node.value) -- go right"
                ))
                current = node.right
            } else {
                // Duplicate -- splay the existing node
                return splay(root, node: node, steps: &steps)
            }
        }

        let newNode = SplayNode(value)
        newNode.parent = parent
        if value < parent!.value {
            parent!.left = newNode
        } else {
            parent!.right = newNode
        }

        return splay(root, node: newNode, steps: &steps)
    }

    // MARK: - Search

    private func search(_ root: SplayNode?, value: Int, steps: inout [AlgorithmStep]) -> SplayNode? {
        var current = root
        while let node = current {
            let lo = levelOrderTraversal(root)
            let idx = lo.firstIndex(of: node.value) ?? 0
            if value < node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: lo,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 14,
                    description: "\(value) < \(node.value) -- go left"
                ))
                current = node.left
            } else if value > node.value {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: lo,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 14,
                    description: "\(value) > \(node.value) -- go right"
                ))
                current = node.right
            } else {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: lo,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 15,
                    description: "Found \(value). Splaying to root."
                ))
                return splay(root, node: node, steps: &steps)
            }
        }
        return root
    }

    // MARK: - Splay

    private func splay(_ root: SplayNode?, node: SplayNode, steps: inout [AlgorithmStep]) -> SplayNode {
        while node.parent != nil {
            if node.parent!.parent == nil {
                // Zig case: parent is root
                let lo = levelOrderTraversal(root)
                let nIdx = lo.firstIndex(of: node.value) ?? 0
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: lo,
                    highlightedIndices: [nIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 3,
                    description: "Zig: single rotation to bring \(node.value) to root"
                ))

                if node === node.parent!.left {
                    rightRotate(node.parent!)
                } else {
                    leftRotate(node.parent!)
                }
            } else if (node === node.parent!.left && node.parent === node.parent!.parent!.left) ||
                      (node === node.parent!.right && node.parent === node.parent!.parent!.right) {
                // Zig-zig case
                let lo = levelOrderTraversal(root)
                let nIdx = lo.firstIndex(of: node.value) ?? 0
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: lo,
                    highlightedIndices: [nIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 5,
                    description: "Zig-zig: rotate parent then node (\(node.value))"
                ))

                if node === node.parent!.left {
                    rightRotate(node.parent!.parent!)
                    rightRotate(node.parent!)
                } else {
                    leftRotate(node.parent!.parent!)
                    leftRotate(node.parent!)
                }
            } else {
                // Zig-zag case
                let lo = levelOrderTraversal(root)
                let nIdx = lo.firstIndex(of: node.value) ?? 0
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: lo,
                    highlightedIndices: [nIdx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 7,
                    description: "Zig-zag: rotate node (\(node.value)) twice in opposite directions"
                ))

                if node === node.parent!.right && node.parent === node.parent!.parent!.left {
                    leftRotate(node.parent!)
                    rightRotate(node.parent!)
                } else {
                    rightRotate(node.parent!)
                    leftRotate(node.parent!)
                }
            }
        }

        return node
    }

    // MARK: - Rotations

    private func rightRotate(_ y: SplayNode) {
        guard let x = y.left else { return }
        y.left = x.right
        x.right?.parent = y
        x.parent = y.parent

        if let parent = y.parent {
            if y === parent.left {
                parent.left = x
            } else {
                parent.right = x
            }
        }
        x.right = y
        y.parent = x
    }

    private func leftRotate(_ x: SplayNode) {
        guard let y = x.right else { return }
        x.right = y.left
        y.left?.parent = x
        y.parent = x.parent

        if let parent = x.parent {
            if x === parent.left {
                parent.left = y
            } else {
                parent.right = y
            }
        }
        y.left = x
        x.parent = y
    }

    // MARK: - Helpers

    private func levelOrderTraversal(_ root: SplayNode?) -> [Int] {
        guard let root = root else { return [] }

        var result: [Int] = []
        var queue: [SplayNode] = [root]

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
