import Foundation

struct BFSAlgorithm: AlgorithmExecutable {
    let id = "bfs"
    let name = "Breadth-First Search"
    let category = "graph"
    let timeComplexity = (best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)")
    let spaceComplexity = "O(V)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure BFS(graph, start)"),
        (1, "  queue ← [start]"),
        (2, "  visited ← {start}"),
        (3, "  while queue is not empty do"),
        (4, "    node ← dequeue(queue)"),
        (5, "    visit(node)"),
        (6, "    for each neighbor of node do"),
        (7, "      if neighbor not in visited then"),
        (8, "        visited ← visited ∪ {neighbor}"),
        (9, "        enqueue(queue, neighbor)"),
        (10, "  return visited order")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Build adjacency list graph
        // If input is provided and first element is usable as node count, use it.
        // Otherwise use a default graph.
        let (adjacencyList, nodeCount) = buildGraph(from: input)

        var visited = Set<Int>()
        var visitOrder: [Int] = []
        var queue: [Int] = []
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
            description: "Starting BFS from node \(startNode) on graph with \(nodeCount) nodes"
        ))

        // Enqueue start node
        queue.append(startNode)
        visited.insert(startNode)

        steps.append(AlgorithmStep(
            type: .insert,
            array: allNodes,
            highlightedIndices: [startNode],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "Enqueue start node \(startNode). Queue: \(queue)"
        ))

        while !queue.isEmpty {
            let currentNode = queue.removeFirst()
            visitOrder.append(currentNode)

            // Visit step
            steps.append(AlgorithmStep(
                type: .select,
                array: allNodes,
                highlightedIndices: [currentNode],
                secondaryIndices: Array(visited),
                sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                pseudocodeLine: 4,
                description: "Dequeue node \(currentNode). Visit order: \(visitOrder)"
            ))

            // Process neighbors
            let neighbors = adjacencyList[currentNode] ?? []
            let unvisitedNeighborIndices = neighbors.filter { !visited.contains($0) }

            if !neighbors.isEmpty {
                steps.append(AlgorithmStep(
                    type: .traverse,
                    array: allNodes,
                    highlightedIndices: [currentNode],
                    secondaryIndices: neighbors.filter { $0 < nodeCount },
                    sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                    pseudocodeLine: 6,
                    description: "Exploring neighbors of node \(currentNode): \(neighbors)"
                ))
            }

            for neighbor in neighbors {
                if !visited.contains(neighbor) {
                    // Compare/check step
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: allNodes,
                        highlightedIndices: [neighbor],
                        secondaryIndices: [currentNode],
                        sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                        pseudocodeLine: 7,
                        description: "Node \(neighbor) not yet visited"
                    ))

                    visited.insert(neighbor)
                    queue.append(neighbor)

                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: allNodes,
                        highlightedIndices: [neighbor],
                        secondaryIndices: [],
                        sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                        pseudocodeLine: 9,
                        description: "Enqueue node \(neighbor). Queue: \(queue)"
                    ))
                } else {
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: allNodes,
                        highlightedIndices: [neighbor],
                        secondaryIndices: [currentNode],
                        sortedIndices: visitOrder.compactMap { $0 < nodeCount ? $0 : nil },
                        pseudocodeLine: 7,
                        description: "Node \(neighbor) already visited. Skipping."
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
            pseudocodeLine: 10,
            description: "BFS complete. Visit order: \(visitOrder)"
        ))

        return steps
    }

    // MARK: - Graph Construction

    /// Build an adjacency list graph. Uses input as node count if provided, otherwise defaults.
    private func buildGraph(from input: [Int]) -> (adjacencyList: [Int: [Int]], nodeCount: Int) {
        // Default graph: 7 nodes with edges forming a tree-like structure
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
            // Create a spanning tree first, then add a few extra edges
            for i in 0..<nodeCount {
                adjacencyList[i] = []
            }

            // Create spanning tree: connect each node to a random earlier node
            for i in 1..<nodeCount {
                let parent = i / 2  // Creates a balanced binary tree structure
                adjacencyList[parent]?.append(i)
                adjacencyList[i]?.append(parent)
            }

            // Add a couple extra edges for interest (if enough nodes)
            if nodeCount > 4 {
                let extraEdge1 = (1, nodeCount - 1)
                if !(adjacencyList[extraEdge1.0]?.contains(extraEdge1.1) ?? false) {
                    adjacencyList[extraEdge1.0]?.append(extraEdge1.1)
                    adjacencyList[extraEdge1.1]?.append(extraEdge1.0)
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
