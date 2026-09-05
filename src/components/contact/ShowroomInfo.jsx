'use client';
import { m as motion } from 'framer-motion';

const MAPS_SHARE_URL = 'https://share.google/X0K3OZYUqNradruP2';
const MAPS_EMBED_URL = 'https://maps.google.com/maps?q=610%20C.%20Maybunga%20Rd%20Pasig%20City%20Metro%20Manila&output=embed';

export default function ShowroomInfo() {
  return (
    <div className="w-full h-full bg-[#0A1410] p-10 lg:p-16 flex flex-col relative overflow-hidden overflow-y-auto">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#10b981]/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-lg mt-8 lg:mt-4 space-y-10"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
          Walk in anytime.<br />
          <span className="text-white/50">See every product up close.</span>
        </h2>

        <div>
          <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Headquarters & Showroom</h4>
          <p className="text-white/70 leading-relaxed text-lg">
            610 C. Raymundo Avenue<br />
            Maybunga, Pasig City, Metro Manila<br />
            Philippines
          </p>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2 uppercase tracking-wider text-xs">Open Every Day</h4>
          <p className="text-[#10b981] text-2xl font-semibold tracking-tight">Monday – Sunday</p>
          <p className="text-white/70 text-lg">9:00 AM – 8:00 PM</p>
          <p className="text-white/40 text-sm mt-2">No appointment needed — just drop by.</p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(16,185,129,0.3)]">
          <iframe
            src={MAPS_EMBED_URL}
            width="100%"
            height="280"
            style={{ border: 0, filter: 'grayscale(0.2) contrast(1.05)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DentaSource Direct showroom on Google Maps"
            aria-label="Map showing 610 C. Raymundo Avenue, Maybunga, Pasig City"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href="tel:+639625793024"
            aria-label="Call DentaSource Direct at +63 962 579 3024"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#10b981] text-[#0A1410] rounded-full font-semibold text-sm hover:bg-emerald-400 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            Call +63 962 579 3024
          </a>
          <a
            href={MAPS_SHARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open showroom location in Google Maps for directions"
            className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#0A1410] rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Get directions
          </a>
          <a
            href="https://m.me/dentasource"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#0084FF] hover:bg-[#006acc] text-white rounded-full font-semibold text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.18V22l2.97-1.63c.84.23 1.74.36 2.66.36h.22c5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.04 13.04l-2.55-2.73L5.6 15.04l5.35-5.68 2.62 2.73 4.82-2.73-5.35 5.68z"/></svg>
            Message on Facebook
          </a>
        </div>
      </motion.div>
    </div>
  );
}
