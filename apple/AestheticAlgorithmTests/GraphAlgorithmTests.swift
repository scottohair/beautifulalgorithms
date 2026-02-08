import XCTest
@testable import AestheticAlgorithm

// MARK: - Graph Algorithm Tests

final class GraphAlgorithmTests: XCTestCase {

    // MARK: - Test Data

    /// Default input: graph algorithms typically interpret input as node count or use defaults.
    private let defaultInput: [Int] = []
    private let sevenNodeInput = [7]
    private let fiveNodeInput = [5]
    private let tenNodeInput = [10]

    /// All graph algorithms under test.
    private var allGraphAlgorithms: [(name: String, algorithm: AlgorithmExecutable)] {
        [
            ("BFSAlgorithm", BFSAlgorithm()),
            ("DFSAlgorithm", DFSAlgorithm()),
            ("DijkstraAlgorithm", DijkstraAlgorithm()),
            ("PrimAlgorithm", PrimAlgorithm()),
            ("KruskalAlgorithm", KruskalAlgorithm()),
            ("FloydWarshallAlgorithm", FloydWarshallAlgorithm()),
            ("TopologicalSortAlgorithm", TopologicalSortAlgorithm()),
        ]
    }

    // MARK: - Test: Step Generation

    func testBFSAlgorithmGeneratesSteps() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testDFSAlgorithmGeneratesSteps() {
        let steps = DFSAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testDijkstraAlgorithmGeneratesSteps() {
        let steps = DijkstraAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testPrimAlgorithmGeneratesSteps() {
        let steps = PrimAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testKruskalAlgorithmGeneratesSteps() {
        let steps = KruskalAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testFloydWarshallAlgorithmGeneratesSteps() {
        let steps = FloydWarshallAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testTopologicalSortAlgorithmGeneratesSteps() {
        let steps = TopologicalSortAlgorithm().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    // MARK: - Test: Step Types Are Valid

    func testBFSAlgorithmStepTypesValid() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testDFSAlgorithmStepTypesValid() {
        let steps = DFSAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testDijkstraAlgorithmStepTypesValid() {
        let steps = DijkstraAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testPrimAlgorithmStepTypesValid() {
        let steps = PrimAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testKruskalAlgorithmStepTypesValid() {
        let steps = KruskalAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testFloydWarshallAlgorithmStepTypesValid() {
        let steps = FloydWarshallAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testTopologicalSortAlgorithmStepTypesValid() {
        let steps = TopologicalSortAlgorithm().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    // MARK: - Test: Indices In Bounds

    func testBFSAlgorithmIndicesInBounds() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testDFSAlgorithmIndicesInBounds() {
        let steps = DFSAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testDijkstraAlgorithmIndicesInBounds() {
        let steps = DijkstraAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testPrimAlgorithmIndicesInBounds() {
        let steps = PrimAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testKruskalAlgorithmIndicesInBounds() {
        let steps = KruskalAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testFloydWarshallAlgorithmIndicesInBounds() {
        let steps = FloydWarshallAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testTopologicalSortAlgorithmIndicesInBounds() {
        let steps = TopologicalSortAlgorithm().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    // MARK: - Test: Custom Node Counts

    func testAllGraphAlgorithmsWithSevenNodes() {
        for (name, algorithm) in allGraphAlgorithms {
            let steps = algorithm.generateSteps(from: sevenNodeInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for 7-node graph")
            assertStepTypesValid(steps)
            assertIndicesInBounds(steps)
        }
    }

    func testAllGraphAlgorithmsWithFiveNodes() {
        for (name, algorithm) in allGraphAlgorithms {
            let steps = algorithm.generateSteps(from: fiveNodeInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for 5-node graph")
            assertStepTypesValid(steps)
        }
    }

    func testAllGraphAlgorithmsWithTenNodes() {
        for (name, algorithm) in allGraphAlgorithms {
            let steps = algorithm.generateSteps(from: tenNodeInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for 10-node graph")
            assertStepTypesValid(steps)
        }
    }

    // MARK: - Test: BFS-Specific Behavior

    func testBFSAlgorithmFirstStepIsHighlight() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        XCTAssertFalse(steps.isEmpty, "BFS should produce steps")
        XCTAssertEqual(steps.first?.type, .highlight, "BFS first step should be a highlight (initial state)")
    }

    func testBFSAlgorithmFinalStepIsSorted() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        XCTAssertEqual(steps.last?.type, .sorted, "BFS final step should be .sorted (traversal complete)")
    }

    func testBFSAlgorithmProducesTraverseSteps() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        let traverseSteps = steps.filter { $0.type == .traverse }
        XCTAssertFalse(traverseSteps.isEmpty, "BFS should produce traverse-type steps for exploring neighbors")
    }

    func testBFSAlgorithmVisitOrderStartsAtZero() {
        let steps = BFSAlgorithm().generateSteps(from: defaultInput)
        guard let lastStep = steps.last else {
            XCTFail("BFS should produce steps")
            return
        }
        // The visit order (final array) should start with node 0.
        if !lastStep.array.isEmpty {
            XCTAssertEqual(lastStep.array.first, 0, "BFS visit order should start at node 0")
        }
    }

    // MARK: - Test: DFS-Specific Behavior

    func testDFSAlgorithmProducesTraverseSteps() {
        let steps = DFSAlgorithm().generateSteps(from: defaultInput)
        let traverseSteps = steps.filter { $0.type == .traverse }
        XCTAssertFalse(traverseSteps.isEmpty, "DFS should produce traverse-type steps")
    }

    // MARK: - Test: Algorithm Metadata

    func testGraphAlgorithmMetadata() {
        for (name, algorithm) in allGraphAlgorithms {
            XCTAssertFalse(algorithm.id.isEmpty, "\(name) should have a non-empty id")
            XCTAssertFalse(algorithm.name.isEmpty, "\(name) should have a non-empty name")
            XCTAssertFalse(algorithm.category.isEmpty, "\(name) should have a non-empty category")
            XCTAssertFalse(algorithm.spaceComplexity.isEmpty, "\(name) should have a non-empty spaceComplexity")
            XCTAssertFalse(algorithm.timeComplexity.best.isEmpty, "\(name) should have a non-empty best time complexity")
            XCTAssertFalse(algorithm.timeComplexity.average.isEmpty, "\(name) should have a non-empty average time complexity")
            XCTAssertFalse(algorithm.timeComplexity.worst.isEmpty, "\(name) should have a non-empty worst time complexity")
            XCTAssertFalse(algorithm.pseudocode.isEmpty, "\(name) should have non-empty pseudocode")
        }
    }

    // MARK: - Test: Determinism

    func testGraphAlgorithmsAreDeterministic() {
        for (name, algorithm) in allGraphAlgorithms {
            let steps1 = algorithm.generateSteps(from: defaultInput)
            let steps2 = algorithm.generateSteps(from: defaultInput)
            XCTAssertEqual(
                steps1.count, steps2.count,
                "\(name) should produce the same number of steps on identical input"
            )
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
