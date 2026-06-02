'use client';
import { LazyMotion } from 'framer-motion';
// Async feature loading: `m` core ships in First Load JS; the feature bundle
// loads as a separate chunk after hydration. Replaces eager `motion` (which can't
// be tree-shaken) across the app, cutting ~62KB of homepage First Load JS.
const loadFeatures = () => import('@/components/motionFeatures').then((mod) => mod.default);
export default function MotionProvider({ children }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
