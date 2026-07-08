# Bolt's Journal - Cyber-Assist AI

## 2025-05-22 - Optimize High-Frequency Mouse Tracking
**Learning:** React state updates for 60fps interactions (like mouse tracking) cause excessive re-renders, especially if the component is large or has many siblings. Direct DOM manipulation via `useRef` and `translate3d` completely bypasses the React reconciliation process, achieving significant performance gains.
**Action:** Use `useRef` and direct style updates for animations/interactions that happen at a higher frequency than standard UI state changes. Always wrap high-frequency or expensive components in `React.memo` when they are siblings of stateful components.
