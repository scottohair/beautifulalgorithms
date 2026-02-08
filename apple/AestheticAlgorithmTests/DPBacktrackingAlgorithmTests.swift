import XCTest
@testable import AestheticAlgorithm

// MARK: - Dynamic Programming & Backtracking Algorithm Tests

final class DPBacktrackingAlgorithmTests: XCTestCase {

    // MARK: - Test Data

    /// Fibonacci-style input (e.g., compute fib(n) where n is the first element).
    private let fibonacciInput = [8]
    private let fibonacciSmallInput = [3]
    private let fibonacciLargeInput = [15]

    /// Change-making input (e.g., [amount, coin1, coin2, ...]).
    private let changeMakingInput = [11, 1, 5, 6]
    private let changeMakingSmallInput = [4, 1, 2]

    /// LCS input (two sequences encoded as integers).
    private let lcsInput = [1, 2, 3, 4, 5]

    /// N-Queens input (board size).
    private let nQueensInput = [4]
    private let nQueensSmallInput = [1]
    private let nQueensLargerInput = [6]

    /// All DP/backtracking algorithms under test.
    private var allDPBacktrackingAlgorithms: [(name: String, algorithm: AlgorithmExecutable, input: [Int])] {
        [
            ("FibonacciAlgorithm", FibonacciAlgorithm(), fibonacciInput),
            ("ChangeMakingAlgorithm", ChangeMakingAlgorithm(), changeMakingInput),
            ("LCSAlgorithm", LCSAlgorithm(), lcsInput),
            ("NQueensAlgorithm", NQueensAlgorithm(), nQueensInput),
        ]
    }

    // MARK: - Test: Step Generation

    func testFibonacciAlgorithmGeneratesSteps() {
        let steps = FibonacciAlgorithm().generateSteps(from: fibonacciInput)
        assertStepsValid(steps)
    }

    func testChangeMakingAlgorithmGeneratesSteps() {
        let steps = ChangeMakingAlgorithm().generateSteps(from: changeMakingInput)
        assertStepsValid(steps)
    }

    func testLCSAlgorithmGeneratesSteps() {
        let steps = LCSAlgorithm().generateSteps(from: lcsInput)
        assertStepsValid(steps)
    }

    func testNQueensAlgorithmGeneratesSteps() {
        let steps = NQueensAlgorithm().generateSteps(from: nQueensInput)
        assertStepsValid(steps)
    }

    // MARK: - Test: Step Types Are Valid

    func testFibonacciAlgorithmStepTypesValid() {
        let steps = FibonacciAlgorithm().generateSteps(from: fibonacciInput)
        assertStepTypesValid(steps)
    }

    func testChangeMakingAlgorithmStepTypesValid() {
        let steps = ChangeMakingAlgorithm().generateSteps(from: changeMakingInput)
        assertStepTypesValid(steps)
    }

    func testLCSAlgorithmStepTypesValid() {
        let steps = LCSAlgorithm().generateSteps(from: lcsInput)
        assertStepTypesValid(steps)
    }

    func testNQueensAlgorithmStepTypesValid() {
        let steps = NQueensAlgorithm().generateSteps(from: nQueensInput)
        assertStepTypesValid(steps)
    }

    // MARK: - Test: Indices In Bounds

    func testFibonacciAlgorithmIndicesInBounds() {
        let steps = FibonacciAlgorithm().generateSteps(from: fibonacciInput)
        assertIndicesInBounds(steps)
    }

    func testChangeMakingAlgorithmIndicesInBounds() {
        let steps = ChangeMakingAlgorithm().generateSteps(from: changeMakingInput)
        assertIndicesInBounds(steps)
    }

    func testLCSAlgorithmIndicesInBounds() {
        let steps = LCSAlgorithm().generateSteps(from: lcsInput)
        assertIndicesInBounds(steps)
    }

    func testNQueensAlgorithmIndicesInBounds() {
        let steps = NQueensAlgorithm().generateSteps(from: nQueensInput)
        assertIndicesInBounds(steps)
    }

    // MARK: - Test: Fibonacci Specific

    func testFibonacciSmallInput() {
        let steps = FibonacciAlgorithm().generateSteps(from: fibonacciSmallInput)
        XCTAssertFalse(steps.isEmpty, "Fibonacci with small input should produce steps")
        assertStepTypesValid(steps)
        assertIndicesInBounds(steps)
    }

    func testFibonacciLargeInput() {
        let steps = FibonacciAlgorithm().generateSteps(from: fibonacciLargeInput)
        XCTAssertFalse(steps.isEmpty, "Fibonacci with larger input should produce steps")
        assertStepTypesValid(steps)
    }

    func testFibonacciStepCountGrowsWithInput() {
        let stepsSmall = FibonacciAlgorithm().generateSteps(from: fibonacciSmallInput)
        let stepsLarge = FibonacciAlgorithm().generateSteps(from: fibonacciInput)
        XCTAssertGreaterThan(
            stepsLarge.count, stepsSmall.count,
            "Fibonacci with larger input should produce more steps"
        )
    }

    // MARK: - Test: Change Making Specific

    func testChangeMakingSmallInput() {
        let steps = ChangeMakingAlgorithm().generateSteps(from: changeMakingSmallInput)
        XCTAssertFalse(steps.isEmpty, "Change Making with small input should produce steps")
        assertStepTypesValid(steps)
        assertIndicesInBounds(steps)
    }

    // MARK: - Test: N-Queens Specific

    func testNQueensSmallBoard() {
        let steps = NQueensAlgorithm().generateSteps(from: nQueensSmallInput)
        XCTAssertFalse(steps.isEmpty, "N-Queens with 1x1 board should produce steps")
        assertStepTypesValid(steps)
        assertIndicesInBounds(steps)
    }

    func testNQueensLargerBoard() {
        let steps = NQueensAlgorithm().generateSteps(from: nQueensLargerInput)
        XCTAssertFalse(steps.isEmpty, "N-Queens with 6x6 board should produce steps")
        assertStepTypesValid(steps)
    }

    func testNQueensStepCountGrowsWithBoardSize() {
        let stepsSmall = NQueensAlgorithm().generateSteps(from: nQueensInput)        // 4x4
        let stepsLarger = NQueensAlgorithm().generateSteps(from: nQueensLargerInput)  // 6x6
        XCTAssertGreaterThan(
            stepsLarger.count, stepsSmall.count,
            "N-Queens with larger board should produce more steps"
        )
    }

    // MARK: - Test: Algorithm Metadata

    func testDPBacktrackingAlgorithmMetadata() {
        for (name, algorithm, _) in allDPBacktrackingAlgorithms {
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

    func testDPBacktrackingAlgorithmsAreDeterministic() {
        for (name, algorithm, input) in allDPBacktrackingAlgorithms {
            let steps1 = algorithm.generateSteps(from: input)
            let steps2 = algorithm.generateSteps(from: input)
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
