import Foundation

/// Represents the type of visualization step
enum StepType: String, Codable {
    case compare
    case swap
    case sorted
    case passComplete = "pass-complete"
    case insert
    case remove
    case highlight
    case traverse
    case select
}

/// A single step in an algorithm's execution
struct AlgorithmStep: Identifiable, Equatable {
    let id = UUID()
    let type: StepType
    let array: [Int]
    let highlightedIndices: [Int]
    let secondaryIndices: [Int]
    let sortedIndices: [Int]
    let pseudocodeLine: Int
    let description: String

    static func == (lhs: AlgorithmStep, rhs: AlgorithmStep) -> Bool {
        lhs.id == rhs.id
    }
}

/// Protocol that all algorithm implementations must conform to
protocol AlgorithmExecutable {
    var id: String { get }
    var name: String { get }
    var category: String { get }
    var timeComplexity: (best: String, average: String, worst: String) { get }
    var spaceComplexity: String { get }
    var pseudocode: [(line: Int, text: String)] { get }

    func generateSteps(from input: [Int]) -> [AlgorithmStep]
}
