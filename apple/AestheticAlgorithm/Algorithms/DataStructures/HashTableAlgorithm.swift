import Foundation

struct HashTableAlgorithm: AlgorithmExecutable {
    let id = "hash-table"
    let name = "Hash Table"
    let category = "data-structures"
    let timeComplexity = (best: "O(1)", average: "O(1)", worst: "O(n)")
    let spaceComplexity = "O(n)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure hash(key, tableSize)"),
        (1, "  return key mod tableSize"),
        (2, ""),
        (3, "procedure insert(table, key)"),
        (4, "  index ← hash(key, tableSize)"),
        (5, "  append key to table[index] chain"),
        (6, ""),
        (7, "procedure search(table, key)"),
        (8, "  index ← hash(key, tableSize)"),
        (9, "  for each item in table[index] do"),
        (10, "    if item = key then return true"),
        (11, "  return false"),
        (12, ""),
        (13, "procedure delete(table, key)"),
        (14, "  index ← hash(key, tableSize)"),
        (15, "  for each item in table[index] do"),
        (16, "    if item = key then remove item"),
        (17, "  return")
    ]

    private let tableSize = 7

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        var buckets: [[Int]] = Array(repeating: [], count: tableSize)

        let values = input.isEmpty ? [15, 22, 8, 36, 1, 29, 43, 50] : Array(input)

        // Initial state
        steps.append(AlgorithmStep(
            type: .highlight,
            array: flattenBuckets(buckets),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Hash table with \(tableSize) buckets (chaining). Empty."
        ))

        // Phase 1: Insert all values
        for value in values {
            let index = value % tableSize

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flattenBuckets(buckets),
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 3,
                description: "insert(\(value)): Computing hash"
            ))

            steps.append(AlgorithmStep(
                type: .highlight,
                array: flattenBuckets(buckets),
                highlightedIndices: indicesForBucket(index, in: buckets),
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 4,
                description: "hash(\(value)) = \(value) mod \(tableSize) = \(index)"
            ))

            let hadCollision = !buckets[index].isEmpty
            buckets[index].append(value)
            let flat = flattenBuckets(buckets)
            let insertedFlatIndex = flatIndexOf(value: value, bucket: index, in: buckets)

            if hadCollision {
                steps.append(AlgorithmStep(
                    type: .insert,
                    array: flat,
                    highlightedIndices: insertedFlatIndex != nil ? [insertedFlatIndex!] : [],
                    secondaryIndices: indicesForBucket(index, in: buckets),
                    sortedIndices: [],
                    pseudocodeLine: 5,
                    description: "Collision at bucket \(index). Chaining \(value) with existing values \(buckets[index].dropLast())"
                ))
            } else {
                steps.append(AlgorithmStep(
                    type: .insert,
                    array: flat,
                    highlightedIndices: insertedFlatIndex != nil ? [insertedFlatIndex!] : [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 5,
                    description: "Inserted \(value) into bucket \(index)"
                ))
            }
        }

        // Phase 2: Search for an existing value
        let searchExisting = values[values.count / 2]
        searchValue(searchExisting, in: buckets, steps: &steps)

        // Phase 3: Search for a non-existing value
        searchValue(999, in: buckets, steps: &steps)

        // Phase 4: Delete a value
        let deleteTarget = values[0]
        buckets = deleteValue(deleteTarget, from: buckets, steps: &steps)

        // Final state
        let finalFlat = flattenBuckets(buckets)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalFlat,
            highlightedIndices: Array(0..<finalFlat.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalFlat.count),
            pseudocodeLine: 17,
            description: "All hash table operations complete. Contents: \(finalFlat)"
        ))

        return steps
    }

    // MARK: - Search

    private func searchValue(_ key: Int, in buckets: [[Int]], steps: inout [AlgorithmStep]) {
        let index = key % tableSize
        let flat = flattenBuckets(buckets)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 7,
            description: "search(\(key)): Computing hash"
        ))

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: indicesForBucket(index, in: buckets),
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 8,
            description: "hash(\(key)) = \(key) mod \(tableSize) = \(index). Searching bucket \(index)."
        ))

        let chain = buckets[index]
        if chain.isEmpty {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: flat,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 11,
                description: "Bucket \(index) is empty. \(key) not found."
            ))
            return
        }

        for (chainIdx, item) in chain.enumerated() {
            let flatIdx = flatIndexOf(value: item, bucket: index, in: buckets, chainPosition: chainIdx)

            steps.append(AlgorithmStep(
                type: .compare,
                array: flat,
                highlightedIndices: flatIdx != nil ? [flatIdx!] : [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 10,
                description: "Comparing \(item) with \(key)"
            ))

            if item == key {
                steps.append(AlgorithmStep(
                    type: .select,
                    array: flat,
                    highlightedIndices: flatIdx != nil ? [flatIdx!] : [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 10,
                    description: "Found \(key) in bucket \(index)"
                ))
                return
            }
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 11,
            description: "Searched entire chain at bucket \(index). \(key) not found."
        ))
    }

    // MARK: - Delete

    private func deleteValue(_ key: Int, from buckets: [[Int]], steps: inout [AlgorithmStep]) -> [[Int]] {
        var buckets = buckets
        let index = key % tableSize
        let flat = flattenBuckets(buckets)

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 13,
            description: "delete(\(key)): Computing hash"
        ))

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: indicesForBucket(index, in: buckets),
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 14,
            description: "hash(\(key)) = \(key) mod \(tableSize) = \(index). Searching bucket \(index) for deletion."
        ))

        let chain = buckets[index]
        for (chainIdx, item) in chain.enumerated() {
            let flatIdx = flatIndexOf(value: item, bucket: index, in: buckets, chainPosition: chainIdx)

            steps.append(AlgorithmStep(
                type: .compare,
                array: flat,
                highlightedIndices: flatIdx != nil ? [flatIdx!] : [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 15,
                description: "Comparing \(item) with \(key)"
            ))

            if item == key {
                buckets[index].remove(at: chainIdx)
                let updatedFlat = flattenBuckets(buckets)

                steps.append(AlgorithmStep(
                    type: .remove,
                    array: updatedFlat,
                    highlightedIndices: indicesForBucket(index, in: buckets),
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 16,
                    description: "Deleted \(key) from bucket \(index)"
                ))

                return buckets
            }
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: flat,
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 17,
            description: "Value \(key) not found. Nothing to delete."
        ))

        return buckets
    }

    // MARK: - Helpers

    /// Flatten all buckets into a single array for visualization
    /// Order: bucket 0 contents, bucket 1 contents, etc.
    private func flattenBuckets(_ buckets: [[Int]]) -> [Int] {
        return buckets.flatMap { $0 }
    }

    /// Get the flat array indices for all items in a given bucket
    private func indicesForBucket(_ bucketIndex: Int, in buckets: [[Int]]) -> [Int] {
        var offset = 0
        for i in 0..<bucketIndex {
            offset += buckets[i].count
        }
        return Array(offset..<(offset + buckets[bucketIndex].count))
    }

    /// Get the flat array index for a specific value in a specific bucket
    private func flatIndexOf(value: Int, bucket: Int, in buckets: [[Int]], chainPosition: Int? = nil) -> Int? {
        var offset = 0
        for i in 0..<bucket {
            offset += buckets[i].count
        }

        if let pos = chainPosition {
            return offset + pos
        }

        if let localIndex = buckets[bucket].lastIndex(of: value) {
            return offset + localIndex
        }

        return nil
    }
}
