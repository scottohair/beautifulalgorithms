import SwiftUI

struct PlaybackControlBar: View {
    @Bindable var engine: AlgorithmEngine

    var body: some View {
        GlassCard {
            VStack(spacing: 12) {
                // Progress bar
                GeometryReader { geometry in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color.white.opacity(0.1))
                            .frame(height: 4)

                        RoundedRectangle(cornerRadius: 2)
                            .fill(
                                LinearGradient(
                                    colors: [Color(red: 0, green: 0.941, blue: 1), Color(red: 0.659, green: 0.333, blue: 0.969)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: geometry.size.width * engine.progress, height: 4)
                    }
                }
                .frame(height: 4)
                .onTapGesture { location in
                    // Seek on tap - simplified
                }

                HStack(spacing: 20) {
                    // Step count
                    Text("\(engine.currentStepIndex + 1)/\(engine.totalSteps)")
                        .font(.system(size: 13, design: .monospaced))
                        .foregroundColor(Color(red: 0.631, green: 0.631, blue: 0.667))
                        .frame(width: 60)

                    Spacer()

                    // Controls
                    Button(action: { engine.stepBackward() }) {
                        Image(systemName: "backward.frame.fill")
                            .foregroundColor(.white)
                    }
                    .buttonStyle(.plain)

                    Button(action: {
                        if engine.playbackState == .playing {
                            engine.pause()
                        } else {
                            engine.play()
                        }
                    }) {
                        Image(systemName: engine.playbackState == .playing ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 32))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [Color(red: 0, green: 0.941, blue: 1), Color(red: 0.659, green: 0.333, blue: 0.969)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                    }
                    .buttonStyle(.plain)

                    Button(action: { engine.stepForward() }) {
                        Image(systemName: "forward.frame.fill")
                            .foregroundColor(.white)
                    }
                    .buttonStyle(.plain)

                    Button(action: { engine.stop() }) {
                        Image(systemName: "stop.fill")
                            .foregroundColor(Color(red: 0.631, green: 0.631, blue: 0.667))
                    }
                    .buttonStyle(.plain)

                    Spacer()

                    // Speed control
                    HStack(spacing: 4) {
                        Text("\(String(format: "%.1f", engine.speed))x")
                            .font(.system(size: 13, design: .monospaced))
                            .foregroundColor(Color(red: 0.631, green: 0.631, blue: 0.667))

                        Slider(value: Binding(
                            get: { engine.speed },
                            set: { engine.setSpeed($0) }
                        ), in: 0.25...8.0, step: 0.25)
                        .frame(width: 80)
                        .tint(Color(red: 0, green: 0.941, blue: 1))
                    }
                    .frame(width: 140)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
    }
}
