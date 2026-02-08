import Foundation

struct KruskalAlgorithm: AlgorithmExecutable {
    let id = "kruskal"
    let name = "Kruskal's Algorithm"
    let category = "graph"
    let timeComplexity = (best: "O(E log E)", average: "O(E log E)", worst: "O(E log E)")
    let spaceComplexity = "O(V + E)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure kruskal(graph)"),
        (1, "  MST ← empty set"),
        (2, "  sort all edges by weight ascending"),
        (3, "  initialize union-find for each vertex"),
        (4, ""),
        (5, "  for each edge (u, v, w) in sorted order"),
        (6, "    if find(u) ≠ find(v) then"),
        (7, "      MST ← MST ∪ {(u, v, w)}"),
        (8, "      union(u, v)"),
        (9, "    else"),
        (10, "      skip edge (would create cycle)"),
        (11, ""),
        (12, "  return MST")
    ]

    private struct WeightedEdge: Comparable {
        let from: Int
        let to: Int
        let weight: Int

        static func < (lhs: WeightedEdge, rhs: WeightedEdge) -> Bool {
            lhs.weight < rhs.weight
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let numVertices: Int
        var edges: [WeightedEdge] = []

        if input.isEmpty {
            numVertices = 6
            let rawEdges: [(Int, Int, Int)] = [
                (0, 1, 4), (0, 3, 6),
                (1, 2, 8), (1, 4, 2),
                (2, 4, 3), (2, 5, 9),
                (3, 4, 5),
                (4, 5, 7)
            ]
            edges = rawEdges.map { WeightedEdge(from: $0.0, to: $0.1, weight: $0.2) }
        } else {
            numVertices = input[0]
            var i = 1
            while i + 2 < input.count {
                let from = input[i]
                let to = input[i + 1]
                let w = input[i + 2]
                if from < numVertices && to < numVertices {
                    edges.append(WeightedEdge(from: from, to: to, weight: w))
                }
                i += 3
            }
        }

        // Display edge weights as the array
        let edgeWeights = edges.map { $0.weight }
        steps.append(AlgorithmStep(
            type: .highlight,
            array: edgeWeights,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Kruskal's: \(numVertices) vertices, \(edges.count) edges. Edge weights: \(edgeWeights)"
        ))

        // Sort edges
        edges.sort()
        let sortedWeights = edges.map { $0.weight }
        steps.append(AlgorithmStep(
            type: .highlight,
            array: sortedWeights,
            highlightedIndices: Array(0..<sortedWeights.count),
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "Edges sorted by weight: \(sortedWeights)"
        ))

        // Union-Find
        var parentUF = Array(0..<numVertices)
        var rank = [Int](repeating: 0, count: numVertices)

        func find(_ x: Int) -> Int {
            if parentUF[x] != x {
                parentUF[x] = find(parentUF[x])
            }
            return parentUF[x]
        }

        func union(_ x: Int, _ y: Int) {
            let rootX = find(x)
            let rootY = find(y)
            if rootX == rootY { return }
            if rank[rootX] < rank[rootY] {
                parentUF[rootX] = rootY
            } else if rank[rootX] > rank[rootY] {
                parentUF[rootY] = rootX
            } else {
                parentUF[rootY] = rootX
                rank[rootX] += 1
            }
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: parentUF,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 3,
            description: "Union-Find initialized. Each vertex is its own component."
        ))

        var mstEdges: [WeightedEdge] = []
        var mstWeight = 0

        for (idx, edge) in edges.enumerated() {
            let rootU = find(edge.from)
            let rootV = find(edge.to)

            steps.append(AlgorithmStep(
                type: .compare,
                array: sortedWeights,
                highlightedIndices: [idx],
                secondaryIndices: [],
                sortedIndices: (0..<idx).filter { i in
                    mstEdges.contains { $0.from == edges[i].from && $0.to == edges[i].to }
                },
                pseudocodeLine: 6,
                description: "Edge (\(edge.from), \(edge.to)) weight \(edge.weight): find(\(edge.from))=\(rootU), find(\(edge.to))=\(rootV)"
            ))

            if rootU != rootV {
                union(edge.from, edge.to)
                mstEdges.append(edge)
                mstWeight += edge.weight

                let mstIndices = mstEdges.map { e in
                    edges.firstIndex { $0.from == e.from && $0.to == e.to && $0.weight == e.weight } ?? 0
                }

                steps.append(AlgorithmStep(
                    type: .select,
                    array: sortedWeights,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: mstIndices,
                    pseudocodeLine: 7,
                    description: "Add edge (\(edge.from), \(edge.to)) weight \(edge.weight) to MST. Total: \(mstWeight)"
                ))

                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: parentUF,
                    highlightedIndices: [edge.from, edge.to],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 8,
                    description: "Union(\(edge.from), \(edge.to)). Components: \(parentUF)"
                ))

                if mstEdges.count == numVertices - 1 {
                    break
                }
            } else {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: sortedWeights,
                    highlightedIndices: [idx],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "Skip edge (\(edge.from), \(edge.to)) -- would create a cycle"
                ))
            }
        }

        let mstWeights = mstEdges.map { $0.weight }
        let edgeDesc = mstEdges.map { "(\($0.from)-\($0.to):\($0.weight))" }.joined(separator: ", ")
        steps.append(AlgorithmStep(
            type: .sorted,
            array: mstWeights,
            highlightedIndices: Array(0..<mstWeights.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<mstWeights.count),
            pseudocodeLine: 12,
            description: "Kruskal's complete. MST edges: \(edgeDesc). Total weight: \(mstWeight)"
        ))

        return steps
    }
}
