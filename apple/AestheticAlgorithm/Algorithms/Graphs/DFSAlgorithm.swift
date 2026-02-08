import Foundation

struct DFSAlgorithm: AlgorithmExecutable {
    let id = "dfs"
    let name = "Depth-First Search"
    let category = "graph"
    let timeComplexity = (best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)")
    let spaceComplexity = "O(V)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure DFS(graph, start)"),
        (1, "  stack ← [start]"),
        (2, "  visited ← {}"),
        (3, "  while stack is not empty do"),
        (4, "    node ← pop(stack)"),
        (5, "    if node not in visited then"),
        (6, "      visited ← visited ∪ {node}"),
        (7, "      visit(node)"),
        (8, "      for each neighbor of node (reversed) do"),
        (9, "        if neighbor not in visited then"),
        (10, "          push(stack, neighbor)"),
        (11, "  return visited order")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Build adjacency list graph
        let (adjacencyList, nodeCount) = buildGraph(from: input)

        var visited = Set<Int>()
        var visitOrder: [Int] = []
        var stack: [Int] = []
        let startNode = 0

        // Initial state - show all nodes
        let allNodes = Array(0..<nodeCount)
        steps.append(AlgorithmStep(
            type: .highlight,
            array: allNodes,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Starting DFS from node \(startNode) on graph with \(nodeCount) nodes"
        ))

        // Push start node
        stack.append(startNode)

        steps.append(AlgorithmStep(
            type: .insert,
            array: allNodes,
            highlightedIndices: [startNode],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "Push start node \(startNode) onto stack. Stack: \(stack)"
        ))

        while !stack.isEmpty {
            let currentNode = stack.removeLast()

            // Pop step
            steps.append(AlgorithmStep(
                type: .highlight,
                array: allNodes,
                highlightedIndices: [currentNode],
                secondaryIndices: [],
                sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                pseudocodeLine: 4,
                description: "Pop node \(currentNode) from stack"
            ))

            if visited.contains(currentNode) {
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: allNodes,
                    highlightedIndices: [currentNode],
                    secondaryIndices: [],
                    sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                    pseudocodeLine: 5,
                    description: "Node \(currentNode) already visited. Skipping."
                ))
                continue
            }

            // Mark as visited
            visited.insert(currentNode)
            visitOrder.append(currentNode)

            steps.append(AlgorithmStep(
                type: .select,
                array: allNodes,
                highlightedIndices: [currentNode],
                secondaryIndices: Array(visited),
                sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                pseudocodeLine: 6,
                description: "Visit node \(currentNode). Visit order: \(visitOrder)"
            ))

            // Get neighbors and push in reverse order (so that the first neighbor is processed first)
            let neighbors = adjacencyList[currentNode] ?? []

            if !neighbors.isEmpty {
                steps.append(AlgorithmStep(
                    type: .traverse,
                    array: allNodes,
                    highlightedIndices: [currentNode],
                    secondaryIndices: neighbors.filter { $0 < nodeCount },
                    sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                    pseudocodeLine: 8,
                    description: "Exploring neighbors of node \(currentNode): \(neighbors)"
                ))
            }

            // Push neighbors in reverse order for correct DFS order
            for neighbor in neighbors.reversed() {
                if !visited.contains(neighbor) {
                    stack.append(neighbor)

                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: allNodes,
                        highlightedIndices: [neighbor],
                        secondaryIndices: [currentNode],
                        sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                        pseudocodeLine: 10,
                        description: "Push node \(neighbor) onto stack. Stack: \(stack)"
                    ))
                } else {
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: allNodes,
                        highlightedIndices: [neighbor],
                        secondaryIndices: [currentNode],
                        sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                        pseudocodeLine: 9,
                        description: "Neighbor \(neighbor) already visited. Not pushing."
                    ))
                }
            }
        }

        // Final state - show visit order
        steps.append(AlgorithmStep(
            type: .sorted,
            array: visitOrder,
            highlightedIndices: Array(0..<visitOrder.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<visitOrder.count),
            pseudocodeLine: 11,
            description: "DFS complete. Visit order: \(visitOrder)"
        ))

        return steps
    }

    // MARK: - Graph Construction

    /// Build an adjacency list graph. Uses input as node count if provided, otherwise defaults.
    private func buildGraph(from input: [Int]) -> (adjacencyList: [Int: [Int]], nodeCount: Int) {
        // Default graph: 7 nodes
        //
        //     0
        //    / \
        //   1   2
        //  / \   \
        // 3   4   5
        //         |
        //         6
        //
        let nodeCount: Int
        if let first = input.first, first >= 3, input.count == 1 {
            nodeCount = min(first, 20)
        } else {
            nodeCount = 7
        }

        var adjacencyList: [Int: [Int]] = [:]

        if nodeCount == 7 && (input.isEmpty || input.count == 1 && input.first == 7) {
            // Use the default well-structured graph
            adjacencyList[0] = [1, 2]
            adjacencyList[1] = [0, 3, 4]
            adjacencyList[2] = [0, 5]
            adjacencyList[3] = [1]
            adjacencyList[4] = [1]
            adjacencyList[5] = [2, 6]
            adjacencyList[6] = [5]
        } else {
            // Generate a connected graph for the given node count
            for i in 0..<nodeCount {
                adjacencyList[i] = []
            }

            // Create spanning tree: binary tree structure
            for i in 1..<nodeCount {
                let parent = (i - 1) / 2
                adjacencyList[parent]?.append(i)
                adjacencyList[i]?.append(parent)
            }

            // Add an extra edge for interest
            if nodeCount > 4 {
                let extraEdge = (1, nodeCount - 1)
                if !(adjacencyList[extraEdge.0]?.contains(extraEdge.1) ?? false) {
                    adjacencyList[extraEdge.0]?.append(extraEdge.1)
                    adjacencyList[extraEdge.1]?.append(extraEdge.0)
                }
            }
        }

        // Sort neighbor lists for deterministic traversal
        for key in adjacencyList.keys {
            adjacencyList[key]?.sort()
        }

        return (adjacencyList, nodeCount)
    }
}
