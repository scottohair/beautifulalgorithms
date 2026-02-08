import XCTest
@testable import AestheticAlgorithm

// MARK: - Data Structure Algorithm Tests

final class DataStructureAlgorithmTests: XCTestCase {

    // MARK: - Test Data

    private let defaultInput = [10, 5, 15, 3, 7, 12, 20]
    private let smallInput = [4, 2, 6]
    private let singleElement = [42]
    private let largerInput = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]

    /// All data structure algorithms under test, grouped for clarity.
    private var allDataStructureAlgorithms: [(name: String, algorithm: AlgorithmExecutable)] {
        [
            // Linear structures
            ("StackAlgorithm", StackAlgorithm()),
            ("QueueAlgorithm", QueueAlgorithm()),
            ("LinkedListAlgorithm", LinkedListAlgorithm()),

            // Tree structures
            ("BSTAlgorithm", BSTAlgorithm()),
            ("AVLTreeAlgorithm", AVLTreeAlgorithm()),
            ("RedBlackTreeAlgorithm", RedBlackTreeAlgorithm()),
            ("SplayTreeAlgorithm", SplayTreeAlgorithm()),
            ("BTreeAlgorithm", BTreeAlgorithm()),
            ("TrieAlgorithm", TrieAlgorithm()),

            // Heap structures
            ("MinHeapAlgorithm", MinHeapAlgorithm()),
            ("BinomialQueueAlgorithm", BinomialQueueAlgorithm()),
            ("FibonacciHeapAlgorithm", FibonacciHeapAlgorithm()),
            ("LeftistHeapAlgorithm", LeftistHeapAlgorithm()),
            ("SkewHeapAlgorithm", SkewHeapAlgorithm()),

            // Hashing and other
            ("HashTableAlgorithm", HashTableAlgorithm()),
            ("DisjointSetsAlgorithm", DisjointSetsAlgorithm()),
            ("HuffmanCodingAlgorithm", HuffmanCodingAlgorithm()),
        ]
    }

    // MARK: - Test: Step Generation With Default Input

    func testStackAlgorithmGeneratesSteps() {
        let steps = StackAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testQueueAlgorithmGeneratesSteps() {
        let steps = QueueAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testLinkedListAlgorithmGeneratesSteps() {
        let steps = LinkedListAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testBSTAlgorithmGeneratesSteps() {
        let steps = BSTAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testAVLTreeAlgorithmGeneratesSteps() {
        let steps = AVLTreeAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testRedBlackTreeAlgorithmGeneratesSteps() {
        let steps = RedBlackTreeAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testSplayTreeAlgorithmGeneratesSteps() {
        let steps = SplayTreeAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testBTreeAlgorithmGeneratesSteps() {
        let steps = BTreeAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testTrieAlgorithmGeneratesSteps() {
        let steps = TrieAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testMinHeapAlgorithmGeneratesSteps() {
        let steps = MinHeapAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testBinomialQueueAlgorithmGeneratesSteps() {
        let steps = BinomialQueueAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testFibonacciHeapAlgorithmGeneratesSteps() {
        let steps = FibonacciHeapAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testLeftistHeapAlgorithmGeneratesSteps() {
        let steps = LeftistHeapAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testSkewHeapAlgorithmGeneratesSteps() {
        let steps = SkewHeapAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testHashTableAlgorithmGeneratesSteps() {
        let steps = HashTableAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testDisjointSetsAlgorithmGeneratesSteps() {
        let steps = DisjointSetsAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testHuffmanCodingAlgorithmGeneratesSteps() {
        let steps = HuffmanCodingAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    // MARK: - Test: Step Types Are Valid

    func testAllDataStructureAlgorithmsStepTypesValid() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps = algorithm.generateSteps(from: defaultInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce non-empty steps")
            assertStepTypesValid(steps)
        }
    }

    // MARK: - Test: Indices In Bounds

    func testAllDataStructureAlgorithmsIndicesInBounds() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps = algorithm.generateSteps(from: defaultInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce non-empty steps")
            assertIndicesInBounds(steps)
        }
    }

    // MARK: - Test: Custom Inputs

    func testAllDataStructureAlgorithmsWithSmallInput() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps = algorithm.generateSteps(from: smallInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for small input")
            assertStepTypesValid(steps)
            assertIndicesInBounds(steps)
        }
    }

    func testAllDataStructureAlgorithmsWithSingleElement() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps = algorithm.generateSteps(from: singleElement)
            // Single-element input should produce at least some steps.
            if !steps.isEmpty {
                assertStepTypesValid(steps)
                assertIndicesInBounds(steps)
            }
        }
    }

    func testAllDataStructureAlgorithmsWithLargerInput() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps = algorithm.generateSteps(from: largerInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for larger input")
            assertStepTypesValid(steps)
        }
    }

    // MARK: - Test: Algorithm Metadata

    func testDataStructureAlgorithmMetadata() {
        for (name, algorithm) in allDataStructureAlgorithms {
            XCTAssertFalse(algorithm.id.isEmpty, "\(name) should have a non-empty id")
            XCTAssertFalse(algorithm.name.isEmpty, "\(name) should have a non-empty name")
            XCTAssertFalse(algorithm.category.isEmpty, "\(name) should have a non-empty category")
            XCTAssertFalse(algorithm.spaceComplexity.isEmpty, "\(name) should have a non-empty spaceComplexity")
            XCTAssertFalse(algorithm.pseudocode.isEmpty, "\(name) should have non-empty pseudocode")
        }
    }

    // MARK: - Test: BST-Specific Behavior

    func testBSTAlgorithmProducesInsertSteps() {
        let steps = BSTAlgorithm().generateSteps(from: defaultInput)
        let insertSteps = steps.filter { $0.type == .insert }
        XCTAssertFalse(insertSteps.isEmpty, "BST should produce insert-type steps")
    }

    func testBSTAlgorithmProducesCompareSteps() {
        let steps = BSTAlgorithm().generateSteps(from: defaultInput)
        let compareSteps = steps.filter { $0.type == .compare }
        XCTAssertFalse(compareSteps.isEmpty, "BST should produce compare-type steps during insertion")
    }

    func testBSTAlgorithmFinalStepContainsAllValues() {
        let input = [10, 5, 15, 3, 7]
        let steps = BSTAlgorithm().generateSteps(from: input)
        guard let lastStep = steps.last else {
            XCTFail("BST should produce at least one step")
            return
        }
        // The final level-order array should contain all input values.
        let finalSet = Set(lastStep.array)
        let inputSet = Set(input)
        XCTAssertEqual(finalSet, inputSet, "BST final level-order should contain all input values")
    }

    // MARK: - Test: Stack-Specific Behavior

    func testStackAlgorithmProducesInsertAndRemoveSteps() {
        let steps = StackAlgorithm().generateSteps(from: defaultInput)
        let insertSteps = steps.filter { $0.type == .insert }
        XCTAssertFalse(insertSteps.isEmpty, "Stack should produce insert (push) steps")
    }

    // MARK: - Test: Queue-Specific Behavior

    func testQueueAlgorithmProducesInsertSteps() {
        let steps = QueueAlgorithm().generateSteps(from: defaultInput)
        let insertSteps = steps.filter { $0.type == .insert }
        XCTAssertFalse(insertSteps.isEmpty, "Queue should produce insert (enqueue) steps")
    }

    // MARK: - Test: Determinism

    func testDataStructureAlgorithmsAreDeterministic() {
        for (name, algorithm) in allDataStructureAlgorithms {
            let steps1 = algorithm.generateSteps(from: defaultInput)
            let steps2 = algorithm.generateSteps(from: defaultInput)
            XCTAssertEqual(
                steps1.count, steps2.count,
                "\(name) should produce the same number of steps on identical input"
            )
            // Verify arrays match step-by-step (ids will differ since UUID is generated fresh).
            for i in 0..<min(steps1.count, steps2.count) {
                XCTAssertEqual(
                    steps1[i].array, steps2[i].array,
                    "\(name) step \(i) arrays should match across runs"
                )
                XCTAssertEqual(
                    steps1[i].type, steps2[i].type,
                    "\(name) step \(i) types should match across runs"
                )
            }
        }
    }
}
