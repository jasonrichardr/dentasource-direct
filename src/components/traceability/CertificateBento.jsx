'use client';

import { m as motion } from 'framer-motion';
import Image from 'next/image';

const certificates = [
  {
    id: 'iso',
    title: 'ISO 13485',
    desc: 'Medical Device Quality System',
    img: '/images/traceability/ISO.jpg',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-2',
    delay: 0
  },
  {
    id: 'sgs',
    title: 'SGS Certification',
    desc: 'Verified International Quality',
    img: '/images/traceability/SGS.jpg',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    delay: 0.1
  },
  {
    id: 'ce',
    title: 'CE Certification',
    desc: 'European Conformity',
    img: '/images/traceability/CE0.jpg',
    colSpan: 'md:col-span-1',
    rowSpan: 'md:row-span-1',
    delay: 0.2
  },
  {
    id: 'roson-iso',
    title: 'ROSON Quality Assurance',
    desc: 'Guaranteed Traceability',
    img: '/images/traceability/Roson-ISO_.jpg',
    colSpan: 'md:col-span-2',
    rowSpan: 'md:row-span-1',
    delay: 0.3
  }
];

export default function CertificateBento() {
  return (
    <section className="py-16 sm:py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="mb-10 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-4"
          >
            Certified <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">Excellence</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 max-w-2xl text-base sm:text-lg"
          >
            Our ISO9001 and ISO13485 certified system ensures rigorous standards at every stage. We deliver dental equipment you can trust, every time.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[250px]">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: cert.delay, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 hover:border-emerald-500/50 transition-colors duration-500 min-h-[220px] md:min-h-0 ${cert.colSpan} ${cert.rowSpan}`}
            >
              {/* Image Container with Hover Scale */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900/40 z-10 group-hover:bg-transparent transition-colors duration-500" />
                <Image
                  src={cert.img}
                  alt={cert.title}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-80 group-hover:opacity-100"
                />
              </div>

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent z-20 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 p-6 z-30 w-full transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-sm text-neutral-300 font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {cert.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
