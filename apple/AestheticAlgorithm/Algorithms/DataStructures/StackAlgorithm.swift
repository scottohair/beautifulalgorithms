import Foundation

struct StackAlgorithm: AlgorithmExecutable {
    let id = "stack"
    let name = "Stack"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(1)", worst: "O(1)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure push(S: stack, value)"),
        (1, "  S.top ← S.top + 1"),
        (2, "  S[S.top] ← value"),
        (3, ""),
        (4, "procedure pop(S: stack)"),
        (5, "  if isEmpty(S) then error"),
        (6, "  value ← S[S.top]"),
        (7, "  S.top ← S.top - 1"),
        (8, "  return value"),
        (9, ""),
        (10, "procedure peek(S: stack)"),
        (11, "  if isEmpty(S) then error"),
        (12, "  return S[S.top]")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var stack: [Int] = []

        // Initial empty stack state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: stack,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Stack is empty. Beginning operations."
        ))

        // Phase 1: Push all input values onto the stack
        for value in input {
            stack.append(value)
            let topIndex = stack.count - 1

            steps.append(AlgorithmStep(
                type: .insert,
                array: stack,
                highlightedIndices: [topIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Push \(value) onto the stack. Top is now at index \(topIndex)."
            ))
        }

        // Phase 2: Peek at the top element
        if !stack.isEmpty {
            let topIndex = stack.count - 1
            steps.append(AlgorithmStep(
                type: .highlight,
                array: stack,
                highlightedIndices: [topIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 12,
                description: "Peek: top element is \(stack[topIndex]) at index \(topIndex)"
            ))
        }

        // Phase 3: Pop elements off the stack (LIFO order)
        let popCount = min(stack.count, input.count)
        for _ in 0..<popCount {
            guard !stack.isEmpty else { break }

            let topIndex = stack.count - 1
            let poppedValue = stack[topIndex]

            // Show which element will be popped
            steps.append(AlgorithmStep(
                type: .highlight,
                array: stack,
                highlightedIndices: [topIndex],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Accessing top element: \(poppedValue) at index \(topIndex)"
            ))

            // Remove the top element
            stack.removeLast()
            steps.append(AlgorithmStep(
                type: .remove,
                array: stack,
                highlightedIndices: stack.isEmpty ? [] : [stack.count - 1],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 7,
                description: "Pop \(poppedValue) from the stack. \(stack.isEmpty ? "Stack is now empty." : "New top is \(stack[stack.count - 1]).")"
            ))
        }

        // Final state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: stack,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "All operations complete. Stack is \(stack.isEmpty ? "empty" : "not empty with \(stack.count) element(s)")."
        ))

        return steps
    }
}
