'use client';

import { motion } from 'framer-motion';

export default function VideoShowcase() {
  return (
    <section className="bg-[#F8F7F4] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-3">
            See Us In Action
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
            Trusted on the convention floor
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#86868B] max-w-2xl mx-auto">
            Real dentists, hands-on with real equipment — at the Philippines&apos; biggest dental events and
            our 140-sqm Pasig showroom. No stock photos. This is DentaSource Direct.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="relative aspect-[9/16] w-full max-w-[340px] overflow-hidden rounded-3xl bg-black ring-1 ring-black/10 shadow-xl shadow-black/10">
            <video
              className="h-full w-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster="/videos/dsd-showcase-poster.jpg"
            >
              <source src="/videos/dsd-showcase.mp4" type="video/mp4" />
              Your browser doesn&apos;t support embedded video.
            </video>
          </div>
        </motion.div>

        <p className="mt-7 text-center text-sm text-[#86868B]">
          See more on{' '}
          <a
            href="https://www.facebook.com/dentasource"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
          >
            Facebook
          </a>{' '}
          and{' '}
          <a
            href="https://www.tiktok.com/@dentasourcedirect"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
          >
            TikTok
          </a>
          .
        </p>
      </div>
    </section>
  );
}
