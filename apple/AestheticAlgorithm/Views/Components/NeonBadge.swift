import SwiftUI

struct NeonBadge: View {
    let text: String
    var color: Color = Color(red: 0, green: 0.941, blue: 1) // cyan

    var body: some View {
        Text(text)
            .font(.system(size: 11, weight: .semibold, design: .monospaced))
            .tracking(0.5)
            .foregroundColor(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(
                Capsule()
                    .fill(color.opacity(0.15))
                    .overlay(
                        Capsule()
                            .stroke(color.opacity(0.3), lineWidth: 1)
                    )
            )
            .shadow(color: color.opacity(0.3), radius: 4, x: 0, y: 0)
    }
}
