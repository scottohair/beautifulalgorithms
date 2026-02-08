import SwiftUI

enum Typography {
    static let familySans = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    static let familyMono = "JetBrains Mono, SF Mono, Menlo, monospace"
    static let familyDisplay = "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    static let sizeXs: CGFloat = 11rem
    static let sizeSm: CGFloat = 13rem
    static let sizeBase: CGFloat = 15rem
    static let sizeLg: CGFloat = 17rem
    static let sizeXl: CGFloat = 20rem
    static let size2xl: CGFloat = 24rem
    static let size3xl: CGFloat = 30rem
    static let size4xl: CGFloat = 36rem
    static let sizeCode: CGFloat = 13rem
    static let weightRegular: Font.Weight = .init(rawValue: 400)
    static let weightMedium: Font.Weight = .init(rawValue: 500)
    static let weightSemibold: Font.Weight = .init(rawValue: 600)
    static let weightBold: Font.Weight = .init(rawValue: 700)
    static let lineHeightTight: CGFloat = 1.2
    static let lineHeightNormal: CGFloat = 1.5
    static let lineHeightRelaxed: CGFloat = 1.75
    static let lineHeightCode: CGFloat = 1.6
    static let letterSpacingTight = "-0.02em"
    static let letterSpacingNormal = "0"
    static let letterSpacingWide = "0.05em"
    static let letterSpacingCaps = "0.1em"
}
