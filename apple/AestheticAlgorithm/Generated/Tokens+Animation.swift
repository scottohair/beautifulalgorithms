import SwiftUI

enum AnimationTokens {
    /// Instant feedback (ms)
    static let durationInstant: Double = 0.1
    /// Quick transitions (ms)
    static let durationFast: Double = 0.2
    /// Standard transitions (ms)
    static let durationNormal: Double = 0.3
    /// Emphasized transitions (ms)
    static let durationSlow: Double = 0.5
    /// Algorithm step animation (ms)
    static let durationVisualization: Double = 0.4
    /// Element swap animation (ms)
    static let durationSwap: Double = 0.35
    /// Element compare highlight (ms)
    static let durationCompare: Double = 0.25
    static let easingDefault = "cubic-bezier(0.4, 0, 0.2, 1)"
    static let easingIn = "cubic-bezier(0.4, 0, 1, 1)"
    static let easingOut = "cubic-bezier(0, 0, 0.2, 1)"
    static let easingInOut = "cubic-bezier(0.4, 0, 0.2, 1)"
    static let easingSpring = "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    static let easingBounce = "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    static let speedMin: Double = 0.25
    static let speedDefault: Double = 1.0
    static let speedMax: Double = 8.0
}
