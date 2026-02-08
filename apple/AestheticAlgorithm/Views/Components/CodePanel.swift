import SwiftUI

struct CodePanel: View {
    let pseudocode: [(line: Int, text: String)]
    let currentLine: Int

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 0) {
                Text("PSEUDOCODE")
                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                    .tracking(2)
                    .foregroundColor(Color(red: 0.443, green: 0.443, blue: 0.478))
                    .padding(.horizontal, 16)
                    .padding(.top, 12)
                    .padding(.bottom, 8)

                ScrollView {
                    VStack(alignment: .leading, spacing: 0) {
                        ForEach(pseudocode, id: \.line) { item in
                            HStack(spacing: 0) {
                                Text(String(format: "%2d", item.line + 1))
                                    .font(.system(size: 13, design: .monospaced))
                                    .foregroundColor(Color(red: 0.443, green: 0.443, blue: 0.478))
                                    .frame(width: 30, alignment: .trailing)
                                    .padding(.trailing, 12)

                                Text(item.text)
                                    .font(.system(size: 13, design: .monospaced))
                                    .foregroundColor(item.line == currentLine ? .white : Color(red: 0.631, green: 0.631, blue: 0.667))
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 4)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(
                                item.line == currentLine
                                ? Color(red: 0, green: 0.941, blue: 1).opacity(0.1)
                                : Color.clear
                            )
                            .overlay(alignment: .leading) {
                                if item.line == currentLine {
                                    Rectangle()
                                        .fill(Color(red: 0, green: 0.941, blue: 1))
                                        .frame(width: 2)
                                }
                            }
                        }
                    }
                }
            }
            .padding(.bottom, 8)
        }
    }
}
