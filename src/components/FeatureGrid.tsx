"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
    {
        title: "Shield-Inspired Aesthetics",
        description: "The N2 PRO's signature shield-shaped design offers a sleek, modern silhouette that elevates the visual appeal of any operatory while maintaining a clean, professional appearance.",
        image: "/images/products/n2-pro/Advanced features and components/Shield_Design.jpg",
        highlight: "Modern Elegance"
    },
    {
        title: "Optimized Delivery System",
        description: "Expansive 650 × 315 mm tray surface accommodates multiple procedure tubs, providing significantly more room for other essential dental equipment and instruments.",
        image: "/images/products/n2-pro/Advanced features and components/Dentist_Table.jpg",
        highlight: "Superior Workflow"
    },
    {
        title: "Integrated Assistant Instrumentation",
        description: "Multi-articulating assistant arm with a comprehensive capacitive touch panel. Provides full chair control and perfectly positions HVE and SE valves for efficient four-handed dentistry.",
        image: "/images/products/n2-pro/Advanced features and components/Assistant_Table.jpg",
        highlight: "Dynamic Needs"
    },
    {
        title: "Rotatable Ceramic Spittoon",
        description: "Provides more space for the assistant. It is 180-degree rotatable and designed for effortless cleaning, alongside programmable cup filler systems.",
        image: "/images/products/n2-pro/Advanced features and components/Rotatable_Spittoon.jpg",
        highlight: "Effortless Cleaning"
    },
    {
        title: "Dual-Bottle Water Management",
        description: "Easily accessible, independent dual-bottle system. Allows the seamless switch between distilled water and clinical irrigants or disinfectants during specialized procedures.",
        image: "/images/products/n2-pro/Advanced features and components/Water_Supply_System.jpg",
        highlight: "Hygiene First"
    },
    {
        title: "Rolight S LED Operating Light",
        description: "Touchless infrared sensor control prevents cross-contamination. Philips LED arrays provide uniform, color-accurate illumination with dedicated composite-safe modes.",
        image: "/images/products/n2-pro/Advanced features and components/Rolight_S_Dental_Light.webp",
        highlight: "Touchless Control"
    },
    {
        title: "Easy Quick Clean Filter",
        description: "Designed to easily filter out calcular deposits and other debris. The accessible canister is very quick to remove for effortless, hygienic cleaning.",
        image: "/images/products/n2-pro/Advanced features and components/Detachable_Suction_Filter.jpg",
        highlight: "Bacterial Prevention"
    }
];

export default function FeatureGrid() {
    return (
        <section id="features" className="py-16 lg:py-24 bg-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-50/50 -skew-x-12 translate-x-32" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-12 lg:mb-20">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Advanced Integration
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Engineered for Excellence
                    </h2>
                    <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
                        Discover the industry-leading components crafted to optimize your workflow, hygiene, and patient comfort.
                    </p>
                </div>

                <div className="space-y-16 lg:space-y-32">
                    {features.map((feature, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center gap-8 lg:gap-24 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                            {/* Image Section */}
                            <div className="w-full md:w-1/2">
                                <RevealOnScroll>
                                    <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-zinc-100">
                                        <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay z-10 pointer-events-none" />
                                        <Image
                                            src={feature.image}
                                            alt={feature.title}
                                            fill
                                            className="object-contain p-6 sm:p-10 hover:scale-105 transition-transform duration-700 ease-out"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                </RevealOnScroll>
                            </div>

                            {/* Text Section */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <RevealOnScroll delay={200}>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                                        {feature.highlight}
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed mt-4">
                                        {feature.description}
                                    </p>
                                    <div className="mt-8 flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors group cursor-pointer w-fit">
                                        Explore Technical Specs
                                        <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </RevealOnScroll>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Simple Intersection Observer for scroll animations
function RevealOnScroll({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
