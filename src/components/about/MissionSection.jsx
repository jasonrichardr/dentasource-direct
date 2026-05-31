'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function MissionSection() {
  return (
    <section className="py-32 bg-white relative z-20 -mt-12 rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight mb-8">
              The Largest Showroom in the Philippines.
            </h2>
            <div className="prose prose-lg text-[#86868B] space-y-6">
              <p>
                Located in the heart of Pasig City, Metro Manila, our headquarters isn't just a warehouse—it's an experience center. We believe that critical investments in your clinical workflow should be felt, tested, and understood before a decision is made.
              </p>
              <p>
                As the exclusive distributor for premium lines like the Roson series, we bypass the bloated traditional supply chains. This allows us to offer uncompromising quality, zero down payment options, and aggressive trade-in programs that empower both startup practices and expanding dental groups.
              </p>
            </div>
            
            <div className="mt-12">
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1D1D1F] text-white rounded-full font-medium hover:bg-black transition-all hover:shadow-xl hover:-translate-y-1"
              >
                Visit Our Headquarters
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>
          </motion.div>

          {/* Image / Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-[500px] lg:h-[650px] bg-[#F5F5F7] rounded-[2rem] relative overflow-hidden flex items-center justify-center p-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#10b981]/10 to-transparent z-0" />
            <img 
              src="/images/products/s9/047_Model_S9_dental_chair_with_blue_seat__ergonomic_de.jpg" 
              alt="DentaSource Showroom Equipment" 
              className="relative z-10 w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
            />
            
            {/* Floating Location Badge */}
            <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-lg border border-white/20">
              <p className="text-sm font-bold text-[#1D1D1F] uppercase tracking-wider mb-1">Pasig City</p>
              <p className="text-xs text-[#86868B]">Metro Manila, Philippines</p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
