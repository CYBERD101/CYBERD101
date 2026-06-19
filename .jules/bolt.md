# Bolt's Performance Journal

## 2025-05-15 - Optimizing High-Frequency UI Updates
**Learning:** Components that track global state like mouse position or frequent input updates (typing) can cause massive re-render cascades in React if not properly isolated or optimized. In this hacker UI, the `MouseFollower` was triggering a re-render on every pixel moved, which also forced re-renders of other heavy components like `MatrixBackground`.

**Action:** Use `React.memo` for purely visual components that depend on stable props. For high-frequency interactions like cursor tracking, bypass React's state/reconciliation entirely by using `useRef` and direct DOM manipulation with `translate3d` to leverage hardware acceleration and maintain 60fps.
