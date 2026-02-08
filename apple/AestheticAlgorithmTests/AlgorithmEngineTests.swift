import XCTest
@testable import AestheticAlgorithm

// MARK: - AlgorithmEngine Tests

final class AlgorithmEngineTests: XCTestCase {

    private var engine: AlgorithmEngine!

    override func setUp() {
        super.setUp()
        engine = AlgorithmEngine()
    }

    override func tearDown() {
        engine = nil
        super.tearDown()
    }

    // MARK: - Helpers

    /// Loads a BubbleSort algorithm with a small input to populate the engine with steps.
    private func loadDefaultAlgorithm() {
        let algorithm = BubbleSort()
        let input = [5, 3, 1, 4, 2]
        engine.load(algorithm: algorithm, input: input)
    }

    // MARK: - Test: Initial State

    func testInitialStateIsIdle() {
        XCTAssertEqual(engine.playbackState, .idle)
        XCTAssertEqual(engine.currentStepIndex, 0)
        XCTAssertTrue(engine.steps.isEmpty)
        XCTAssertNil(engine.currentStep)
        XCTAssertEqual(engine.progress, 0)
        XCTAssertEqual(engine.totalSteps, 0)
    }

    func testInitialSpeedIsOne() {
        XCTAssertEqual(engine.speed, 1.0)
    }

    // MARK: - Test: Load

    func testLoadPopulatesSteps() {
        loadDefaultAlgorithm()
        XCTAssertFalse(engine.steps.isEmpty, "Engine should have steps after loading")
        XCTAssertGreaterThan(engine.totalSteps, 0)
    }

    func testLoadSetsStateToPaused() {
        loadDefaultAlgorithm()
        XCTAssertEqual(engine.playbackState, .paused, "Engine should be paused after loading")
    }

    func testLoadResetsStepIndex() {
        loadDefaultAlgorithm()
        XCTAssertEqual(engine.currentStepIndex, 0, "Step index should be 0 after loading")
    }

    func testLoadCurrentStepIsFirstStep() {
        loadDefaultAlgorithm()
        XCTAssertNotNil(engine.currentStep, "Current step should be non-nil after loading")
        XCTAssertEqual(engine.currentStep?.array, engine.steps.first?.array)
    }

    func testLoadWithEmptyStepsKeepsIdle() {
        // If generateSteps returns empty, the engine should remain idle.
        // We test this by loading with empty input if the algorithm returns no steps.
        let algorithm = BubbleSort()
        engine.load(algorithm: algorithm, input: [])
        // BubbleSort with empty input may or may not produce steps;
        // if it produces none, state should be idle.
        if engine.steps.isEmpty {
            XCTAssertEqual(engine.playbackState, .idle)
        } else {
            XCTAssertEqual(engine.playbackState, .paused)
        }
    }

    func testLoadReplacesExistingSteps() {
        loadDefaultAlgorithm()
        let firstCount = engine.totalSteps

        let algorithm = InsertionSort()
        engine.load(algorithm: algorithm, input: [10, 20, 30])
        XCTAssertNotEqual(engine.totalSteps, 0)
        // Steps should differ because the algorithm and input changed.
        // The exact count depends on implementation, but the engine should be freshly loaded.
        XCTAssertEqual(engine.currentStepIndex, 0)
        XCTAssertEqual(engine.playbackState, .paused)
    }

    // MARK: - Test: Play

    func testPlaySetsStatePlaying() {
        loadDefaultAlgorithm()
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing, "Engine should be playing after play()")
    }

    func testPlayWithNoStepsDoesNothing() {
        engine.play()
        XCTAssertEqual(engine.playbackState, .idle, "Engine should remain idle if no steps loaded")
    }

    func testPlayWhenAlreadyPlayingDoesNotRestart() {
        loadDefaultAlgorithm()
        engine.play()
        // Manually advance a few steps.
        engine.stepForward()
        engine.stepForward()
        let indexBeforeSecondPlay = engine.currentStepIndex

        engine.play()
        // Should still be playing, not reset to 0.
        XCTAssertEqual(engine.playbackState, .playing)
        XCTAssertEqual(engine.currentStepIndex, indexBeforeSecondPlay)
    }

    func testPlayFromFinishedResetsToBeginning() {
        loadDefaultAlgorithm()
        // Seek to end.
        engine.seek(to: engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)

        // Play should restart from the beginning.
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing)
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    // MARK: - Test: Pause

    func testPauseSetsStatePaused() {
        loadDefaultAlgorithm()
        engine.play()
        engine.pause()
        XCTAssertEqual(engine.playbackState, .paused, "Engine should be paused after pause()")
    }

    func testPausePreservesCurrentStep() {
        loadDefaultAlgorithm()
        engine.stepForward()
        engine.stepForward()
        let indexBeforePause = engine.currentStepIndex
        engine.pause()
        XCTAssertEqual(engine.currentStepIndex, indexBeforePause)
    }

    // MARK: - Test: Step Forward

    func testStepForwardIncrementsIndex() {
        loadDefaultAlgorithm()
        let initialIndex = engine.currentStepIndex
        engine.stepForward()
        XCTAssertEqual(engine.currentStepIndex, initialIndex + 1)
    }

    func testStepForwardAtEndSetsFinished() {
        loadDefaultAlgorithm()
        // Advance to the last step.
        for _ in 0..<(engine.totalSteps - 1) {
            engine.stepForward()
        }
        XCTAssertEqual(engine.playbackState, .finished, "Engine should be finished at the last step")
    }

    func testStepForwardBeyondEndStaysAtEnd() {
        loadDefaultAlgorithm()
        // Advance past the end.
        for _ in 0..<(engine.totalSteps + 5) {
            engine.stepForward()
        }
        XCTAssertEqual(engine.currentStepIndex, engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)
    }

    func testStepForwardUpdatesCurrentStep() {
        loadDefaultAlgorithm()
        engine.stepForward()
        XCTAssertNotNil(engine.currentStep)
        XCTAssertEqual(engine.currentStep?.array, engine.steps[1].array)
    }

    // MARK: - Test: Step Backward

    func testStepBackwardDecrementsIndex() {
        loadDefaultAlgorithm()
        engine.stepForward()
        engine.stepForward()
        let indexBefore = engine.currentStepIndex
        engine.stepBackward()
        XCTAssertEqual(engine.currentStepIndex, indexBefore - 1)
    }

    func testStepBackwardAtBeginningStaysAtZero() {
        loadDefaultAlgorithm()
        engine.stepBackward()
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    func testStepBackwardFromFinishedSetsPaused() {
        loadDefaultAlgorithm()
        // Advance to the end.
        engine.seek(to: engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)

        engine.stepBackward()
        XCTAssertEqual(engine.playbackState, .paused, "Stepping back from finished should set paused")
        XCTAssertEqual(engine.currentStepIndex, engine.totalSteps - 2)
    }

    // MARK: - Test: Seek

    func testSeekToValidIndex() {
        loadDefaultAlgorithm()
        let targetIndex = engine.totalSteps / 2
        engine.seek(to: targetIndex)
        XCTAssertEqual(engine.currentStepIndex, targetIndex)
    }

    func testSeekToBeginning() {
        loadDefaultAlgorithm()
        engine.stepForward()
        engine.stepForward()
        engine.seek(to: 0)
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    func testSeekToEnd() {
        loadDefaultAlgorithm()
        engine.seek(to: engine.totalSteps - 1)
        XCTAssertEqual(engine.currentStepIndex, engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)
    }

    func testSeekBeyondEndClampsToLastStep() {
        loadDefaultAlgorithm()
        engine.seek(to: engine.totalSteps + 100)
        XCTAssertEqual(engine.currentStepIndex, engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)
    }

    func testSeekBelowZeroClampsToZero() {
        loadDefaultAlgorithm()
        engine.seek(to: -10)
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    // MARK: - Test: Reset

    func testResetClearsSteps() {
        loadDefaultAlgorithm()
        engine.reset()
        XCTAssertTrue(engine.steps.isEmpty, "Steps should be empty after reset")
        XCTAssertEqual(engine.totalSteps, 0)
    }

    func testResetSetsIdleState() {
        loadDefaultAlgorithm()
        engine.play()
        engine.reset()
        XCTAssertEqual(engine.playbackState, .idle)
    }

    func testResetResetsStepIndex() {
        loadDefaultAlgorithm()
        engine.stepForward()
        engine.stepForward()
        engine.reset()
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    func testResetMakesCurrentStepNil() {
        loadDefaultAlgorithm()
        engine.reset()
        XCTAssertNil(engine.currentStep)
    }

    // MARK: - Test: Stop

    func testStopResetsIndexButKeepsSteps() {
        loadDefaultAlgorithm()
        engine.stepForward()
        engine.stepForward()
        engine.stop()
        XCTAssertEqual(engine.currentStepIndex, 0)
        XCTAssertEqual(engine.playbackState, .idle)
        // stop() should NOT clear steps (that is reset's job based on implementation).
        // Looking at the implementation, stop() calls pause() then sets index to 0 and state to idle.
        // Steps remain. reset() additionally clears steps.
    }

    // MARK: - Test: Speed Changes

    func testSetSpeedUpdatesSpeed() {
        engine.setSpeed(2.0)
        XCTAssertEqual(engine.speed, 2.0)
    }

    func testSetSpeedClampsMinimum() {
        engine.setSpeed(0.1)
        XCTAssertEqual(engine.speed, 0.25, "Speed should be clamped to minimum 0.25")
    }

    func testSetSpeedClampsMaximum() {
        engine.setSpeed(100.0)
        XCTAssertEqual(engine.speed, 8.0, "Speed should be clamped to maximum 8.0")
    }

    func testSetSpeedAt025() {
        engine.setSpeed(0.25)
        XCTAssertEqual(engine.speed, 0.25)
    }

    func testSetSpeedAt8() {
        engine.setSpeed(8.0)
        XCTAssertEqual(engine.speed, 8.0)
    }

    func testSetSpeedDoesNotAffectIdleState() {
        engine.setSpeed(4.0)
        XCTAssertEqual(engine.playbackState, .idle)
    }

    // MARK: - Test: Progress Calculation

    func testProgressAtBeginningIsZero() {
        loadDefaultAlgorithm()
        XCTAssertEqual(engine.progress, 0.0, accuracy: 0.001)
    }

    func testProgressAtEndIsOne() {
        loadDefaultAlgorithm()
        engine.seek(to: engine.totalSteps - 1)
        XCTAssertEqual(engine.progress, 1.0, accuracy: 0.001)
    }

    func testProgressAtMidpoint() {
        loadDefaultAlgorithm()
        let midIndex = (engine.totalSteps - 1) / 2
        engine.seek(to: midIndex)
        let expectedProgress = Double(midIndex) / Double(engine.totalSteps - 1)
        XCTAssertEqual(engine.progress, expectedProgress, accuracy: 0.001)
    }

    func testProgressWithNoStepsIsZero() {
        XCTAssertEqual(engine.progress, 0.0)
    }

    // MARK: - Test: Playback State Machine Transitions

    func testIdleToPlaying() {
        loadDefaultAlgorithm()
        // After load, state is paused. We need to test idle -> play transition.
        engine.stop() // Goes to idle.
        XCTAssertEqual(engine.playbackState, .idle)
        // play() from idle with steps loaded should start playing.
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing)
    }

    func testPausedToPlaying() {
        loadDefaultAlgorithm()
        XCTAssertEqual(engine.playbackState, .paused)
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing)
    }

    func testPlayingToPaused() {
        loadDefaultAlgorithm()
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing)
        engine.pause()
        XCTAssertEqual(engine.playbackState, .paused)
    }

    func testFinishedToPlayingResetsIndex() {
        loadDefaultAlgorithm()
        engine.seek(to: engine.totalSteps - 1)
        XCTAssertEqual(engine.playbackState, .finished)
        engine.play()
        XCTAssertEqual(engine.playbackState, .playing)
        XCTAssertEqual(engine.currentStepIndex, 0)
    }

    // MARK: - Test: Multiple Load Cycles

    func testMultipleLoadCyclesDoNotAccumulate() {
        for _ in 0..<5 {
            loadDefaultAlgorithm()
        }
        // After multiple loads the engine should have exactly one set of steps.
        XCTAssertEqual(engine.currentStepIndex, 0)
        XCTAssertEqual(engine.playbackState, .paused)
    }

    func testLoadDifferentAlgorithms() {
        let bubble = BubbleSort()
        engine.load(algorithm: bubble, input: [3, 1, 2])
        let bubbleStepCount = engine.totalSteps

        let selection = SelectionSort()
        engine.load(algorithm: selection, input: [3, 1, 2])
        let selectionStepCount = engine.totalSteps

        // Different algorithms may produce different step counts for the same input.
        // Just verify the engine loaded properly each time.
        XCTAssertGreaterThan(bubbleStepCount, 0)
        XCTAssertGreaterThan(selectionStepCount, 0)
        XCTAssertEqual(engine.currentStepIndex, 0)
        XCTAssertEqual(engine.playbackState, .paused)
    }

    // MARK: - Test: Full Walkthrough

    func testManualStepThroughAllSteps() {
        loadDefaultAlgorithm()
        let totalSteps = engine.totalSteps
        XCTAssertGreaterThan(totalSteps, 0)

        // Step through every step one by one.
        for expectedIndex in 1..<totalSteps {
            engine.stepForward()
            XCTAssertEqual(engine.currentStepIndex, expectedIndex)
        }

        XCTAssertEqual(engine.playbackState, .finished)

        // Step all the way back.
        for expectedIndex in stride(from: totalSteps - 2, through: 0, by: -1) {
            engine.stepBackward()
            XCTAssertEqual(engine.currentStepIndex, expectedIndex)
        }

        XCTAssertEqual(engine.currentStepIndex, 0)
    }
}
