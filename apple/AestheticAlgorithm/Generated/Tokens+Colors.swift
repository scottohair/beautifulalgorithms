import SwiftUI

extension Color {
    /// Main app background
    static let backgroundPrimary = Color(red: 0.039, green: 0.039, blue: 0.043)
    /// Card/panel background
    static let backgroundSecondary = Color(red: 0.067, green: 0.067, blue: 0.078)
    /// Elevated surface
    static let backgroundTertiary = Color(red: 0.102, green: 0.102, blue: 0.122)
    /// Glassmorphism fill
    static let backgroundGlass = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Glassmorphism hover
    static let backgroundGlassHover = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Glassmorphism active
    static let backgroundGlassActive = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Primary text
    static let textPrimary = Color(red: 0.961, green: 0.961, blue: 0.969)
    /// Secondary/muted text
    static let textSecondary = Color(red: 0.631, green: 0.631, blue: 0.667)
    /// Disabled/hint text
    static let textTertiary = Color(red: 0.443, green: 0.443, blue: 0.478)
    /// Text on light backgrounds
    static let textInverse = Color(red: 0.039, green: 0.039, blue: 0.043)
    /// Default border
    static let borderDefault = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Subtle border
    static let borderSubtle = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Strong border
    static let borderStrong = Color(red: 1.000, green: 1.000, blue: 1.000)
    /// Primary accent - cyan neon
    static let accentCyan = Color(red: 0.000, green: 0.941, blue: 1.000)
    /// Secondary accent - purple
    static let accentPurple = Color(red: 0.659, green: 0.333, blue: 0.969)
    /// Tertiary accent - pink
    static let accentPink = Color(red: 0.925, green: 0.282, blue: 0.600)
    /// Success/positive accent
    static let accentGreen = Color(red: 0.063, green: 0.725, blue: 0.506)
    /// Warning accent
    static let accentOrange = Color(red: 0.976, green: 0.451, blue: 0.086)
    /// Error/destructive accent
    static let accentRed = Color(red: 0.937, green: 0.267, blue: 0.267)
    /// Elements being compared
    static let visualizationComparing = Color(red: 0.000, green: 0.941, blue: 1.000)
    /// Elements being swapped
    static let visualizationSwapping = Color(red: 0.925, green: 0.282, blue: 0.600)
    /// Elements in final position
    static let visualizationSorted = Color(red: 0.063, green: 0.725, blue: 0.506)
    /// Currently active element
    static let visualizationActive = Color(red: 0.659, green: 0.333, blue: 0.969)
    /// Pivot element
    static let visualizationPivot = Color(red: 0.976, green: 0.451, blue: 0.086)
    /// Visited node/element
    static let visualizationVisited = Color(red: 0.388, green: 0.400, blue: 0.945)
    /// Path/route highlight
    static let visualizationPath = Color(red: 0.984, green: 0.749, blue: 0.141)
    /// Default/unsorted element
    static let visualizationDefault = Color(red: 0.247, green: 0.247, blue: 0.275)
    /// Inactive/dimmed element
    static let visualizationInactive = Color(red: 0.153, green: 0.153, blue: 0.165)
    /// Cyan glow effect
    static let glowCyan = Color(red: 0.000, green: 0.941, blue: 1.000)
    /// Purple glow effect
    static let glowPurple = Color(red: 0.659, green: 0.333, blue: 0.969)
    /// Pink glow effect
    static let glowPink = Color(red: 0.925, green: 0.282, blue: 0.600)
    /// Green glow effect
    static let glowGreen = Color(red: 0.063, green: 0.725, blue: 0.506)
}
