# Changelog

All notable changes to ASTRO VOID will be documented in this file.

## [1.0.0] - 2026-08-19
### Added
- First public release of ASTRO VOID.
- Three distinct Game Modes: Classic, Survival, and Zen Void.
- Selectable Threat Levels: Easy, Normal, and Hard to tune hostile pressure and physics.
- Massive multi-phase boss encounters at Waves 5 (Dreadnought), 10 (Core Severance), and 15 (Grid Architect).
- Complex physics-based power-up ecosystem (Hyper Laser, EMP, Time Warp, Kinetic Repulsor, etc.).
- Robust Touch/Mobile support with dynamic on-screen dual-stick controls.
- Distinct audio landscape and high-performance neon vector presentation via HTML5 Canvas.

### Changed
- Balanced the extra-ship economy: implemented escalating score thresholds to maintain late-game stakes.
- Normalized Hyper Laser Cannon boss collisions: implemented a per-target hit cooldown (4 frames) to preserve piercing crowd-control capabilities while preventing instantaneous boss deletion.

### Fixed
- Hardened start-screen and audio lifecycle behavior across mobile browsers.
- Solidified wave completion and progression logic to ensure robust state transitions in deep runs.
