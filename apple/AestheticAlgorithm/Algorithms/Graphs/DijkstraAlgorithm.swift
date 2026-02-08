import Foundation

struct DijkstraAlgorithm: AlgorithmExecutable {
    let id = "dijkstra"
    let name = "Dijkstra's Algorithm"
    let category = "graph"
    let timeComplexity = (best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)")
    let spaceComplexity = "O(V)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure dijkstra(graph, source)"),
        (1, "  for each vertex v in graph"),
        (2, "    dist[v] ← INFINITY"),
        (3, "    visited[v] ← false"),
        (4, "  dist[source] ← 0"),
        (5, "  PQ.insert(source, 0)"),
        (6, ""),
        (7, "  while PQ is not empty"),
        (8, "    u ← PQ.extractMin()"),
        (9, "    if visited[u] then continue"),
        (10, "    visited[u] ← true"),
        (11, "    for each neighbor v of u"),
        (12, "      alt ← dist[u] + weight(u, v)"),
        (13, "      if alt < dist[v] then"),
        (14, "        dist[v] ← alt"),
        (15, "        PQ.insert(v, alt)")
    ]

    // Edge type for weighted graph
    private struct Edge {
        let to: Int
        let weight: Int
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Build a weighted adjacency list
        // Default graph: 6 vertices
        //   0 --4-- 1 --8-- 2
        //   |       |     / |
        //  8|      11  2/   7|
        //   |       | /     |
        //   3 --7-- 4 --9-- 5
        let numVertices: Int
        let adjacency: [[Edge]]

        if input.isEmpty {
            numVertices = 6
            adjacency = [
                [Edge(to: 1, weight: 4), Edge(to: 3, weight: 8)],                          // 0
                [Edge(to: 0, weight: 4), Edge(to: 2, weight: 8), Edge(to: 4, weight: 11)], // 1
                [Edge(to: 1, weight: 8), Edge(to: 4, weight: 2), Edge(to: 5, weight: 7)],  // 2
                [Edge(to: 0, weight: 8), Edge(to: 4, weight: 7)],                          // 3
                [Edge(to: 1, weight: 11), Edge(to: 2, weight: 2), Edge(to: 3, weight: 7), Edge(to: 5, weight: 9)], // 4
                [Edge(to: 2, weight: 7), Edge(to: 4, weight: 9)]                           // 5
            ]
        } else {
            // Parse input as edge list: [numVerts, from, to, weight, from, to, weight, ...]
            numVertices = input[0]
            var adj = [[Edge]](repeating: [], count: numVertices)
            var i = 1
            while i + 2 < input.count {
                let from = input[i]
                let to = input[i + 1]
                let w = input[i + 2]
                if from < numVertices && to < numVertices {
                    adj[from].append(Edge(to: to, weight: w))
                    adj[to].append(Edge(to: from, weight: w))
                }
                i += 3
            }
            adjacency = adj
        }

        let source = 0
        let inf = Int.max / 2
        var dist = [Int](repeating: inf, count: numVertices)
        var visited = [Bool](repeating: false, count: numVertices)

        dist[source] = 0

        // Priority queue: (vertex, distance) -- simple array-based
        var pq: [(vertex: Int, dist: Int)] = [(source, 0)]

        steps.append(AlgorithmStep(
            type: .highlight,
            array: dist.map { $0 >= inf ? -1 : $0 },
            highlightedIndices: [source],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: "Initialize distances. Source vertex \(source) has distance 0. Others = INF (-1)."
        ))

        while !pq.isEmpty {
            // Extract min
            pq.sort { $0.dist < $1.dist }
            let (u, d) = pq.removeFirst()

            let distDisplay = dist.map { $0 >= inf ? -1 : $0 }

            if visited[u] {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: distDisplay,
                    highlightedIndices: [u],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 9,
                    description: "Vertex \(u) already visited. Skip."
                ))
                continue
            }

            visited[u] = true
            let visitedIndices = (0..<numVertices).filter { visited[$0] }

            steps.append(AlgorithmStep(
                type: .select,
                array: distDisplay,
                highlightedIndices: [u],
                secondaryIndices: [],
                sortedIndices: visitedIndices,
                pseudocodeLine: 10,
                description: "Visit vertex \(u) with distance \(d). Mark as visited."
            ))

            for edge in adjacency[u] {
                let v = edge.to
                let alt = dist[u] + edge.weight

                steps.append(AlgorithmStep(
                    type: .compare,
                    array: distDisplay,
                    highlightedIndices: [u],
                    secondaryIndices: [v],
                    sortedIndices: visitedIndices,
                    pseudocodeLine: 12,
                    description: "Edge \(u)->\(v): alt = dist[\(u)](\(dist[u])) + \(edge.weight) = \(alt), current dist[\(v)] = \(dist[v] >= inf ? "INF" : "\(dist[v])")"
                ))

                if alt < dist[v] {
                    dist[v] = alt
                    pq.append((v, alt))

                    let updatedDisplay = dist.map { $0 >= inf ? -1 : $0 }
                    steps.append(AlgorithmStep(
                        type: .highlight,
                        array: updatedDisplay,
                        highlightedIndices: [v],
                        secondaryIndices: [u],
                        sortedIndices: visitedIndices,
                        pseudocodeLine: 14,
                        description: "Relaxed edge \(u)->\(v). dist[\(v)] updated to \(alt)"
                    ))
                }
            }
        }

        let finalDist = dist.map { $0 >= inf ? -1 : $0 }
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalDist,
            highlightedIndices: Array(0..<numVertices),
            secondaryIndices: [],
            sortedIndices: Array(0..<numVertices),
            pseudocodeLine: 0,
            description: "Dijkstra complete. Shortest distances from source \(source): \(finalDist)"
        ))

        return steps
    }
}
