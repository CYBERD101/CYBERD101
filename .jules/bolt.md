## 2025-05-29 - Hardware-Accelerated Mouse Tracking
**Learning:** High-frequency UI updates (like mouse tracking) using React state cause significant overhead due to React's reconciliation process, even with memoization. This lead to "stuttering" in the Matrix background and UI animations.
**Action:** Use `useRef` and direct DOM manipulation with `translate3d` to bypass React entirely for high-frequency animations. This leverages hardware acceleration and keeps the main thread free for state management and streaming.
