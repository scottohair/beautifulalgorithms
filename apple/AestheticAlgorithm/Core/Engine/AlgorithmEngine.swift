import SwiftUI
import Combine

enum PlaybackState {
    case idle
    case playing
    case paused
    case finished
}

@Observable
class AlgorithmEngine {
    private(set) var steps: [AlgorithmStep] = []
    private(set) var currentStepIndex: Int = 0
    private(set) var playbackState: PlaybackState = .idle
    var speed: Double = 1.0

    private var timer: AnyCancellable?

    var currentStep: AlgorithmStep? {
        guard currentStepIndex >= 0 && currentStepIndex < steps.count else { return nil }
        return steps[currentStepIndex]
    }

    var progress: Double {
        guard !steps.isEmpty else { return 0 }
        return Double(currentStepIndex) / Double(steps.count - 1)
    }

    var totalSteps: Int { steps.count }

    func load(algorithm: AlgorithmExecutable, input: [Int]) {
        stop()
        steps = algorithm.generateSteps(from: input)
        currentStepIndex = 0
        playbackState = steps.isEmpty ? .idle : .paused
    }

    func play() {
        guard !steps.isEmpty else { return }
        guard playbackState != .playing else { return }
        if currentStepIndex >= steps.count - 1 {
            currentStepIndex = 0
        }
        playbackState = .playing
        startTimer()
    }

    func pause() {
        playbackState = .paused
        timer?.cancel()
        timer = nil
    }

    func stop() {
        pause()
        currentStepIndex = 0
        playbackState = .idle
    }

    func stepForward() {
        guard currentStepIndex < steps.count - 1 else {
            playbackState = .finished
            return
        }
        currentStepIndex += 1
        if currentStepIndex >= steps.count - 1 {
            playbackState = .finished
            timer?.cancel()
            timer = nil
        }
    }

    func stepBackward() {
        guard currentStepIndex > 0 else { return }
        currentStepIndex -= 1
        if playbackState == .finished {
            playbackState = .paused
        }
    }

    func seek(to index: Int) {
        let clamped = max(0, min(index, steps.count - 1))
        currentStepIndex = clamped
        if clamped >= steps.count - 1 {
            playbackState = .finished
            timer?.cancel()
            timer = nil
        }
    }

    func reset() {
        stop()
        steps = []
        playbackState = .idle
    }

    private func startTimer() {
        timer?.cancel()
        let interval = 0.4 / speed
        timer = Timer.publish(every: interval, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.stepForward()
            }
    }

    func setSpeed(_ newSpeed: Double) {
        speed = max(0.25, min(8.0, newSpeed))
        if playbackState == .playing {
            startTimer()
        }
    }
}
