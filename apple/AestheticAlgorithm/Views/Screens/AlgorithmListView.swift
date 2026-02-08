import SwiftUI

struct AlgorithmListView: View {
    @Bindable var viewModel: VisualizationViewModel

    var body: some View {
        List {
            Section {
                ForEach(viewModel.availableAlgorithms, id: \.id) { algorithm in
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
            } header: {
                Text("SORTING")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.443, green: 0.443, blue: 0.478))
            }
        }
        .listStyle(.sidebar)
        .scrollContentBackground(.hidden)
        .background(Color(red: 0.039, green: 0.039, blue: 0.043))
    }
}
