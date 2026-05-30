## 2025-05-15 - [Optimized High-Frequency UI Updates]
**Learning:** React state updates for high-frequency events (like `mousemove`) cause excessive re-renders that can drop frames below 60fps, especially when the component tree is complex.
**Action:** Use `useRef` for DOM elements and update styles directly (e.g., `translate3d`) within event listeners. Apply `will-change: transform` to promote elements to their own compositor layer. Combine with `React.memo` to shield static components from parent re-renders.
