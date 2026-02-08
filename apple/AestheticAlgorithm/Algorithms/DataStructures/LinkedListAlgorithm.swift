import Foundation

struct LinkedListAlgorithm: AlgorithmExecutable {
    let id = "linked-list"
    let name = "Linked List"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(n)", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insertHead(value)"),
        (1, "  node ← new Node(value)"),
        (2, "  node.next ← head"),
        (3, "  head ← node"),
        (4, ""),
        (5, "procedure insertTail(value)"),
        (6, "  node ← new Node(value)"),
        (7, "  if head is null then head ← node"),
        (8, "  else traverse to last node"),
        (9, "    last.next ← node"),
        (10, ""),
        (11, "procedure delete(value)"),
        (12, "  if head.value = value then"),
        (13, "    head ← head.next"),
        (14, "  else find prev where prev.next.value = value"),
        (15, "    prev.next ← prev.next.next"),
        (16, ""),
        (17, "procedure search(value)"),
        (18, "  current ← head"),
        (19, "  while current ≠ null do"),
        (20, "    if current.value = value then return true"),
        (21, "    current ← current.next"),
        (22, "  return false")
    ]

    // Internal linked list node
    private class Node {
        let value: Int
        var next: Node?

        init(_ value: Int) {
            self.value = value
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var head: Node?

        let values = input.isEmpty ? [10, 25, 5, 30, 15] : Array(input)

        // Initial state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Linked list is empty. Beginning operations."
        ))

        // Phase 1: Insert at head for first two elements
        if values.count >= 1 {
            head = insertHead(head: head, value: values[0], steps: &steps)
        }
        if values.count >= 2 {
            head = insertHead(head: head, value: values[1], steps: &steps)
        }

        // Phase 2: Insert at tail for remaining elements
        for i in 2..<values.count {
            head = insertTail(head: head, value: values[i], steps: &steps)
        }

        // Phase 3: Search for a value that exists
        if let searchValue = values.last {
            search(head: head, value: searchValue, steps: &steps)
        }

        // Phase 4: Search for a value that does not exist
        search(head: head, value: 999, steps: &steps)

        // Phase 5: Delete a middle element
        if values.count >= 3 {
            head = delete(head: head, value: values[2], steps: &steps)
        }

        // Phase 6: Delete head
        if let headValue = head?.value {
            head = delete(head: head, value: headValue, steps: &steps)
        }

        // Final state
        let finalArray = toArray(head)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalArray,
            highlightedIndices: Array(0..<finalArray.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalArray.count),
            pseudocodeLine: 0,
            description: "All linked list operations complete. Final list: \(finalArray)"
        ))

        return steps
    }

    // MARK: - Operations

    private func insertHead(head: Node?, value: Int, steps: inout [AlgorithmStep]) -> Node {
        let currentArray = toArray(head)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "insertHead(\(value)): Creating new node"
        ))

        let newNode = Node(value)
        newNode.next = head

        let updatedArray = toArray(newNode)
        steps.append(AlgorithmStep(
            type: .insert,
            array: updatedArray,
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 3,
            description: "Inserted \(value) at the head of the list"
        ))

        return newNode
    }

    private func insertTail(head: Node?, value: Int, steps: inout [AlgorithmStep]) -> Node {
        let newNode = Node(value)

        guard let head = head else {
            let updatedArray = [value]
            steps.append(AlgorithmStep(
                type: .insert,
                array: updatedArray,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 7,
                description: "List was empty. Inserted \(value) as head."
            ))
            return newNode
        }

        let currentArray = toArray(head)
        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 5,
            description: "insertTail(\(value)): Traversing to end of list"
        ))

        // Traverse to tail, showing each visited node
        var current = head
        var index = 0
        while current.next != nil {
            steps.append(AlgorithmStep(
                type: .traverse,
                array: currentArray,
                highlightedIndices: [index],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "Visiting node \(current.value) at index \(index), continuing..."
            ))
            current = current.next!
            index += 1
        }

        // At the last node
        steps.append(AlgorithmStep(
            type: .traverse,
            array: currentArray,
            highlightedIndices: [index],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 8,
            description: "Reached last node \(current.value) at index \(index)"
        ))

        current.next = newNode
        let updatedArray = toArray(head)

        steps.append(AlgorithmStep(
            type: .insert,
            array: updatedArray,
            highlightedIndices: [updatedArray.count - 1],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: "Inserted \(value) at the tail (index \(updatedArray.count - 1))"
        ))

        return head
    }

    @discardableResult
    private func search(head: Node?, value: Int, steps: inout [AlgorithmStep]) -> Bool {
        let currentArray = toArray(head)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 17,
            description: "search(\(value)): Starting from head"
        ))

        var current = head
        var index = 0

        while let node = current {
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentArray,
                highlightedIndices: [index],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 20,
                description: "Comparing node \(node.value) with search value \(value)"
            ))

            if node.value == value {
                steps.append(AlgorithmStep(
                    type: .select,
                    array: currentArray,
                    highlightedIndices: [index],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 20,
                    description: "Found \(value) at index \(index)"
                ))
                return true
            }

            current = node.next
            index += 1
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 22,
            description: "Value \(value) not found in the linked list"
        ))
        return false
    }

    private func delete(head: Node?, value: Int, steps: inout [AlgorithmStep]) -> Node? {
        guard let head = head else { return nil }
        let currentArray = toArray(head)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 11,
            description: "delete(\(value)): Searching for node to remove"
        ))

        // Deleting head
        if head.value == value {
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentArray,
                highlightedIndices: [0],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Head node \(head.value) matches deletion value"
            ))

            let newHead = head.next
            let updatedArray = toArray(newHead)

            steps.append(AlgorithmStep(
                type: .remove,
                array: updatedArray,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 13,
                description: "Removed head node \(value). New head: \(newHead?.value.description ?? "nil")"
            ))

            return newHead
        }

        // Find the node before the one to delete
        var prev = head
        var index = 0

        while let next = prev.next {
            index += 1
            steps.append(AlgorithmStep(
                type: .compare,
                array: currentArray,
                highlightedIndices: [index],
                secondaryIndices: [index - 1],
                sortedIndices: [],
                pseudocodeLine: 14,
                description: "Checking if node \(next.value) at index \(index) equals \(value)"
            ))

            if next.value == value {
                prev.next = next.next
                let updatedArray = toArray(head)

                steps.append(AlgorithmStep(
                    type: .remove,
                    array: updatedArray,
                    highlightedIndices: index < updatedArray.count ? [index] : [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 15,
                    description: "Removed node \(value) from index \(index)"
                ))

                return head
            }

            prev = next
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: currentArray,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 15,
            description: "Value \(value) not found. Nothing to delete."
        ))

        return head
    }

    // MARK: - Helpers

    private func toArray(_ head: Node?) -> [Int] {
        var result: [Int] = []
        var current = head
        while let node = current {
            result.append(node.value)
            current = node.next
        }
        return result
    }
}
