## 2026-06-10 - High-frequency UI updates bottleneck
**Learning:** High-frequency state updates (e.g., mouse movement) in React cause significant performance degradation due to constant reconciliation and re-rendering of the component tree.
**Action:** Use `useRef` for direct DOM manipulation and `translate3d` for hardware-accelerated positioning to bypass React's render cycle for 60fps UI elements.
