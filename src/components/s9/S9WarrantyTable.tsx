export default function S9WarrantyTable() {
    return (
        <section className="py-16 lg:py-24 bg-white">
            <div className="mx-auto max-w-4xl px-6 lg:px-8">
                <div className="text-center mb-12 lg:mb-16">
                    <span className="text-blue-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
                        Our Commitment
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                        Comprehensive Warranties
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600">
                        The Affordable Luxury Model S9 is backed by comprehensive warranties, ensuring long-term peace of mind and reliability.
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-gray-100">
                                <th className="py-4 px-4 sm:py-5 sm:px-8 text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider w-2/3">
                                    Component
                                </th>
                                <th className="py-4 px-4 sm:py-5 sm:px-8 text-xs sm:text-sm font-semibold text-gray-900 uppercase tracking-wider w-1/3 border-l border-gray-100">
                                    Coverage Period
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[
                                { item: "Water & Air Pipelines", duration: "5-year Warranty" },
                                { item: "Breathable Seamless Microfiber Leather", duration: "5-year Warranty" },
                                { item: "TIMOTION Motor", duration: "5-year Warranty" },
                                { item: "RoLight Dental Light", duration: "3-year Warranty" },
                            ].map((row, index) => (
                                <tr key={index} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="py-4 px-4 sm:py-5 sm:px-8 text-sm sm:text-base font-medium text-gray-900">
                                        {row.item}
                                    </td>
                                    <td className="py-4 px-4 sm:py-5 sm:px-8 text-sm sm:text-base text-gray-600 border-l border-gray-100">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {row.duration}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
