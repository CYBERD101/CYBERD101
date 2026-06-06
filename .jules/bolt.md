
## 2024-06-06 - Baseline Performance Measurement
**Learning:** High-frequency mouse movement and typing trigger massive redundant re-renders across the entire component tree.
- App render: 64
- MatrixBackground render: 64
- MouseFollower render: 84
- HackerAvatar render: 64
These components should not re-render when the mouse moves or when typing in the terminal, unless state explicitly changes (e.g. status or messages).
**Action:** Implement React.memo, useMemo for stable props, and useRef for mouse tracking to eliminate these redundant renders.

## 2024-06-06 - Performance Optimization Success
**Learning:** React.memo, useMemo, and useRef for high-frequency events (mouse movement) significantly reduced re-renders.
- MatrixBackground re-renders: 64 -> 2 (initial mount in StrictMode)
- MouseFollower re-renders: 84 -> 2
- HackerAvatar re-renders: 64 -> 2
- Total app re-renders remained constant for typing (since it updates 'input' state), but child components are now skipped.
**Action:** Always prefer useRef + direct DOM manipulation for 60fps tracking animations in React to bypass the reconciliation cycle.
