import XCTest
@testable import AestheticAlgorithm

// MARK: - Shared Test Helpers

/// Verifies that a step array has basic structural integrity.
/// - Checks that steps is non-empty.
/// - Checks that every step has a valid StepType.
/// - Checks that every step has a non-empty description.
func assertStepsValid(_ steps: [AlgorithmStep], file: StaticString = #filePath, line: UInt = #line) {
    XCTAssertFalse(steps.isEmpty, "Steps array should not be empty", file: file, line: line)

    for (index, step) in steps.enumerated() {
        // StepType is a concrete enum so if the step was created it must have a valid type.
        // Verify description is non-empty.
        XCTAssertFalse(
            step.description.isEmpty,
            "Step \(index) should have a non-empty description",
            file: file,
            line: line
        )

        // Verify pseudocode line is non-negative.
        XCTAssertGreaterThanOrEqual(
            step.pseudocodeLine, 0,
            "Step \(index) pseudocodeLine should be >= 0",
            file: file,
            line: line
        )
    }
}

/// Verifies that the last step's array is sorted in non-decreasing order.
/// Intended for sorting algorithms only.
func assertFinalArraySorted(_ steps: [AlgorithmStep], file: StaticString = #filePath, line: UInt = #line) {
    guard let lastStep = steps.last else {
        XCTFail("Steps array is empty; cannot check final array", file: file, line: line)
        return
    }

    let array = lastStep.array
    guard array.count > 1 else { return } // 0 or 1 element is trivially sorted

    for i in 0..<(array.count - 1) {
        XCTAssertLessThanOrEqual(
            array[i], array[i + 1],
            "Final array not sorted at index \(i): \(array[i]) > \(array[i + 1]). Full array: \(array)",
            file: file,
            line: line
        )
    }
}

/// Verifies that all highlighted, secondary, and sorted indices in every step
/// are within the bounds of that step's array.
func assertIndicesInBounds(_ steps: [AlgorithmStep], file: StaticString = #filePath, line: UInt = #line) {
    for (index, step) in steps.enumerated() {
        let arrayCount = step.array.count

        for highlightedIndex in step.highlightedIndices {
            XCTAssertTrue(
                highlightedIndex >= 0 && highlightedIndex < arrayCount,
                "Step \(index): highlightedIndex \(highlightedIndex) out of bounds for array of size \(arrayCount)",
                file: file,
                line: line
            )
        }

        for secondaryIndex in step.secondaryIndices {
            XCTAssertTrue(
                secondaryIndex >= 0 && secondaryIndex < arrayCount,
                "Step \(index): secondaryIndex \(secondaryIndex) out of bounds for array of size \(arrayCount)",
                file: file,
                line: line
            )
        }

        for sortedIndex in step.sortedIndices {
            XCTAssertTrue(
                sortedIndex >= 0 && sortedIndex < arrayCount,
                "Step \(index): sortedIndex \(sortedIndex) out of bounds for array of size \(arrayCount)",
                file: file,
                line: line
            )
        }
    }
}

/// Verifies that all step types in the array belong to the known StepType enum cases.
/// Because StepType is a concrete Swift enum, this is effectively a compile-time guarantee,
/// but this helper validates them at runtime for documentation and future-proofing.
func assertStepTypesValid(_ steps: [AlgorithmStep], file: StaticString = #filePath, line: UInt = #line) {
    let validTypes: Set<StepType> = [
        .compare, .swap, .sorted, .passComplete,
        .insert, .remove, .highlight, .traverse, .select
    ]

    for (index, step) in steps.enumerated() {
        XCTAssertTrue(
            validTypes.contains(step.type),
            "Step \(index) has unexpected type: \(step.type)",
            file: file,
            line: line
        )
    }
}
