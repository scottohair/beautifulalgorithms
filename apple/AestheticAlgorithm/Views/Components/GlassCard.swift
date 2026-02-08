import SwiftUI

struct GlassCard<Content: View>: View {
    let content: Content
    var cornerRadius: CGFloat = 12

    init(cornerRadius: CGFloat = 12, @ViewBuilder content: () -> Content) {
        self.cornerRadius = cornerRadius
        self.content = content()
    }

    var body: some View {
        content
            .background(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .fill(.ultraThinMaterial)
                    .overlay(
                        RoundedRectangle(cornerRadius: cornerRadius)
                            .fill(Color.white.opacity(0.05))
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: cornerRadius)
                            .stroke(Color.white.opacity(0.08), lineWidth: 1)
                    )
            )
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
    }
}
