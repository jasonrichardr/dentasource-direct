"use client";

import Image from "next/image";

export default function TechnicalSpecsTable() {
    return (
        <section id="specs" className="py-16 lg:py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="text-center mb-12 lg:mb-16 max-w-2xl mx-auto">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Technical Precision
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Engineering & Dimensions
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

                    {/* Specifications List */}
                    <div className="w-full lg:w-1/2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Specifications Summary</h3>

                        <div className="bg-white border text-left border-gray-100 rounded-2xl shadow-sm overflow-hidden text-sm md:text-base">
                            {[
                                { label: "Voltage", value: "a.c.220V, 50Hz" },
                                { label: "Chair Engine", value: "24V DC Silent Electric" },
                                { label: "Air System", value: "Air TAC Regulator / Polyether Tube" },
                                { label: "Spittoon", value: "Rotatable Ceramic / Auto Flush" },
                                { label: "Upholstery", value: "All-Silicon Leather" },
                                { label: "Operating Light", value: "Rolight S LED" },
                            ].map((spec, i) => (
                                <div key={i} className={`flex justify-between p-5 ${i % 2 === 0 ? 'bg-zinc-50' : 'bg-white'} border-b border-gray-100 last:border-0`}>
                                    <span className="font-semibold text-gray-700 w-1/3 pr-4">{spec.label}</span>
                                    <span className="text-gray-600 w-2/3">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Included Accessories */}
                    <div className="w-full lg:w-1/2">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">Included Accessories</h3>

                        <div className="flex flex-col sm:flex-row bg-blue-50/50 rounded-2xl p-6 md:p-8 border border-blue-100 items-center">
                            <div className="w-full sm:w-1/3 relative h-[200px] mb-6 sm:mb-0 bg-white rounded-xl overflow-hidden shadow-sm">
                                <Image
                                    src="/images/products/n2-pro/N2 Pro Dental Chair/3-1.jpg"
                                    alt="RS03 Dentist Stool included"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="w-full sm:w-2/3 sm:pl-8 flex flex-col justify-center text-center sm:text-left">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-full mb-3 self-center sm:self-start">Premium Inclusion</span>
                                <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">RS03 Dentist Stool</h4>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    Premium seating engineered for practitioners with integrated armrest and backrest. Promotes neutral posture and allows smooth movement around the patient during long procedures.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
