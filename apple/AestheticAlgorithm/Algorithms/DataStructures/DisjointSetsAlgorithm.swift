import Foundation

struct DisjointSetsAlgorithm: AlgorithmExecutable {
    let id = "disjoint-sets"
    let name = "Disjoint Sets (Union-Find)"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(\u{03B1}(n))", worst: "O(\u{03B1}(n))")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure makeSet(x)"),
        (1, "  parent[x] ← x"),
        (2, "  rank[x] ← 0"),
        (3, ""),
        (4, "procedure find(x)"),
        (5, "  if parent[x] ≠ x"),
        (6, "    parent[x] ← find(parent[x])"),
        (7, "  return parent[x]"),
        (8, ""),
        (9, "procedure union(x, y)"),
        (10, "  rootX ← find(x)"),
        (11, "  rootY ← find(y)"),
        (12, "  if rootX = rootY then return"),
        (13, "  if rank[rootX] < rank[rootY]"),
        (14, "    parent[rootX] ← rootY"),
        (15, "  else if rank[rootX] > rank[rootY]"),
        (16, "    parent[rootY] ← rootX"),
        (17, "  else"),
        (18, "    parent[rootY] ← rootX"),
        (19, "    rank[rootX] ← rank[rootX] + 1")
    ]

    // MARK: - Generate Steps

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []

        let values = input.isEmpty ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : Array(input)
        let n = values.count

        // parent[i] tracks the parent; parent array IS the visualization
        var parent = Array(0..<n)
        var rank = [Int](repeating: 0, count: n)

        // Find with path compression
        func find(_ x: Int) -> Int {
            if parent[x] != x {
                parent[x] = find(parent[x])
            }
            return parent[x]
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: values,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Disjoint Sets: will create \(n) sets from values \(values)"
        ))

        // MakeSet for each element
        for i in 0..<n {
            steps.append(AlgorithmStep(
                type: .insert,
                array: parent,
                highlightedIndices: [i],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 1,
                description: "makeSet(\(i)): parent[\(i)] = \(i), rank[\(i)] = 0. Each element is its own set."
            ))
        }

        steps.append(AlgorithmStep(
            type: .passComplete,
            array: parent,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 2,
            description: "All \(n) singleton sets created. Parent array: \(parent)"
        ))

        // Union operations - pair up adjacent elements and some cross-pairs
        let unionPairs: [(Int, Int)]
        if n >= 8 {
            unionPairs = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 2), (4, 6), (0, 4)]
        } else if n >= 4 {
            unionPairs = [(0, 1), (2, 3), (0, 2)]
        } else if n >= 2 {
            unionPairs = [(0, 1)]
        } else {
            unionPairs = []
        }

        for (x, y) in unionPairs {
            guard x < n && y < n else { continue }

            steps.append(AlgorithmStep(
                type: .highlight,
                array: parent,
                highlightedIndices: [x, y],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 9,
                description: "union(\(x), \(y)): merging the sets containing \(x) and \(y)"
            ))

            let rootX = find(x)
            let rootY = find(y)

            steps.append(AlgorithmStep(
                type: .traverse,
                array: parent,
                highlightedIndices: [rootX],
                secondaryIndices: [rootY],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "find(\(x)) = \(rootX), find(\(y)) = \(rootY)"
            ))

            if rootX == rootY {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: parent,
                    highlightedIndices: [rootX],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 12,
                    description: "Already in same set (root = \(rootX)). No union needed."
                ))
                continue
            }

            // Union by rank
            if rank[rootX] < rank[rootY] {
                parent[rootX] = rootY

                steps.append(AlgorithmStep(
                    type: .swap,
                    array: parent,
                    highlightedIndices: [rootY],
                    secondaryIndices: [rootX],
                    sortedIndices: [],
                    pseudocodeLine: 14,
                    description: "rank[\(rootX)]=\(rank[rootX]) < rank[\(rootY)]=\(rank[rootY]): parent[\(rootX)] ← \(rootY). Parent: \(parent)"
                ))
            } else if rank[rootX] > rank[rootY] {
                parent[rootY] = rootX

                steps.append(AlgorithmStep(
                    type: .swap,
                    array: parent,
                    highlightedIndices: [rootX],
                    secondaryIndices: [rootY],
                    sortedIndices: [],
                    pseudocodeLine: 16,
                    description: "rank[\(rootX)]=\(rank[rootX]) > rank[\(rootY)]=\(rank[rootY]): parent[\(rootY)] ← \(rootX). Parent: \(parent)"
                ))
            } else {
                parent[rootY] = rootX
                rank[rootX] += 1

                steps.append(AlgorithmStep(
                    type: .swap,
                    array: parent,
                    highlightedIndices: [rootX],
                    secondaryIndices: [rootY],
                    sortedIndices: [],
                    pseudocodeLine: 18,
                    description: "Equal ranks: parent[\(rootY)] ← \(rootX), rank[\(rootX)] ← \(rank[rootX]). Parent: \(parent)"
                ))
            }

            steps.append(AlgorithmStep(
                type: .passComplete,
                array: parent,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 19,
                description: "Union complete. Parent array: \(parent), Rank array: \(rank)"
            ))
        }

        // Find operations with path compression
        let findTargets = n >= 7 ? [7, 3, 5] : (n >= 3 ? [n - 1] : [])

        for target in findTargets {
            guard target < n else { continue }
            let beforeParent = Array(parent)

            steps.append(AlgorithmStep(
                type: .highlight,
                array: parent,
                highlightedIndices: [target],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "find(\(target)): following path to root with path compression"
            ))

            // Show the path before compression
            var path: [Int] = []
            var current = target
            while parent[current] != current {
                path.append(current)
                current = parent[current]
            }
            path.append(current) // the root

            steps.append(AlgorithmStep(
                type: .traverse,
                array: parent,
                highlightedIndices: path,
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 5,
                description: "Path from \(target) to root: \(path). Root = \(current)"
            ))

            let root = find(target)

            if parent != beforeParent {
                steps.append(AlgorithmStep(
                    type: .swap,
                    array: parent,
                    highlightedIndices: path.filter { $0 != root },
                    secondaryIndices: [root],
                    sortedIndices: [],
                    pseudocodeLine: 6,
                    description: "Path compression: all nodes on path now point directly to root \(root). Parent: \(parent)"
                ))
            } else {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: parent,
                    highlightedIndices: [target],
                    secondaryIndices: [root],
                    sortedIndices: [],
                    pseudocodeLine: 7,
                    description: "find(\(target)) = \(root). No compression needed (already direct child or root)."
                ))
            }
        }

        steps.append(AlgorithmStep(
            type: .sorted,
            array: parent,
            highlightedIndices: Array(0..<n),
            secondaryIndices: [],
            sortedIndices: Array(0..<n),
            pseudocodeLine: 0,
            description: "Disjoint Sets operations complete. Final parent array: \(parent), rank array: \(rank)"
        ))

        return steps
    }
}
