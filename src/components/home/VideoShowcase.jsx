'use client';

import { motion } from 'framer-motion';

const videos = [
  { src: '/videos/dsd-showcase.mp4', poster: '/videos/dsd-showcase-poster.jpg', label: 'On the convention floor' },
  { src: '/videos/dsd-showcase-2.mp4', poster: '/videos/dsd-showcase-2-poster.jpg', label: 'Inside our warehouse' },
  { src: '/videos/dsd-showcase-3.mp4', poster: '/videos/dsd-showcase-3-poster.jpg', label: 'Hands-on training' },
  { src: '/videos/dsd-showcase-4.mp4', poster: '/videos/dsd-showcase-4-poster.jpg', label: 'Meet the team' },
];

export default function VideoShowcase() {
  return (
    <section className="bg-[#F8F7F4] py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700 mb-3">
            See Us In Action
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
            The real DentaSource
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#86868B] max-w-2xl mx-auto">
            Conventions, our warehouse, hands-on training, and the team behind it — real footage from the
            Philippines&apos; largest dental showroom. No stock photos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v, i) => (
            <motion.div
              key={v.src}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-3xl bg-black ring-1 ring-black/10 shadow-xl shadow-black/10">
                <video
                  className="h-full w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  poster={v.poster}
                >
                  <source src={v.src} type="video/mp4" />
                  Your browser doesn&apos;t support embedded video.
                </video>
              </div>
              <p className="mt-3 text-sm font-medium text-[#52525B]">{v.label}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-[#86868B]">
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
