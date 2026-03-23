'use client';

import { ReactNode } from 'react';

export default function ScrollCardStack({ children }: { children: ReactNode[] }) {
    return (
        <div className="w-full h-[100dvh] overflow-y-auto snap-y snap-mandatory bg-black no-scrollbar">
            {children.map((child, i) => (
                <div
                    key={i}
                    className="w-full h-[100dvh] shrink-0 snap-start snap-always relative overflow-hidden flex flex-col"
                >
                    {child}
                </div>
            ))}
        </div>
    );
}
