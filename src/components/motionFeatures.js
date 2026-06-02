// Loaded as a deferred chunk by MotionProvider so the framer-motion feature
// bundle stays OUT of First Load JS. domMax = all features (animations, gestures,
// viewport/whileInView, layout, drag) — guarantees no behavioral regression.
import { domMax } from 'framer-motion';
export default domMax;
