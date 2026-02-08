import Foundation

struct TopologicalSortAlgorithm: AlgorithmExecutable {
    let id = "topological-sort"
    let name = "Topological Sort"
    let category = "graph"
    let timeComplexity = (best: "O(V + E)", average: "O(V + E)", worst: "O(V + E)")
    let spaceComplexity = "O(V)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure topologicalSort(graph)"),
        (1, "  compute in-degree for each vertex"),
        (2, "  queue ← vertices with in-degree 0"),
        (3, "  while queue is not empty do"),
        (4, "    u ← dequeue(queue)"),
        (5, "    add u to result"),
        (6, "    for each neighbor v of u do"),
        (7, "      in-degree[v] ← in-degree[v] - 1"),
        (8, "      if in-degree[v] = 0 then"),
        (9, "        enqueue(queue, v)"),
        (10, "  return result")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let (adjacencyList, nodeCount) = buildDAG(from: input)
        let allNodes = Array(0..<nodeCount)

        // Compute in-degrees
        var inDegree = [Int](repeating: 0, count: nodeCount)
        for node in 0..<nodeCount {
            for neighbor in adjacencyList[node] ?? [] {
                inDegree[neighbor] += 1
            }
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: allNodes,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Topological Sort (Kahn's algorithm) on DAG with \(nodeCount) vertices"
        ))

        // Show initial in-degrees
        steps.append(AlgorithmStep(
            type: .highlight,
            array: inDegree,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "In-degrees computed: \(inDegree)"
        ))

        // Initialize queue with zero in-degree vertices
        var queue: [Int] = []
        for i in 0..<nodeCount {
            if inDegree[i] == 0 {
                queue.append(i)
            }
        }

        let zeroInDegreeIndices = queue.map { $0 }
        steps.append(AlgorithmStep(
            type: .insert,
            array: allNodes,
            highlightedIndices: zeroInDegreeIndices,
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "Vertices with in-degree 0: \(queue). Enqueued."
        ))

        var result: [Int] = []
        var processedIndices: [Int] = []

        // Kahn's algorithm main loop
        while !queue.isEmpty {
            let u = queue.removeFirst()
            result.append(u)
            processedIndices.append(u)

            // Dequeue step
            steps.append(AlgorithmStep(
                type: .select,
                array: allNodes,
                highlightedIndices: [u],
                secondaryIndices: queue,
                sortedIndices: processedIndices,
                pseudocodeLine: 4,
                description: "Dequeued vertex \(u). Result so far: \(result)"
            ))

            // Add to result
            steps.append(AlgorithmStep(
                type: .sorted,
                array: allNodes,
                highlightedIndices: [u],
                secondaryIndices: [],
                sortedIndices: processedIndices,
                pseudocodeLine: 5,
                description: "Added vertex \(u) to topological order"
            ))

            // Process neighbors
            let neighbors = adjacencyList[u] ?? []
            if !neighbors.isEmpty {
                steps.append(AlgorithmStep(
                    type: .traverse,
                    array: allNodes,
                    highlightedIndices: [u],
                    secondaryIndices: neighbors.filter { $0 < nodeCount },
                    sortedIndices: processedIndices,
                    pseudocodeLine: 6,
                    description: "Processing neighbors of vertex \(u): \(neighbors)"
                ))
            }

            for v in neighbors {
                inDegree[v] -= 1

                // Show in-degree decrement
                steps.append(AlgorithmStep(
                    type: .compare,
                    array: inDegree,
                    highlightedIndices: [v],
                    secondaryIndices: [u],
                    sortedIndices: processedIndices,
                    pseudocodeLine: 7,
                    description: "in-degree[\(v)] decremented to \(inDegree[v])"
                ))

                if inDegree[v] == 0 {
                    queue.append(v)

                    // Show new zero in-degree vertex enqueued
                    steps.append(AlgorithmStep(
                        type: .insert,
                        array: allNodes,
                        highlightedIndices: [v],
                        secondaryIndices: [],
                        sortedIndices: processedIndices,
                        pseudocodeLine: 9,
                        description: "Vertex \(v) now has in-degree 0. Enqueued. Queue: \(queue)"
                    ))
                }
            }
        }

        // Check for cycle
        if result.count < nodeCount {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: allNodes,
                highlightedIndices: allNodes.filter { !processedIndices.contains($0) },
                secondaryIndices: [],
                sortedIndices: processedIndices,
                pseudocodeLine: 10,
                description: "Warning: Graph contains a cycle. Only \(result.count)/\(nodeCount) vertices sorted."
            ))
        }

        // Final result
        steps.append(AlgorithmStep(
            type: .sorted,
            array: result,
            highlightedIndices: Array(0..<result.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<result.count),
            pseudocodeLine: 10,
            description: "Topological Sort complete. Order: \(result)"
        ))

        return steps
    }

    // MARK: - DAG Construction

    /// Build a directed acyclic graph. Returns (adjacencyList, nodeCount).
    private func buildDAG(from input: [Int]) -> (adjacencyList: [Int: [Int]], nodeCount: Int) {
        // If input has a single element, use it as node count
        if input.count == 1 {
            let nodeCount = max(4, min(input[0], 15))
            return (generateDAG(nodeCount: nodeCount), nodeCount)
        }

        // Default DAG: 6 vertices representing a course prerequisite structure
        //
        //   0 --> 1 --> 3
        //   |         / |
        //   v        /  v
        //   2 ------    4
        //   |
        //   v
        //   5
        //
        if input.isEmpty {
            let nodeCount = 6
            var adj: [Int: [Int]] = [:]
            for i in 0..<nodeCount { adj[i] = [] }

            adj[0] = [1, 2]
            adj[1] = [3]
            adj[2] = [3, 5]
            adj[3] = [4]
            adj[4] = []
            adj[5] = []

            return (adj, nodeCount)
        }

        // Otherwise interpret input as edge pairs: [from, to, from, to, ...]
        if input.count >= 2 {
            let maxNode = input.max() ?? 0
            let nodeCount = maxNode + 1
            var adj: [Int: [Int]] = [:]
            for i in 0..<nodeCount { adj[i] = [] }

            var i = 0
            while i + 1 < input.count {
                let from = input[i]
                let to = input[i + 1]
                if from < nodeCount && to < nodeCount {
                    adj[from]?.append(to)
                }
                i += 2
            }

            // Sort neighbor lists for deterministic traversal
            for key in adj.keys {
                adj[key]?.sort()
            }

            return (adj, nodeCount)
        }

        return ([:], 0)
    }

    /// Generate a random-ish DAG for a given node count.
    private func generateDAG(nodeCount: Int) -> [Int: [Int]] {
        var adj: [Int: [Int]] = [:]
        for i in 0..<nodeCount { adj[i] = [] }

        // Edges only go from lower to higher numbered nodes (ensures DAG)
        for i in 0..<nodeCount {
            // Each node has edges to 1-2 higher-numbered nodes
            let step1 = i + 1
            let step2 = i + 2
            if step1 < nodeCount { adj[i]?.append(step1) }
            if step2 < nodeCount && i % 2 == 0 { adj[i]?.append(step2) }
        }

        return adj
    }
}
