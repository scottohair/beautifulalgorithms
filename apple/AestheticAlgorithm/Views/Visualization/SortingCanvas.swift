import SwiftUI

struct SortingCanvas: View {
    let step: AlgorithmStep?

    private let barSpacing: CGFloat = 2

    var body: some View {
        Canvas { context, size in
            guard let step = step else { return }
            let array = step.array
            guard !array.isEmpty else { return }

            let maxVal = CGFloat(array.max() ?? 1)
            let barWidth = (size.width - CGFloat(array.count - 1) * barSpacing) / CGFloat(array.count)

            for (index, value) in array.enumerated() {
                let barHeight = (CGFloat(value) / maxVal) * (size.height - 20)
                let x = CGFloat(index) * (barWidth + barSpacing)
                let y = size.height - barHeight

                let rect = CGRect(x: x, y: y, width: barWidth, height: barHeight)
                let roundedRect = Path(roundedRect: rect, cornerRadius: min(barWidth / 4, 4))

                let color = barColor(for: index, step: step)
                context.fill(roundedRect, with: .color(color))

                // Glow effect for highlighted bars
                if step.highlightedIndices.contains(index) {
                    let glowColor = barColor(for: index, step: step).opacity(0.4)
                    context.fill(roundedRect, with: .color(glowColor))
                }

                // Value label on top of bar (if bar is wide enough)
                if barWidth > 20 {
                    let text = Text("\(value)")
                        .font(.system(size: min(barWidth * 0.4, 12), design: .monospaced))
                        .foregroundColor(.white)
                    let resolvedText = context.resolve(text)
                    let textSize = resolvedText.measure(in: CGSize(width: barWidth, height: 20))
                    context.draw(resolvedText, at: CGPoint(x: x + barWidth / 2, y: y - textSize.height / 2 - 2), anchor: .center)
                }
            }
        }
    }

    private func barColor(for index: Int, step: AlgorithmStep) -> Color {
        if step.sortedIndices.contains(index) {
            return Color(red: 0.063, green: 0.725, blue: 0.506) // green sorted
        }
        if step.highlightedIndices.contains(index) {
            switch step.type {
            case .compare:
                return Color(red: 0, green: 0.941, blue: 1) // cyan comparing
            case .swap:
                return Color(red: 0.925, green: 0.282, blue: 0.600) // pink swapping
            default:
                return Color(red: 0.659, green: 0.333, blue: 0.969) // purple active
            }
        }
        return Color(red: 0.247, green: 0.247, blue: 0.275) // default
    }
}
