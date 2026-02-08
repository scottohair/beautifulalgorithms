import XCTest
@testable import AestheticAlgorithm

// MARK: - Sorting Algorithm Tests

final class SortingAlgorithmTests: XCTestCase {

    // MARK: - Test Data

    private let defaultInput = [38, 27, 43, 3, 9, 82, 10]
    private let alreadySorted = [1, 2, 3, 4, 5]
    private let reverseSorted = [5, 4, 3, 2, 1]
    private let singleElement = [42]
    private let emptyInput: [Int] = []
    private let duplicates = [5, 3, 5, 1, 3, 1]
    private let largeInput = Array(1...50).shuffled()

    /// All sorting algorithms under test.
    private var allSortingAlgorithms: [(name: String, algorithm: AlgorithmExecutable)] {
        [
            ("BubbleSort", BubbleSort()),
            ("InsertionSort", InsertionSort()),
            ("SelectionSort", SelectionSort()),
            ("MergeSort", MergeSort()),
            ("QuickSort", QuickSort()),
            ("HeapSort", HeapSort()),
            ("ShellSort", ShellSort()),
            ("CountingSort", CountingSort()),
        ]
    }

    // MARK: - Test: generateSteps Produces Non-Empty Array

    func testBubbleSortGeneratesSteps() {
        let steps = BubbleSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testInsertionSortGeneratesSteps() {
        let steps = InsertionSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testSelectionSortGeneratesSteps() {
        let steps = SelectionSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testMergeSortGeneratesSteps() {
        let steps = MergeSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testQuickSortGeneratesSteps() {
        let steps = QuickSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testHeapSortGeneratesSteps() {
        let steps = HeapSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testShellSortGeneratesSteps() {
        let steps = ShellSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    func testCountingSortGeneratesSteps() {
        let steps = CountingSort().generateSteps(from: defaultInput)
        assertStepsValid(steps)
    }

    // MARK: - Test: Final Array Is Sorted

    func testBubbleSortFinalArrayIsSorted() {
        let steps = BubbleSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testInsertionSortFinalArrayIsSorted() {
        let steps = InsertionSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testSelectionSortFinalArrayIsSorted() {
        let steps = SelectionSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testMergeSortFinalArrayIsSorted() {
        let steps = MergeSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testQuickSortFinalArrayIsSorted() {
        let steps = QuickSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testHeapSortFinalArrayIsSorted() {
        let steps = HeapSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testShellSortFinalArrayIsSorted() {
        let steps = ShellSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    func testCountingSortFinalArrayIsSorted() {
        let steps = CountingSort().generateSteps(from: defaultInput)
        assertFinalArraySorted(steps)
    }

    // MARK: - Test: Step Types Are Valid

    func testBubbleSortStepTypesValid() {
        let steps = BubbleSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testInsertionSortStepTypesValid() {
        let steps = InsertionSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testSelectionSortStepTypesValid() {
        let steps = SelectionSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testMergeSortStepTypesValid() {
        let steps = MergeSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testQuickSortStepTypesValid() {
        let steps = QuickSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testHeapSortStepTypesValid() {
        let steps = HeapSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testShellSortStepTypesValid() {
        let steps = ShellSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    func testCountingSortStepTypesValid() {
        let steps = CountingSort().generateSteps(from: defaultInput)
        assertStepTypesValid(steps)
    }

    // MARK: - Test: Indices In Bounds

    func testBubbleSortIndicesInBounds() {
        let steps = BubbleSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testInsertionSortIndicesInBounds() {
        let steps = InsertionSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testSelectionSortIndicesInBounds() {
        let steps = SelectionSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testMergeSortIndicesInBounds() {
        let steps = MergeSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testQuickSortIndicesInBounds() {
        let steps = QuickSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testHeapSortIndicesInBounds() {
        let steps = HeapSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testShellSortIndicesInBounds() {
        let steps = ShellSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    func testCountingSortIndicesInBounds() {
        let steps = CountingSort().generateSteps(from: defaultInput)
        assertIndicesInBounds(steps)
    }

    // MARK: - Test: Edge Cases (applied to all sorting algorithms)

    func testAllSortingAlgorithmsWithEmptyInput() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: emptyInput)
            // Empty input may produce zero steps or a trivial step; either is acceptable.
            if !steps.isEmpty {
                assertStepTypesValid(steps)
            }
            // If steps were generated, the final array should be empty or trivially sorted.
            if let lastStep = steps.last {
                XCTAssertTrue(
                    lastStep.array.isEmpty || lastStep.array.count == 1,
                    "\(name) with empty input should produce an empty or single-element final array, got: \(lastStep.array)"
                )
            }
        }
    }

    func testAllSortingAlgorithmsWithSingleElement() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: singleElement)
            // Single-element input should produce steps (possibly just a "sorted" step).
            if !steps.isEmpty {
                assertStepTypesValid(steps)
                assertIndicesInBounds(steps)
                if let lastArray = steps.last?.array, !lastArray.isEmpty {
                    XCTAssertEqual(
                        lastArray, [42],
                        "\(name) with single element should have [42] as final array, got: \(lastArray)"
                    )
                }
            }
        }
    }

    func testAllSortingAlgorithmsWithAlreadySorted() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: alreadySorted)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for already-sorted input")
            assertFinalArraySorted(steps)
            assertIndicesInBounds(steps)
        }
    }

    func testAllSortingAlgorithmsWithReverseSorted() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: reverseSorted)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for reverse-sorted input")
            assertFinalArraySorted(steps)
            assertIndicesInBounds(steps)
        }
    }

    func testAllSortingAlgorithmsWithDuplicates() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: duplicates)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for input with duplicates")
            assertFinalArraySorted(steps)
            assertIndicesInBounds(steps)
        }
    }

    func testAllSortingAlgorithmsWithLargeInput() {
        for (name, algorithm) in allSortingAlgorithms {
            let steps = algorithm.generateSteps(from: largeInput)
            XCTAssertFalse(steps.isEmpty, "\(name) should produce steps for large input")
            assertFinalArraySorted(steps)
        }
    }

    // MARK: - Test: Algorithm Metadata

    func testSortingAlgorithmMetadata() {
        for (name, algorithm) in allSortingAlgorithms {
            XCTAssertFalse(algorithm.id.isEmpty, "\(name) should have a non-empty id")
            XCTAssertFalse(algorithm.name.isEmpty, "\(name) should have a non-empty name")
            XCTAssertEqual(algorithm.category, "sorting", "\(name) should have category 'sorting'")
            XCTAssertFalse(algorithm.spaceComplexity.isEmpty, "\(name) should have a non-empty spaceComplexity")
            XCTAssertFalse(algorithm.timeComplexity.best.isEmpty, "\(name) should have a non-empty best time complexity")
            XCTAssertFalse(algorithm.timeComplexity.average.isEmpty, "\(name) should have a non-empty average time complexity")
            XCTAssertFalse(algorithm.timeComplexity.worst.isEmpty, "\(name) should have a non-empty worst time complexity")
            XCTAssertFalse(algorithm.pseudocode.isEmpty, "\(name) should have non-empty pseudocode")
        }
    }
}
