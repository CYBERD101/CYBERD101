## 2025-06-28 - Optimizing High-Frequency UI Updates

**Learning:** Components that track mouse movement or other high-frequency events (like scroll or resize) should avoid React state for position tracking. Using `useState` triggers the full React reconciliation cycle on every move, which is extremely expensive for 60fps animations.

**Action:** Use `useRef` to store DOM references and update styles directly (e.g., `element.style.transform = 'translate3d(...)'`) inside a `mousemove` listener. Combine with `React.memo` on the component to prevent re-renders when parent state changes. This decouples the high-frequency animation from the React lifecycle.
