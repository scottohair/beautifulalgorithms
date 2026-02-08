import SwiftUI

struct VisualizationScreen: View {
    @Bindable var viewModel: VisualizationViewModel

    var body: some View {
        VStack(spacing: 0) {
            // Header
            header

            // Main content
            HStack(spacing: 16) {
                // Visualization area
                VStack(spacing: 16) {
                    GlassCard {
                        SortingCanvas(step: viewModel.engine.currentStep)
                            .padding(20)
                            .frame(maxWidth: .infinity, maxHeight: .infinity)
                    }

                    PlaybackControlBar(engine: viewModel.engine)
                }

                // Side panel
                VStack(spacing: 16) {
                    // Info panel
                    if let algo = viewModel.currentAlgorithm {
                        GlassCard {
                            VStack(alignment: .leading, spacing: 8) {
                                Text(algo.name)
                                    .font(.system(size: 20, weight: .semibold))
                                    .foregroundColor(.white)

                                HStack(spacing: 8) {
                                    NeonBadge(text: algo.timeComplexity.average)
                                    NeonBadge(text: "Space: \(algo.spaceComplexity)", color: Color(red: 0.659, green: 0.333, blue: 0.969))
                                }

                                if let step = viewModel.engine.currentStep {
                                    Text(step.description)
                                        .font(.system(size: 13))
                                        .foregroundColor(Color(red: 0.631, green: 0.631, blue: 0.667))
                                        .padding(.top, 4)
                                }
                            }
                            .padding(16)
                            .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }

                    // Code panel
                    if let algo = viewModel.currentAlgorithm {
                        CodePanel(
                            pseudocode: algo.pseudocode,
                            currentLine: viewModel.engine.currentStep?.pseudocodeLine ?? -1
                        )
                    }

                    Spacer()

                    // Generate random input button
                    Button(action: { viewModel.generateRandomInput() }) {
                        HStack {
                            Image(systemName: "shuffle")
                            Text("Random Input")
                        }
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(red: 0, green: 0.941, blue: 1))
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(
                            Capsule()
                                .fill(Color(red: 0, green: 0.941, blue: 1).opacity(0.1))
                                .overlay(
                                    Capsule()
                                        .stroke(Color(red: 0, green: 0.941, blue: 1).opacity(0.3), lineWidth: 1)
                                )
                        )
                    }
                    .buttonStyle(.plain)
                }
                .frame(width: 280)
            }
            .padding(16)
        }
        .background(Color(red: 0.039, green: 0.039, blue: 0.043))
    }

    private var header: some View {
        HStack {
            Text("Aesthetic Algorithm")
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(.white)

            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(
            Color(red: 0.039, green: 0.039, blue: 0.043)
                .overlay(
                    Rectangle()
                        .fill(Color.white.opacity(0.06))
                        .frame(height: 1),
                    alignment: .bottom
                )
        )
    }
}
