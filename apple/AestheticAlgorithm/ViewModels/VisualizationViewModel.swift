import SwiftUI

@Observable
class VisualizationViewModel {
    let engine = AlgorithmEngine()
    var currentAlgorithm: (any AlgorithmExecutable)?
    var inputArray: [Int] = [64, 34, 25, 12, 22, 11, 90, 45, 78, 33]

    var availableAlgorithms: [any AlgorithmExecutable] = [
        BubbleSort(),
        InsertionSort(),
        SelectionSort(),
        MergeSort(),
        QuickSort(),
        HeapSort(),
        StackAlgorithm(),
        QueueAlgorithm(),
        BSTAlgorithm(),
        LinkedListAlgorithm(),
        AVLTreeAlgorithm(),
        HashTableAlgorithm(),
        BFSAlgorithm(),
        DFSAlgorithm(),
        RedBlackTreeAlgorithm(),
        SplayTreeAlgorithm(),
        TrieAlgorithm(),
        BTreeAlgorithm(),
        MinHeapAlgorithm(),
        BinomialQueueAlgorithm(),
        FibonacciHeapAlgorithm(),
        LeftistHeapAlgorithm(),
        SkewHeapAlgorithm(),
        DisjointSetsAlgorithm(),
        HuffmanCodingAlgorithm(),
        DijkstraAlgorithm(),
        PrimAlgorithm(),
        KruskalAlgorithm(),
        ShellSort(),
        CountingSort(),
        FibonacciAlgorithm(),
        ChangeMakingAlgorithm(),
        LCSAlgorithm(),
        NQueensAlgorithm(),
        FloydWarshallAlgorithm(),
        TopologicalSortAlgorithm()
    ]

    func selectAlgorithm(_ algorithm: any AlgorithmExecutable) {
        currentAlgorithm = algorithm
        engine.load(algorithm: algorithm, input: inputArray)
    }

    func generateRandomInput(count: Int = 10) {
        inputArray = (0..<count).map { _ in Int.random(in: 1...100) }
        if let algo = currentAlgorithm {
            engine.load(algorithm: algo, input: inputArray)
        }
    }

    func loadDefaultInput() {
        if let algo = currentAlgorithm {
            engine.load(algorithm: algo, input: inputArray)
        }
    }
}
