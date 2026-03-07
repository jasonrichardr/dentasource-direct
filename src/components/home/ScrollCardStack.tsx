'use client';

import { useRef, ReactNode } from 'react';
import { useScroll, motion, useTransform, MotionValue } from 'framer-motion';

interface CardProps {
    i: number;
    children: ReactNode;
    progress: MotionValue<number>;
    range: [number, number];
    targetScale: number;
}

const Card = ({ i, children, progress, range, targetScale }: CardProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // As the scroll progresses past this card's index, it mathematically scales down
    const scale = useTransform(progress, range, [1, targetScale]);

    // Creates a realistic shadow/darkening effect as the card moves "back" in 3D space
    const overlayOpacity = useTransform(progress, range, [0, 0.4]);

    return (
        <div ref={containerRef} className="h-[100dvh] flex items-center justify-center sticky top-0 overflow-hidden w-full">
            {/* 
        The Framer Motion div handles the 3D scaling and transform origin.
        We ensure it fills the 100dvh sticky container completely.
      */}
            <motion.div
                style={{
                    scale,
                    transformOrigin: 'top center',
                }}
                className="relative w-full h-full flex flex-col overflow-hidden bg-black"
            >
                {children}

                {/* Dynamic Shadow Overlay */}
                <motion.div
                    style={{ opacity: overlayOpacity }}
                    className="absolute inset-0 bg-black pointer-events-none z-[100]"
                />
            </motion.div>
        </div>
    );
};

export default function ScrollCardStack({ children }: { children: ReactNode[] }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress through the entire stack of cards
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    return (
        <div ref={containerRef} className="relative w-full">
            {children.map((child, i) => {
                // Calculate a target scale so each card stacks slightly smaller than the last
                const targetScale = 1 - ((children.length - i) * 0.04);

                // The scroll range over which this specific card should start shrinking
                // It starts shrinking when the NEXT card begins sliding over it
                const startShrink = i * (1 / children.length);
                const endShrink = 1;
                const range = [startShrink, endShrink];

                return (
                    <Card
                        key={i}
                        i={i}
                        progress={scrollYProgress}
                        range={range as [number, number]}
                        targetScale={targetScale}
                    >
                        {child}
                    </Card>
                );
            })}
        </div>
    );
}
