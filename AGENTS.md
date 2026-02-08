# Aesthetic Algorithm - Codex Agent Guide

## Project Overview
Cross-platform algorithm visualization app (iOS, macOS, Web) with dark modern aesthetic (glassmorphism, neon accents). Renders 50+ algorithm visualizations with shared design tokens and algorithm specifications.

## Architecture
- **design-tokens/**: Style Dictionary pipeline. Source JSONs in `src/`, outputs to `apple/.../Generated/` and `web/src/generated/`
- **algorithm-specs/**: Shared algorithm spec JSONs. Both platforms implement against these for parity
- **apple/**: SwiftUI multiplatform app (iOS 17+, macOS 14+). MVVM with `AlgorithmExecutable` protocol
- **web/**: Next.js 15 app with App Router, Tailwind, Zustand, D3.js
- **bridge/**: Node.js/Express Figma bridge service (TypeScript)
- **scripts/**: Build orchestration scripts

## Key Conventions

### Design Tokens
- All visual values come from design tokens, never hardcoded
- Run `cd design-tokens && npm run build` to regenerate after token changes
- Swift tokens: `apple/AestheticAlgorithm/Generated/Tokens+*.swift`
- Web tokens: `web/src/generated/tokens.css` and `tokens.ts`

### Algorithm Specs
- Located in `algorithm-specs/{category}/{name}.algo.json`
- Define metadata, complexity, pseudocode, step types, test cases
- Both platforms must produce identical step sequences for the same input

### Swift/SwiftUI (apple/)
- Target iOS 17+ and macOS 14+
- MVVM architecture
- Protocol: `AlgorithmExecutable` - all algorithms conform to this
- Engine: `AlgorithmEngine` handles playback (play/pause/step/speed/seek)
- Use `Canvas` + `TimelineView` for rendering
- Navigation: `NavigationSplitView` (macOS), `NavigationStack` (iOS)

### Next.js/React (web/)
- Next.js 15 with App Router
- Route: `app/algorithms/[category]/[algorithm]/page.tsx`
- State: Zustand stores
- Rendering: HTML5 Canvas for sorting, D3.js SVG for trees/graphs
- Generator-based algorithm implementations (`function*`)

### Styling
- Dark theme: backgrounds #0a0a0b → #1a1a1f
- Neon accents: cyan #00f0ff, purple #a855f7, pink #ec4899, green #10b981
- Glassmorphism: backdrop-blur, semi-transparent borders, glass fills
- All colors use semantic visualization tokens (comparing, swapping, sorted, active, pivot, visited, path)

## Task Ownership
Codex can work on any of these independently:
1. **New algorithm implementations** - Add to both `apple/Algorithms/` and `web/src/algorithms/`
2. **Algorithm specs** - Create new specs in `algorithm-specs/`
3. **Web components** - Build visualization components in `web/src/components/`
4. **Bridge service** - Implement Figma/Canva API integration in `bridge/`
5. **Tests** - Algorithm correctness tests, parity validation scripts

## Testing
- Swift: XCTest in `apple/AestheticAlgorithmTests/`
- Web: Vitest, test files colocated as `*.test.ts`
- Parity: `scripts/validate-parity.js` compares step sequences across platforms

## Build Commands
```bash
make tokens        # Rebuild design tokens
make web-dev       # Start Next.js dev server
make web-build     # Production build web
make bridge-dev    # Start bridge service
make test          # Run all tests
make test-parity   # Validate cross-platform parity
```
