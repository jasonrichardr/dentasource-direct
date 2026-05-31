'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Aperture, ShieldCheck, Smartphone, Snowflake, FlaskConical, Wind, AlertTriangle, X, ChevronLeft, ChevronRight, Film, Trees, LayoutGrid, Truck, Building2, Baby } from 'lucide-react';
import { targetSegments, rorayFaqs } from './rorayContent';
import RorayAutoplayHero from './RorayAutoplayHero';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const sectionPad = 'py-14 md:py-20';
const eyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700';
const sectionTitle =
  'mt-2 text-[26px] sm:text-3xl md:text-[34px] font-semibold tracking-tight leading-[1.15] text-[#1D1D1F]';
const bodyText =
  'text-[14px] sm:text-[15px] leading-relaxed text-[#52525B]';

export default function RorayLanding() {
  return (
    <>
      <RorayAutoplayHero />
      <ProductIntro />
      <Pillars />
      <FocalSpotStory />
      <DoubleProtection />
      <CompleteKit />
      <FilipinoClinics />
      <TechSpecs />
      <Gallery />
      <FaqSection />
      <FinalCta />
    </>
  );
}

function Arrow() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-emerald-600 shrink-0" fill="currentColor" aria-hidden>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

/* ─── PRODUCT INTRO (halo-style "The Digital Mirror" pattern) ─ */
function ProductIntro() {
  const features = [
    { Icon: Aperture, label: '0.4 mm ultra-fine focal spot' },
    { Icon: ShieldCheck, label: 'Full-coverage lead shielding' },
    { Icon: Smartphone, label: '2.8″ HD onboard display' },
    { Icon: Snowflake, label: 'Self-cooling, no warm-up' },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight leading-[1.1] text-[#1D1D1F]">
            ROSON RoRay
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl">
            The RoRay is a handheld portable dental X-ray engineered for the
            Filipino clinic. Premium diagnostic specs, no wall installation,
            ready in 30 minutes of unboxing.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3.5 py-3.5">
              <f.Icon className="size-[18px] text-emerald-700 shrink-0" strokeWidth={1.75} />
              <span className="text-[14px] text-[#1D1D1F]">{f.label}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8">
          <Link
            href="/contact?interest=imaging"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PILLARS (line-divider list, halo-style) ───────────────── */
function Pillars() {
  const items = [
    {
      tag: 'Image quality',
      title: '0.4 mm Ultra-Fine Focal Spot',
      body: 'Premium-tier diagnostic clarity. A smaller focal spot equals sharper image detail — every periapical, every bitewing, every diagnosis.',
    },
    {
      tag: 'Operator safety',
      title: 'Full-Coverage Lead Shielding',
      body: 'Lead shielding wraps the tube head on every face — not only the front. Combined with a potting-encapsulated tube assembly, leakage radiation is below standard requirements.',
    },
    {
      tag: 'Workflow',
      title: 'Onboard HD Display, Cordless Operation',
      body: '2.8-inch HD color display. No tablet companion required. Self-cooling tube — no warm-up wait, no cooldown between exposures.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The engineering</p>
          <h2 className={sectionTitle}>
            Four pillars of why the RoRay outperforms its price tier.
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="mt-10 divide-y divide-black/[0.08]">
          {items.map((it) => (
            <div key={it.title} className="py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {it.tag}
              </p>
              <h3 className="mt-1.5 text-[17px] sm:text-[18px] font-semibold text-[#1D1D1F]">
                {it.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#52525B]">
                {it.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOCAL SPOT STORY ──────────────────────────────────────── */
function FocalSpotStory() {
  const tiers = [
    { size: 1.0, label: 'Large', desc: 'Budget / legacy', d: 56 },
    { size: 0.6, label: 'Medium', desc: 'Mid-tier portable', d: 36 },
    { size: 0.5, label: 'Small', desc: 'Standard premium', d: 30 },
    { size: 0.4, label: 'Ultra-Fine', desc: 'Premium diagnostic tier', d: 24, highlight: true },
  ];
  const samples = [
    { size: '1.0 mm', label: 'Large', sub: 'Budget / legacy', blur: 3.2 },
    { size: '0.6 mm', label: 'Medium', sub: 'Mid-tier portable', blur: 1.6 },
    { size: '0.5 mm', label: 'Small', sub: 'Standard premium', blur: 0.7 },
    { size: '0.4 mm', label: 'Ultra-Fine', sub: 'Premium diagnostic tier', blur: 0, highlight: true },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Focal spot, explained</p>
          <h2 className={sectionTitle}>
            Why 0.4 mm is the difference between &ldquo;image&rdquo; and{' '}
            <em className="not-italic text-emerald-700">diagnosis</em>.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            The focal spot is the area on the X-ray tube&rsquo;s anode where
            radiation originates. Smaller spot, sharper image. The RoRay&rsquo;s
            0.4 mm sits in the premium diagnostic clarity tier — every
            periapical lesion, every hairline crack, every accessory canal.
          </p>
        </motion.div>

        {/* Visual sharpness comparison — TV-marketing style, 4 panels of the same X-ray with progressive blur */}
        <motion.div {...fadeUp} className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-3">
            See the difference (illustrative)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {samples.map((s) => (
              <div
                key={s.size}
                className={`relative rounded-xl overflow-hidden border ${s.highlight ? 'border-emerald-500/60 ring-2 ring-emerald-200' : 'border-black/[0.08]'} bg-black`}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/products/roray/sample-xray.jpg"
                    alt={`Periapical X-ray reference at ${s.size} focal spot — illustrative`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: s.blur > 0 ? `blur(${s.blur}px)` : undefined }}
                    loading="lazy"
                  />
                  {/* Spec label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 to-transparent">
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-[13px] sm:text-[14px] font-semibold ${s.highlight ? 'text-emerald-300' : 'text-white'}`}>
                        {s.size}
                      </span>
                      <span
                        className={`text-[10px] ${s.highlight ? 'text-emerald-200 italic font-semibold tracking-wide' : 'text-white/65'}`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <p className="text-[9.5px] text-white/55 leading-tight mt-0.5">{s.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10.5px] text-[#86868B] leading-relaxed">
            Same source radiograph rendered at four geometric-unsharpness levels matching each focal spot tier. Real patient-specific results vary; this is a visual demonstration of how focal spot size affects image fidelity.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-6 rounded-2xl bg-white border border-black/[0.06] p-5">
          <ul className="divide-y divide-black/[0.08]">
            {tiers.map((t) => (
              <li key={t.size} className="flex items-center gap-4 py-3">
                <div className="flex items-center justify-center w-14 shrink-0">
                  <div
                    className={`rounded-full ${t.highlight ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-[#1D1D1F]/80'}`}
                    style={{ width: t.d, height: t.d }}
                    aria-label={`${t.size} mm focal spot`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-[16px] font-semibold ${t.highlight ? 'text-emerald-700' : 'text-[#1D1D1F]'}`}>
                      {t.size.toFixed(1)} mm
                    </span>
                    <span className={`text-[12px] ${t.highlight ? 'text-emerald-700' : 'text-[#86868B]'}`}>
                      {t.label}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#86868B]">{t.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── DOUBLE PROTECTION ─────────────────────────────────────── */
function DoubleProtection() {
  const layers = [
    {
      title: 'Layer 1 · Full-Coverage Lead Shielding',
      body: 'Lead wraps every face of the tube head — front, sides, rear. Independently tested leakage measures below standard requirements, even at maximum exposure settings.',
    },
    {
      title: 'Layer 2 · Solid-State Potting-Encapsulated Tube',
      body: 'The tube and shielding are permanently sealed together as a single solid-state assembly — eliminating the air gaps where microdoses of radiation can leak through.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Double protection</p>
          <h2 className={sectionTitle}>
            5,000 holds per year. Safety isn&rsquo;t a feature — it&rsquo;s the foundation.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            A dentist taking 20 X-rays a day, 250 days a year, will hold a
            handheld X-ray unit roughly 5,000 times in a single year. The
            RoRay is engineered for that lifetime of exposure — operator
            safety designed in, not retrofitted.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {layers.map((l, i) => (
            <li key={i} className="py-5">
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#1D1D1F]">
                {l.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[#52525B]">
                {l.body}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── COMPLETE KIT ──────────────────────────────────────────── */
function CompleteKit() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The complete kit</p>
          <h2 className={sectionTitle}>
            One brand. One warranty. One service line.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            The RoRay handles emission. The ROSON Rosensor handles capture. A
            complete digital radiography kit from a single manufacturer — no
            mix-and-match warranty chains, no cross-vendor finger-pointing.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 grid sm:grid-cols-3 gap-3">
          <KitCard label="Emitter" title="ROSON RoRay" specs={['0.4 mm focal spot', '50,000+ imgs / battery', '2.8″ onboard UI']} />
          <KitCard label="Receiver" title="ROSON Rosensor" specs={['IP68 immersion', '20 µm pixel · 14-bit', 'CsI scintillator']} />
          <KitCard label="Output" title="Your clinic PC" specs={['USB 2.0 plug-and-play', 'TWAIN compatible', 'Windows 10+']} />
        </motion.div>

        <motion.div {...fadeUp} className="mt-6 grid sm:grid-cols-2 gap-3 text-[13px] text-[#52525B]">
          <div className="rounded-xl bg-[#F8F7F4] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">From film to digital</p>
            <p className="mt-2 leading-relaxed">
              Going digital eliminates the darkroom — and with it the daily exposure to materials that were never meant for human contact.
            </p>
            <ul className="mt-3 space-y-1.5 text-[12px] text-[#1D1D1F]">
              <li className="flex items-center gap-2">
                <FlaskConical className="size-3.5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span>Toxic developer &amp; fixer chemistry</span>
              </li>
              <li className="flex items-center gap-2">
                <Wind className="size-3.5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span>Lingering chemical fumes &amp; odor</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-rose-600 shrink-0" strokeWidth={1.75} />
                <span>Daily darkroom &amp; staff exposure</span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-[#F8F7F4] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Ready in 30 minutes</p>
            <p className="mt-2 leading-relaxed">
              No wall mounting. No electrician. No architect. Charge unit, install driver, operational from delivery in under an afternoon.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function KitCard({ label, title, specs }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-[#F8F7F4] p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#86868B]">{label}</p>
      <p className="mt-1 text-[14px] font-semibold text-[#1D1D1F]">{title}</p>
      <ul className="mt-2.5 space-y-1 text-[12px] text-[#52525B]">
        {specs.map((s) => (
          <li key={s} className="flex items-start gap-1.5">
            <span className="mt-1.5 size-1 rounded-full bg-[#52525B]/40 shrink-0" />
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── FILIPINO CLINICS (line list, halo-style) ──────────────── */
const segmentIcons = [Film, Trees, LayoutGrid, Truck, Building2, Baby];

function FilipinoClinics() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Built for Filipino practice</p>
          <h2 className={sectionTitle}>
            Six clinic profiles where RoRay wins.
          </h2>
        </motion.div>
        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {targetSegments.map((s, i) => {
            const Icon = segmentIcons[i] || Building2;
            return (
              <li key={s.title} className="flex items-start gap-4 py-4">
                <span
                  className="shrink-0 size-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center"
                  aria-hidden
                >
                  <Icon className="size-[18px]" strokeWidth={1.6} />
                </span>
                <div className="flex-1">
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#1D1D1F]">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-[#52525B]">
                    {s.body}
                  </p>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── TECH SPECS ────────────────────────────────────────────── */
function TechSpecs() {
  const specs = [
    ['Form factor', 'Handheld / Portable'],
    ['Focal spot size', '0.4 mm (Ultra-Fine)'],
    ['Tube technology', 'High-frequency, solid-state potting-encapsulated'],
    ['Tube endurance', '100,000+ exposure cycles (validated)'],
    ['Sharpness retention', 'Less than 5% attenuation over lifespan'],
    ['Imaging capacity', '50,000+ images per battery cycle'],
    ['Display', '2.8-inch HD color (onboard UI)'],
    ['Lead shielding', '9% full-coverage'],
    ['Leakage radiation', 'Below standard requirements'],
    ['Cooling', 'Self-cooling (no warm-up, no cooldown)'],
    ['Tablet companion', 'Not required'],
    ['Origin', 'ROSON Medical, China'],
    ['Distributor (PH)', 'DentaSource Direct (exclusive)'],
    ['Warranty', '1-year parts and service'],
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Technical specifications</p>
          <h2 className={sectionTitle}>Every number on the spec sheet.</h2>
        </motion.div>
        <motion.dl {...fadeUp} className="mt-8 divide-y divide-black/[0.08] rounded-xl bg-white border border-black/[0.06] overflow-hidden">
          {specs.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-3 px-4 py-3">
              <dt className="text-[12px] font-medium text-[#86868B]">{k}</dt>
              <dd className="col-span-2 text-[12.5px] text-[#1D1D1F]">{v}</dd>
            </div>
          ))}
        </motion.dl>
        <p className="mt-3 text-[11px] text-[#86868B] text-center">
          kVp, mA, exposure time, weight, charger details confirmed at showroom demo + quote.
        </p>
      </div>
    </section>
  );
}

/* ─── GALLERY (tap-to-zoom lightbox) ────────────────────────── */
function Gallery() {
  const images = [
    { src: '/images/products/roray/hero.jpg', alt: 'ROSON RoRay hero view' },
    { src: '/images/products/roray/view-2.jpg', alt: 'ROSON RoRay alternate angle' },
    { src: '/images/products/roray/view-3.jpg', alt: 'ROSON RoRay display detail' },
    { src: '/images/products/roray/view-4.jpg', alt: 'ROSON RoRay grip view' },
    { src: '/images/products/roray/view-5.jpg', alt: 'ROSON RoRay clinical context' },
    { src: '/images/products/roray/view-6.jpg', alt: 'ROSON RoRay full unit' },
  ];
  const [openIdx, setOpenIdx] = useState(null);
  const isOpen = openIdx !== null;
  const close = () => setOpenIdx(null);
  const next = () => setOpenIdx((i) => (i + 1) % images.length);
  const prev = () => setOpenIdx((i) => (i - 1 + images.length) % images.length);

  // Keyboard nav + body scroll lock when lightbox is open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Product gallery</p>
          <h2 className={sectionTitle}>Look closer.</h2>
        </motion.div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.button
              key={img.src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Open ${img.alt} full-size`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#F8F7F4] border border-black/[0.04] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            {/* Close */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="size-5" />
            </button>
            {/* Prev */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <ChevronLeft className="size-5" />
            </button>
            {/* Next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <ChevronRight className="size-5" />
            </button>
            {/* Image */}
            <motion.div
              key={openIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full max-w-5xl max-h-[90vh] mx-auto px-12 py-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[openIdx].src}
                alt={images[openIdx].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
            {/* Caption + counter */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
              <p className="text-[12px] text-white/85 px-4 text-center">{images[openIdx].alt}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
                {openIdx + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── FAQ ───────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Common questions</p>
          <h2 className={sectionTitle}>Answers, before you ask.</h2>
        </motion.div>
        <div className="mt-8 divide-y divide-black/[0.08] rounded-xl bg-white border border-black/[0.06] overflow-hidden">
          {rorayFaqs.map((f, i) => (
            <motion.details
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.03 }}
              className="group px-4 py-3.5 open:bg-[#F8F7F4] transition-colors"
            >
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#1D1D1F]">
                  {f.q}
                </span>
                <span className="size-6 rounded-full bg-[#F8F7F4] group-open:bg-emerald-50 flex items-center justify-center text-[#86868B] group-open:text-emerald-700 group-open:rotate-45 transition-all text-[12px] shrink-0">+</span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-[#52525B]">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─────────────────────────────────────────────── */
function FinalCta() {
  const items = [
    'Live RoRay + Rosensor demonstration',
    'Side-by-side image comparison vs current setup',
    'Complete kit pricing — including bundle options',
    'Warranty walkthrough + service plan review',
    'Tour of the Pasig showroom (chairs, imaging, sterilization)',
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Visit the showroom</p>
          <h2 className={sectionTitle}>Hold the RoRay before you buy.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Visit the Pasig showroom for a live demonstration — RoRay paired
            with the Rosensor, the complete digital radiography workflow, end
            to end.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-7 divide-y divide-black/[0.08]">
          {items.map((l) => (
            <li key={l} className="flex items-center gap-2.5 py-2.5 text-[13px] text-[#1D1D1F]">
              <Check />
              {l}
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8 flex gap-3">
          <Link
            href="/contact?interest=imaging"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
            <Arrow />
          </Link>
          <Link
            href="/contact?interest=imaging"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] bg-white text-[#1D1D1F] px-5 py-2.5 text-[13px] font-medium hover:bg-[#F8F7F4] transition"
          >
            Request a quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
