## 2024-05-24 - Optimized High-Frequency UI Updates
**Learning:** Using React state for mouse tracking causes the entire component tree to re-render on every mouse movement, which is extremely inefficient for performance-heavy components like Matrix backgrounds.
**Action:** Use `useRef` and direct DOM manipulation with `translate3d` and `will-change: transform` for 60fps animations that bypass the React reconciliation cycle. Also, memoize heavy components to ensure they only re-render when their specific props change.
