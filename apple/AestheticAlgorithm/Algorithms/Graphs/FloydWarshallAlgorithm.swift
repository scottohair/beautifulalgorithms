import Foundation

struct FloydWarshallAlgorithm: AlgorithmExecutable {
    let id = "floyd-warshall"
    let name = "Floyd-Warshall"
    let category = "graph"
    let timeComplexity = (best: "O(V\u{00B3})", average: "O(V\u{00B3})", worst: "O(V\u{00B3})")
    let spaceComplexity = "O(V\u{00B2})"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure floydWarshall(W, n)"),
        (1, "  dist ← W   // initialize distance matrix"),
        (2, "  for k ← 0 to n-1 do"),
        (3, "    for i ← 0 to n-1 do"),
        (4, "      for j ← 0 to n-1 do"),
        (5, "        if dist[i][k] + dist[k][j] < dist[i][j]"),
        (6, "          dist[i][j] ← dist[i][k] + dist[k][j]"),
        (7, "  return dist")
    ]

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        // Build distance matrix from input or use default
        let (dist, v) = buildDistanceMatrix(from: input)
        var flat = dist

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Floyd-Warshall: finding all-pairs shortest paths for \(v) vertices"
        ))

        // Show initial distance matrix
        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "Initial distance matrix (\(v)x\(v)). 999 represents infinity (no direct edge)."
        ))

        // Triple nested loop
        for k in 0..<v {
            // Show which intermediate vertex we are considering
            let kDiag = k * v + k
            steps.append(AlgorithmStep(
                type: .select,
                array: flat,
                highlightedIndices: [kDiag],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Intermediate vertex k = \(k): checking if paths through \(k) are shorter"
            ))

            for i in 0..<v {
                for j in 0..<v {
                    let ijIdx = i * v + j
                    let ikIdx = i * v + k
                    let kjIdx = k * v + j

                    let throughK = flat[ikIdx] + flat[kjIdx]

                    // Show comparison
                    steps.append(AlgorithmStep(
                        type: .compare,
                        array: flat,
                        highlightedIndices: [ijIdx],
                        secondaryIndices: [ikIdx, kjIdx],
                        sortedIndices: [],
                        pseudocodeLine: 5,
                        description: "dist[\(i)][\(j)]=\(flat[ijIdx]) vs dist[\(i)][\(k)]+dist[\(k)][\(j)]=\(flat[ikIdx])+\(flat[kjIdx])=\(throughK)"
                    ))

                    if throughK < flat[ijIdx] {
                        flat[ijIdx] = throughK

                        // Show relaxation
                        steps.append(AlgorithmStep(
                            type: .swap,
                            array: flat,
                            highlightedIndices: [ijIdx],
                            secondaryIndices: [ikIdx, kjIdx],
                            sortedIndices: [],
                            pseudocodeLine: 6,
                            description: "Relaxed: dist[\(i)][\(j)] = \(throughK) (via vertex \(k))"
                        ))
                    }
                }
            }

            // Pass complete for intermediate vertex k
            steps.append(AlgorithmStep(
                type: .passComplete,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 2,
                description: "Completed all paths through intermediate vertex \(k)"
            ))
        }

        // Final result
        steps.append(AlgorithmStep(
            type: .sorted,
            array: flat,
            highlightedIndices: Array(0..<flat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<flat.count),
            pseudocodeLine: 7,
            description: "Floyd-Warshall complete. All shortest paths computed."
        ))

        return steps
    }

    // MARK: - Graph Construction

    /// Build a flattened distance matrix. Returns (flatMatrix, vertexCount).
    private func buildDistanceMatrix(from input: [Int]) -> (matrix: [Int], vertexCount: Int) {
        let INF = 999

        // If input can form a perfect square matrix, interpret it as a distance matrix
        if !input.isEmpty {
            let v = Int(Double(input.count).squareRoot())
            if v * v == input.count && v >= 2 {
                return (input, v)
            }
        }

        // Default: 4-vertex weighted directed graph
        //
        //   0 --3--> 1
        //   |        |
        //   7        1
        //   |        |
        //   v        v
        //   2 --2--> 3
        //         <--8---  0
        //
        let v = 4
        var matrix = [Int](repeating: INF, count: v * v)

        // Diagonal = 0
        for i in 0..<v {
            matrix[i * v + i] = 0
        }

        // Edges
        matrix[0 * v + 1] = 3   // 0 -> 1 weight 3
        matrix[0 * v + 2] = 7   // 0 -> 2 weight 7
        matrix[1 * v + 3] = 1   // 1 -> 3 weight 1
        matrix[2 * v + 3] = 2   // 2 -> 3 weight 2
        matrix[3 * v + 0] = 8   // 3 -> 0 weight 8

        return (matrix, v)
    }
}
