import Foundation

struct PrimAlgorithm: AlgorithmExecutable {
    let id = "prim"
    let name = "Prim's Algorithm"
    let category = "graph"
    let timeComplexity = (best: "O((V+E) log V)", average: "O((V+E) log V)", worst: "O((V+E) log V)")
    let spaceComplexity = "O(V + E)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure prim(graph)"),
        (1, "  for each vertex v in graph"),
        (2, "    key[v] ← INFINITY"),
        (3, "    inMST[v] ← false"),
        (4, "  key[0] ← 0"),
        (5, "  PQ.insert(0, 0)"),
        (6, ""),
        (7, "  while PQ is not empty"),
        (8, "    u ← PQ.extractMin()"),
        (9, "    if inMST[u] then continue"),
        (10, "    inMST[u] ← true"),
        (11, "    add edge (parent[u], u) to MST"),
        (12, "    for each neighbor v of u"),
        (13, "      if not inMST[v] and weight(u,v) < key[v]"),
        (14, "        key[v] ← weight(u,v)"),
        (15, "        parent[v] ← u"),
        (16, "        PQ.insert(v, key[v])")
    ]

    private struct Edge {
        let to: Int
        let weight: Int
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Default graph: 6 vertices
        let numVertices: Int
        let adjacency: [[Edge]]

        if input.isEmpty {
            numVertices = 6
            adjacency = [
                [Edge(to: 1, weight: 4), Edge(to: 3, weight: 6)],
                [Edge(to: 0, weight: 4), Edge(to: 2, weight: 8), Edge(to: 4, weight: 2)],
                [Edge(to: 1, weight: 8), Edge(to: 4, weight: 3), Edge(to: 5, weight: 9)],
                [Edge(to: 0, weight: 6), Edge(to: 4, weight: 5)],
                [Edge(to: 1, weight: 2), Edge(to: 2, weight: 3), Edge(to: 3, weight: 5), Edge(to: 5, weight: 7)],
                [Edge(to: 2, weight: 9), Edge(to: 4, weight: 7)]
            ]
        } else {
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

        let inf = Int.max / 2
        var key = [Int](repeating: inf, count: numVertices)
        var inMST = [Bool](repeating: false, count: numVertices)
        var parent = [Int](repeating: -1, count: numVertices)

        // Priority queue: (vertex, key)
        var pq: [(vertex: Int, key: Int)] = []

        key[0] = 0
        pq.append((0, 0))

        var mstWeight = 0
        var mstEdges: [(Int, Int, Int)] = []

        steps.append(AlgorithmStep(
            type: .highlight,
            array: key.map { $0 >= inf ? -1 : $0 },
            highlightedIndices: [0],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 4,
            description: "Initialize Prim's. Start vertex 0 with key 0. Others = INF (-1)."
        ))

        while !pq.isEmpty {
            pq.sort { $0.key < $1.key }
            let (u, _) = pq.removeFirst()

            let keyDisplay = key.map { $0 >= inf ? -1 : $0 }

            if inMST[u] {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: keyDisplay,
                    highlightedIndices: [u],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 9,
                    description: "Vertex \(u) already in MST. Skip."
                ))
                continue
            }

            inMST[u] = true
            let mstIndices = (0..<numVertices).filter { inMST[$0] }

            if parent[u] != -1 {
                let edgeWeight = key[u]
                mstWeight += edgeWeight
                mstEdges.append((parent[u], u, edgeWeight))

                steps.append(AlgorithmStep(
                    type: .select,
                    array: keyDisplay,
                    highlightedIndices: [u],
                    secondaryIndices: [parent[u]],
                    sortedIndices: mstIndices,
                    pseudocodeLine: 11,
                    description: "Add edge (\(parent[u]), \(u)) weight \(edgeWeight) to MST. Total MST weight: \(mstWeight)"
                ))
            } else {
                steps.append(AlgorithmStep(
                    type: .select,
                    array: keyDisplay,
                    highlightedIndices: [u],
                    secondaryIndices: [],
                    sortedIndices: mstIndices,
                    pseudocodeLine: 10,
                    description: "Start vertex \(u) added to MST."
                ))
            }

            for edge in adjacency[u] {
                let v = edge.to

                if !inMST[v] {
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: keyDisplay,
                        highlightedIndices: [u],
                        secondaryIndices: [v],
                        sortedIndices: mstIndices,
                        pseudocodeLine: 13,
                        description: "Check edge \(u)->\(v) weight \(edge.weight) vs key[\(v)] = \(key[v] >= inf ? "INF" : "\(key[v])")"
                    ))

                    if edge.weight < key[v] {
                        key[v] = edge.weight
                        parent[v] = u
                        pq.append((v, edge.weight))

                        let updatedDisplay = key.map { $0 >= inf ? -1 : $0 }
                        steps.append(AlgorithmStep(
                            type: .highlight,
                            array: updatedDisplay,
                            highlightedIndices: [v],
                            secondaryIndices: [u],
                            sortedIndices: mstIndices,
                            pseudocodeLine: 14,
                            description: "key[\(v)] updated to \(edge.weight), parent[\(v)] = \(u)"
                        ))
                    }
                }
            }
        }

        let finalKeys = key.map { $0 >= inf ? -1 : $0 }
        let edgeDesc = mstEdges.map { "(\($0.0)-\($0.1):\($0.2))" }.joined(separator: ", ")
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalKeys,
            highlightedIndices: Array(0..<numVertices),
            secondaryIndices: [],
            sortedIndices: Array(0..<numVertices),
            pseudocodeLine: 0,
            description: "Prim's complete. MST edges: \(edgeDesc). Total weight: \(mstWeight)"
        ))

        return steps
    }
}
