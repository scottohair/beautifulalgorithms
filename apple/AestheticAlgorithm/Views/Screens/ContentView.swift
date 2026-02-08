import SwiftUI

struct ContentView: View {
    @Bindable var viewModel: VisualizationViewModel

    var body: some View {
        #if os(macOS)
        NavigationSplitView {
            AlgorithmListView(viewModel: viewModel)
                .navigationSplitViewColumnWidth(min: 200, ideal: 240, max: 300)
        } detail: {
            if viewModel.currentAlgorithm != nil {
                VisualizationScreen(viewModel: viewModel)
            } else {
                emptyState
            }
        }
        .background(Color(red: 0.039, green: 0.039, blue: 0.043))
        #else
        NavigationStack {
            AlgorithmListView(viewModel: viewModel)
                .navigationTitle("Algorithms")
                .navigationDestination(item: Binding(
                    get: { viewModel.currentAlgorithm.map { $0.id } },
                    set: { _ in }
                )) { _ in
                    VisualizationScreen(viewModel: viewModel)
                }
        }
        #endif
    }

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "function")
                .font(.system(size: 48))
                .foregroundStyle(
                    LinearGradient(
                        colors: [Color(red: 0, green: 0.941, blue: 1), Color(red: 0.659, green: 0.333, blue: 0.969)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )

            Text("Select an Algorithm")
                .font(.system(size: 20, weight: .semibold))
                .foregroundColor(.white)

            Text("Choose an algorithm from the sidebar to visualize")
                .font(.system(size: 15))
                .foregroundColor(Color(red: 0.631, green: 0.631, blue: 0.667))
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(Color(red: 0.039, green: 0.039, blue: 0.043))
    }
}
