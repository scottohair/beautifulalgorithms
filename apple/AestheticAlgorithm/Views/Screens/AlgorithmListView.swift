import SwiftUI

struct AlgorithmListView: View {
    @Bindable var viewModel: VisualizationViewModel

    private var sortingAlgorithms: [any AlgorithmExecutable] {
        viewModel.availableAlgorithms.filter { $0.category == "sorting" }
    }

    private var dataStructureAlgorithms: [any AlgorithmExecutable] {
        viewModel.availableAlgorithms.filter { $0.category == "data-structures" }
    }

    private var graphAlgorithms: [any AlgorithmExecutable] {
        viewModel.availableAlgorithms.filter { $0.category == "graph" }
    }

    private var dpAlgorithms: [any AlgorithmExecutable] {
        viewModel.availableAlgorithms.filter { $0.category == "dynamic-programming" }
    }

    private var backtrackingAlgorithms: [any AlgorithmExecutable] {
        viewModel.availableAlgorithms.filter { $0.category == "backtracking" }
    }

    var body: some View {
        List {
            Section {
                ForEach(sortingAlgorithms, id: \.id) { algorithm in
                    algorithmRow(algorithm)
                }
            } header: {
                sectionHeader("SORTING")
            }

            Section {
                ForEach(dataStructureAlgorithms, id: \.id) { algorithm in
                    algorithmRow(algorithm)
                }
            } header: {
                sectionHeader("DATA STRUCTURES")
            }

            Section {
                ForEach(graphAlgorithms, id: \.id) { algorithm in
                    algorithmRow(algorithm)
                }
            } header: {
                sectionHeader("GRAPH")
            }

            Section {
                ForEach(dpAlgorithms, id: \.id) { algorithm in
                    algorithmRow(algorithm)
                }
            } header: {
                sectionHeader("DYNAMIC PROGRAMMING")
            }

            Section {
                ForEach(backtrackingAlgorithms, id: \.id) { algorithm in
                    algorithmRow(algorithm)
                }
            } header: {
                sectionHeader("BACKTRACKING")
            }
        }
        .listStyle(.sidebar)
        .scrollContentBackground(.hidden)
        .background(Color(red: 0.039, green: 0.039, blue: 0.043))
    }

    @ViewBuilder
    private func algorithmRow(_ algorithm: any AlgorithmExecutable) -> some View {
        Button(action: {
            viewModel.selectAlgorithm(algorithm)
        }) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(algorithm.name)
                        .font(.system(size: 15, weight: .medium))
                        .foregroundColor(.white)

                    Text(algorithm.timeComplexity.average)
                        .font(.system(size: 11, design: .monospaced))
                        .foregroundColor(Color(red: 0, green: 0.941, blue: 1))
                }

                Spacer()

                if viewModel.currentAlgorithm?.id == algorithm.id {
                    Circle()
                        .fill(Color(red: 0, green: 0.941, blue: 1))
                        .frame(width: 6, height: 6)
                }
            }
            .padding(.vertical, 4)
        }
        .buttonStyle(.plain)
    }

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(.system(size: 11, weight: .semibold, design: .monospaced))
            .tracking(2)
            .foregroundColor(Color(red: 0.443, green: 0.443, blue: 0.478))
    }
}
