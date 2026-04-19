'use client';

import { motion } from 'framer-motion';

function PlayIcon({ className = 'w-12 h-12' }) {
  return (
    <svg className={className} viewBox="0 0 68 48" aria-hidden="true">
      <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,0.13,34,0,34,0S12.21,0.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#ff0000"/>
      <polygon points="27,34 45,24 27,14" fill="#ffffff"/>
    </svg>
  );
}

export default function VideoSection({ videos, productName }) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="mb-20">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-center mb-3">
        Watch it in action
      </h2>
      <p className="text-center text-white/60 max-w-xl mx-auto mb-10">
        Tutorials and demos from Denjoy's official YouTube channel.
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {videos.map((video, i) => (
          <motion.a
            key={video.id}
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch on YouTube: ${video.title} (${video.duration})`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="group relative block rounded-xl overflow-hidden bg-black/40 border border-white/10 hover:border-white/30 transition-colors"
          >
            <div className="relative aspect-video">
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" aria-hidden="true" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="transition-transform group-hover:scale-110">
                  <PlayIcon className="w-16 h-16 drop-shadow-2xl" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs font-semibold">
                {video.duration}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm md:text-base text-white/90 leading-snug line-clamp-2 group-hover:text-white">
                {video.title}
              </p>
              <p className="text-xs text-white/50 mt-2 flex items-center gap-1">
                <span>Watch on YouTube</span>
                <span aria-hidden="true">↗</span>
              </p>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
