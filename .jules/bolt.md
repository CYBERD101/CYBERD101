## 2025-05-15 - React Render Optimization
**Learning:** High-frequency state updates (like mouse tracking) in React can cause severe performance bottlenecks due to frequent reconciliation cycles. Using `useRef` for tracking coordinates and direct DOM manipulation with `translate3d` bypasses React's render loop for these updates, maintaining 60fps even under load.
**Action:** Always prefer refs and direct DOM manipulation for high-frequency UI updates (mouse tracking, scroll effects) in React to ensure optimal performance.
