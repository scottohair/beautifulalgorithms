import SwiftUI

@main
struct AestheticAlgorithmApp: App {
    @State private var viewModel = VisualizationViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView(viewModel: viewModel)
                .preferredColorScheme(.dark)
        }
        #if os(macOS)
        .defaultSize(width: 1200, height: 800)
        #endif
    }
}
