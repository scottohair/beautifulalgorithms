import Foundation

struct TrieAlgorithm: AlgorithmExecutable {
    let id = "trie"
    let name = "Trie"
    let category = "data-structures"
    let timeComplexity = (best: "O(m)", average: "O(m)", worst: "O(m)")
    let spaceComplexity = "O(n * m)"

    let pseudocode: [(line: Int, text: String)] = [
        (0, "procedure insert(trie, word)"),
        (1, "  node ← trie.root"),
        (2, "  for each char in word"),
        (3, "    if char not in node.children"),
        (4, "      node.children[char] ← new TrieNode"),
        (5, "    node ← node.children[char]"),
        (6, "  node.isEndOfWord ← true"),
        (7, ""),
        (8, "procedure search(trie, word)"),
        (9, "  node ← trie.root"),
        (10, "  for each char in word"),
        (11, "    if char not in node.children"),
        (12, "      return false"),
        (13, "    node ← node.children[char]"),
        (14, "  return node.isEndOfWord")
    ]

    // MARK: - Internal TrieNode

    private class TrieNode {
        var children: [Character: TrieNode] = [:]
        var isEndOfWord: Bool = false
        var char: Character?

        init(char: Character? = nil) {
            self.char = char
        }
    }

    func generateSteps(from input: [Int]) -> [AlgorithmStep] {
        var steps: [AlgorithmStep] = []
        let root = TrieNode()

        // Convert input values to words via ASCII codes, or use defaults
        let words: [String]
        if input.isEmpty {
            words = ["cat", "car", "card", "care", "bat", "bar"]
        } else {
            // Interpret input as ASCII codes, split by 0 or by groups of characters
            // Values in range 97-122 (a-z) are letters; anything else is a separator
            var currentWord: [Character] = []
            var parsed: [String] = []
            for code in input {
                if code >= 65 && code <= 122 {
                    currentWord.append(Character(UnicodeScalar(code)!))
                } else {
                    if !currentWord.isEmpty {
                        parsed.append(String(currentWord))
                        currentWord = []
                    }
                }
            }
            if !currentWord.isEmpty {
                parsed.append(String(currentWord))
            }
            words = parsed.isEmpty ? ["cat", "car", "card"] : parsed
        }

        steps.append(AlgorithmStep(
            type: .highlight,
            array: [],
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 0,
            description: "Trie is empty. Will insert words: \(words.joined(separator: ", "))"
        ))

        // Insert words
        for word in words {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: trieToArray(root),
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 0,
                description: "Inserting word \"\(word)\""
            ))

            insertWord(root, word: word, steps: &steps)

            let trieArray = trieToArray(root)
            steps.append(AlgorithmStep(
                type: .insert,
                array: trieArray,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 6,
                description: "Inserted \"\(word)\". Trie state (BFS char values): \(trieArray)"
            ))
        }

        // Search for words
        let searchWords: [String]
        if words.count >= 3 {
            searchWords = [words[0], words[words.count - 1], "xyz"]
        } else {
            searchWords = words + ["xyz"]
        }

        for word in searchWords {
            steps.append(AlgorithmStep(
                type: .highlight,
                array: trieToArray(root),
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 8,
                description: "Searching for word \"\(word)\""
            ))

            let found = searchWord(root, word: word, steps: &steps)

            let trieArray = trieToArray(root)
            steps.append(AlgorithmStep(
                type: found ? .select : .highlight,
                array: trieArray,
                highlightedIndices: [],
                secondaryIndices: [],
                sortedIndices: [],
                pseudocodeLine: 14,
                description: "Search for \"\(word)\": \(found ? "FOUND" : "NOT FOUND")"
            ))
        }

        let finalArray = trieToArray(root)
        steps.append(AlgorithmStep(
            type: .sorted,
            array: finalArray,
            highlightedIndices: Array(0..<finalArray.count),
            secondaryIndices: [],
            sortedIndices: Array(0..<finalArray.count),
            pseudocodeLine: 0,
            description: "Trie operations complete. Node values (BFS): \(finalArray)"
        ))

        return steps
    }

    // MARK: - Insert

    private func insertWord(_ root: TrieNode, word: String, steps: inout [AlgorithmStep]) {
        var node = root

        steps.append(AlgorithmStep(
            type: .traverse,
            array: trieToArray(root),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 1,
            description: "Start at root node"
        ))

        for char in word {
            let charVal = Int(char.asciiValue ?? 0)
            let trieArray = trieToArray(root)

            if node.children[char] == nil {
                node.children[char] = TrieNode(char: char)
                steps.append(AlgorithmStep(
                    type: .insert,
                    array: trieToArray(root),
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 4,
                    description: "Created new node for '\(char)' (ASCII \(charVal))"
                ))
            } else {
                steps.append(AlgorithmStep(
                    type: .traverse,
                    array: trieArray,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 5,
                    description: "Node for '\(char)' exists. Traverse to it."
                ))
            }

            node = node.children[char]!
        }

        node.isEndOfWord = true
        steps.append(AlgorithmStep(
            type: .highlight,
            array: trieToArray(root),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 6,
            description: "Mark end of word \"\(word)\""
        ))
    }

    // MARK: - Search

    private func searchWord(_ root: TrieNode, word: String, steps: inout [AlgorithmStep]) -> Bool {
        var node = root

        steps.append(AlgorithmStep(
            type: .traverse,
            array: trieToArray(root),
            highlightedIndices: [],
            secondaryIndices: [],
            sortedIndices: [],
            pseudocodeLine: 9,
            description: "Start search at root node"
        ))

        for char in word {
            let trieArray = trieToArray(root)

            if let child = node.children[char] {
                steps.append(AlgorithmStep(
                    type: .traverse,
                    array: trieArray,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 13,
                    description: "Found '\(char)'. Traverse to child."
                ))
                node = child
            } else {
                steps.append(AlgorithmStep(
                    type: .highlight,
                    array: trieArray,
                    highlightedIndices: [],
                    secondaryIndices: [],
                    sortedIndices: [],
                    pseudocodeLine: 12,
                    description: "'\(char)' not found in children. Word does not exist."
                ))
                return false
            }
        }

        return node.isEndOfWord
    }

    // MARK: - Trie to Array (BFS)

    private func trieToArray(_ root: TrieNode) -> [Int] {
        var result: [Int] = []
        var queue: [TrieNode] = [root]

        while !queue.isEmpty {
            let node = queue.removeFirst()
            if let c = node.char {
                result.append(Int(c.asciiValue ?? 0))
            } else {
                result.append(0) // root node represented as 0
            }

            // Sort children by character for deterministic order
            let sortedChildren = node.children.sorted { $0.key < $1.key }
            for (_, child) in sortedChildren {
                queue.append(child)
            }
        }

        return result
    }
}
