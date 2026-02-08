# Aesthetic Algorithm - Claude Code Guide

## Project Overview
Cross-platform algorithm visualization app. See AGENTS.md for full architecture.

## Quick Reference
- Design tokens: `cd design-tokens && npm run build`
- Web dev: `cd web && npm run dev`
- Bridge: `cd bridge && npm run dev`
- All builds: `make all`

## Key Files
- Token source: `design-tokens/src/*.json`
- Token config: `design-tokens/config.js` (Style Dictionary v4, ESM)
- Swift protocols: `apple/AestheticAlgorithm/Core/Protocols/`
- Web types: `web/src/lib/types/algorithm.ts`
- Algorithm specs: `algorithm-specs/{category}/{name}.algo.json`

## Conventions
- All algorithms implement against shared specs for cross-platform parity
- Use design tokens for all visual values, never hardcode colors/spacing
- Swift: MVVM, Canvas+TimelineView rendering, NavigationSplitView/Stack
- Web: Next.js App Router, Zustand, generator-based algorithms, Canvas/D3
- Dark theme with glassmorphism aesthetic throughout
