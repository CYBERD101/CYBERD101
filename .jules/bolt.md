# BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-24 - Initializing Journal
**Learning:** Initializing the journal for performance tracking.
**Action:** Follow the Bolt philosophy: Speed is a feature, measure first, optimize second.

## 2024-05-24 - Optimized MouseFollower with direct DOM manipulation
**Learning:** High-frequency events like 'mousemove' should bypass React's state/reconciliation cycle to achieve 60fps and prevent parent re-renders.
**Action:** Use 'useRef' and direct DOM manipulation with 'translate3d' for high-frequency UI updates.
