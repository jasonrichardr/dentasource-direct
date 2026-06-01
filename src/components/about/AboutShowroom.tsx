"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Clock, Phone } from "lucide-react";

export default function AboutShowroom() {
  return (
    <section className="py-16 lg:py-24 bg-zinc-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 font-semibold tracking-widest text-sm uppercase mb-3 block">
              Visit Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              The Largest Dental Equipment Showroom in the Philippines
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              140 sqm of dental chairs, X-ray machines, endodontic motors, and
              microscopes — all on display, all ready to test.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Address</div>
                  <div className="text-gray-600">
                    610 C. Maybunga Rd, Pasig City
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Hours</div>
                  <div className="text-gray-600">
                    Open Mon–Sun, 9AM–8PM
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Phone</div>
                  <div className="text-gray-600">+63 962 579 3024</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/about/roson/product-display.webp"
                alt="DentaSource Direct showroom with dental equipment on display"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
