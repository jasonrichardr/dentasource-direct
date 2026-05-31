'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  Droplets,
  Monitor,
  ShieldCheck,
  Stethoscope,
  Building2,
  Truck,
  Users,
  Baby,
  GraduationCap,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { freePexFaqs } from './freePexContent';

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

export default function FreePexLanding() {
  return (
    <>
      <ProductIntro />
      <Pillars />
      <SixthGenStory />
      <Workflow />
      <PairWithMeetEndo />
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
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-3.5 h-3.5 text-emerald-600 shrink-0"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ─── PRODUCT INTRO ──────────────────────────────────────────── */
function ProductIntro() {
  const features = [
    { Icon: Activity, label: '6th-generation multi-frequency chip' },
    { Icon: Droplets, label: 'Stable in wet, dry, or bleed-contaminated canals' },
    { Icon: Monitor, label: 'Large color display, readable chair-side' },
    { Icon: ShieldCheck, label: 'FDA & CE certified · 12-month warranty' },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Apex locator · Benchtop</p>
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight leading-[1.1] text-[#1D1D1F]">
            Denjoy FREE PEX
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl">
            A benchtop apex locator built to stay put. The 6th-generation
            multi-frequency chip reads the apical foramen reliably whether
            the canal is wet, dry, or contaminated with blood — and the
            unit&rsquo;s stay-on-the-counter form factor means the reading
            never walks away mid-procedure.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3.5 py-3.5">
              <f.Icon
                className="size-[18px] text-emerald-700 shrink-0"
                strokeWidth={1.75}
              />
              <span className="text-[14px] text-[#1D1D1F]">{f.label}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8">
          <Link
            href="/contact?interest=endo"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PILLARS ────────────────────────────────────────────────── */
function Pillars() {
  const items = [
    {
      tag: 'Accuracy',
      title: '6th-generation multi-frequency measurement',
      body: 'A multi-frequency chip transmits several frequencies simultaneously, cross-referencing the impedance signals. The result is a stable apex reading even when canal conditions are changing in real time.',
    },
    {
      tag: 'Stability',
      title: 'Benchtop form factor',
      body: 'FREE PEX parks on the operatory counter and stays put. No stand to knock over, no handheld unit to fumble for between exposures, no roll-off mid-measurement.',
    },
    {
      tag: 'Visibility',
      title: 'Large color display, chair-side legible',
      body: 'A wide color screen renders the file path with strong contrast — readable from the operator chair without leaning in. The clinician keeps eyes on the canal while glancing at the apex graphic.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The engineering</p>
          <h2 className={sectionTitle}>
            Three pillars behind a stay-put apex reading.
          </h2>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-10 divide-y divide-black/[0.08]"
        >
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

/* ─── 6TH-GEN STORY ──────────────────────────────────────────── */
function SixthGenStory() {
  const generations = [
    { gen: '1st', label: 'Single-frequency', sub: 'Resistance-based legacy', highlight: false },
    { gen: '4th', label: 'Dual-frequency', sub: 'Better wet-canal handling', highlight: false },
    { gen: '5th', label: 'Adaptive multi-frequency', sub: 'Standard premium tier', highlight: false },
    { gen: '6th', label: 'Real-time multi-frequency', sub: 'FREE PEX measurement chip', highlight: true },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Multi-frequency, explained</p>
          <h2 className={sectionTitle}>
            Why 6th-gen is the difference between a reading and a{' '}
            <em className="not-italic text-emerald-700">trustworthy</em>{' '}
            reading.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Apex locators measure tissue impedance at the file tip. Older
            single-frequency chips assume a clean, dry canal. The 6th-gen
            chip transmits multiple frequencies and cross-checks the
            impedance signals — so the apex graphic stays stable even
            through irrigation, bleeding, and pulp tissue variance.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-8 rounded-2xl bg-white border border-black/[0.06] p-5"
        >
          <ul className="divide-y divide-black/[0.08]">
            {generations.map((g) => (
              <li key={g.gen} className="flex items-center gap-4 py-3">
                <div className="flex items-center justify-center w-14 shrink-0">
                  <div
                    className={`flex items-center justify-center rounded-full text-[12px] font-semibold ${
                      g.highlight
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 size-12'
                        : 'bg-[#1D1D1F]/80 text-white size-9'
                    }`}
                    aria-label={`${g.gen} generation chip`}
                  >
                    {g.gen}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`text-[15px] font-semibold ${
                        g.highlight ? 'text-emerald-700' : 'text-[#1D1D1F]'
                      }`}
                    >
                      {g.label}
                    </span>
                  </div>
                  <p
                    className={`text-[12px] ${
                      g.highlight
                        ? 'text-emerald-700 italic font-semibold'
                        : 'text-[#86868B]'
                    }`}
                  >
                    {g.sub}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="mt-3 text-[10.5px] text-[#86868B] leading-relaxed">
          Generation tiers describe a general industry progression in apex
          locator chip design. FREE PEX uses Denjoy&rsquo;s 6th-generation
          multi-frequency engine — the same measurement lineage that powers
          the MeetPex module inside Meet Endo.
        </p>
      </div>
    </section>
  );
}

/* ─── WORKFLOW (why benchtop) ────────────────────────────────── */
function Workflow() {
  const layers = [
    {
      title: 'Layer 1 · Operatory permanence',
      body: 'FREE PEX parks on the counter and stays in one spot — never walks away with the assistant, never gets borrowed by the room next door, never rolls off a tray. The reading is always exactly where you left it.',
    },
    {
      title: 'Layer 2 · Wet/dry canal stability',
      body: "Multi-frequency cross-checking handles canal moisture variance — irrigation residue, blood contamination, partially-vital pulp tissue. The apex graphic doesn't flicker through the cleaning steps.",
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The benchtop workflow</p>
          <h2 className={sectionTitle}>
            Built to stay put. Engineered to stay accurate.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Two design choices define what FREE PEX feels like in daily use
            — and why endodontics-heavy clinics often prefer it over a
            handheld locator.
          </p>
        </motion.div>

        <motion.ul
          {...fadeUp}
          className="mt-8 divide-y divide-black/[0.08]"
        >
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

/* ─── PAIR WITH MEET ENDO ────────────────────────────────────── */
function PairWithMeetEndo() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Standalone, or in formation</p>
          <h2 className={sectionTitle}>
            One brand. One warranty. One service line.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            FREE PEX is a complete apex locator on its own. It also shares
            its measurement lineage with Meet Endo&rsquo;s MeetPex module —
            so a clinic running both keeps a single calibration standard
            across every operatory.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 grid sm:grid-cols-3 gap-3">
          <KitCard
            label="Standalone"
            title="FREE PEX"
            specs={[
              '6th-gen multi-frequency',
              'Benchtop form factor',
              'Large color display',
            ]}
          />
          <KitCard
            label="Integrated"
            title="Meet Endo · MeetPex"
            specs={[
              'Same measurement engine',
              'Touchscreen-controlled',
              'Five-module ecosystem',
            ]}
          />
          <KitCard
            label="Service"
            title="DSD Pasig"
            specs={[
              'Local warranty (12 mo)',
              'Field calibration',
              'Same-week PH delivery',
            ]}
          />
        </motion.div>
      </div>
    </section>
  );
}

function KitCard({ label, title, specs }) {
  return (
    <div className="rounded-xl border border-black/[0.06] bg-white p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#86868B]">
        {label}
      </p>
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

/* ─── FILIPINO CLINICS ───────────────────────────────────────── */
const segmentIcons = [Stethoscope, Building2, Users, Truck, GraduationCap, Baby];

const targetSegments = [
  {
    title: 'Endodontics-focused practices',
    body: 'High-volume root canal workflows where a stay-put apex locator earns its real estate on the bench.',
  },
  {
    title: 'Multi-operatory clinics',
    body: 'Clinics standardizing on Denjoy across rooms — FREE PEX shares its measurement lineage with Meet Endo for consistent calibration.',
  },
  {
    title: 'Family practices',
    body: 'GPs adding rotary endodontics — a single benchtop unit handles every adult canal that walks in the door.',
  },
  {
    title: 'Provincial and outreach setups',
    body: 'Rural clinics where field repairs are slow — local DSD warranty + Pasig service center keeps the locator alive.',
  },
  {
    title: 'GP transitioning from hand filing',
    body: 'Dentists upgrading from hand-file estimation to electronic apex measurement — the large display flattens the learning curve.',
  },
  {
    title: 'Pediatric and mixed-age clinics',
    body: 'Mixed-canal-anatomy days where stability across wet, dry, and bleed-contaminated readings matters more than raw speed.',
  },
];

function FilipinoClinics() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Built for Filipino practice</p>
          <h2 className={sectionTitle}>
            Six clinic profiles where FREE PEX wins.
          </h2>
        </motion.div>
        <motion.ul
          {...fadeUp}
          className="mt-8 divide-y divide-black/[0.08]"
        >
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

/* ─── TECH SPECS ─────────────────────────────────────────────── */
function TechSpecs() {
  const specs = [
    ['Form factor', 'Benchtop'],
    ['Measurement type', '6th-generation multi-frequency'],
    ['Canal conditions', 'Wet, dry, blood-contaminated'],
    ['Display', 'Large color LCD'],
    ['Audible alarm', 'Multi-stage tone (canal entry, apex, beyond)'],
    ['Power', 'Built-in rechargeable battery'],
    ['Charging', 'AC adapter (region-matched for PH)'],
    ['Calibration', 'Field-calibratable via DSD service'],
    ['Origin', 'Denjoy Dental, Hunan, China'],
    ['Distributor (PH)', 'DentaSource Direct (exclusive)'],
    ['Certification', 'FDA · CE'],
    ['Warranty', '12 months parts and service'],
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Technical specifications</p>
          <h2 className={sectionTitle}>Every number on the spec sheet.</h2>
        </motion.div>
        <motion.dl
          {...fadeUp}
          className="mt-8 divide-y divide-black/[0.08] rounded-xl bg-white border border-black/[0.06] overflow-hidden"
        >
          {specs.map(([k, v]) => (
            <div key={k} className="grid grid-cols-3 gap-3 px-4 py-3">
              <dt className="text-[12px] font-medium text-[#86868B]">{k}</dt>
              <dd className="col-span-2 text-[12.5px] text-[#1D1D1F]">{v}</dd>
            </div>
          ))}
        </motion.dl>
        <p className="mt-3 text-[11px] text-[#86868B] text-center">
          Voltage, weight, and dimensions confirmed at showroom demo + quote.
        </p>
      </div>
    </section>
  );
}

/* ─── GALLERY ────────────────────────────────────────────────── */
function Gallery() {
  const images = [
    {
      src: '/images/denjoy/free-pex/freepex-three-quarter.jpg',
      alt: 'Denjoy FREE PEX three-quarter view',
    },
    {
      src: '/images/denjoy/free-pex/freepex-front.jpg',
      alt: 'Denjoy FREE PEX front view with display',
    },
    {
      src: '/images/denjoy/free-pex/denjoy-freepex-1.jpg',
      alt: 'Denjoy FREE PEX in clinical setting',
    },
    {
      src: '/images/denjoy/free-pex/denjoy-freepex-2.jpg',
      alt: 'Denjoy FREE PEX alternate view',
    },
  ];
  const [openIdx, setOpenIdx] = useState(null);
  const isOpen = openIdx !== null;
  const close = () => setOpenIdx(null);
  const next = () => setOpenIdx((i) => (i + 1) % images.length);
  const prev = () => setOpenIdx((i) => (i - 1 + images.length) % images.length);

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
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
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
                sizes="(min-width: 1024px) 280px, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <ChevronRight className="size-5" />
            </button>
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
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
              <p className="text-[12px] text-white/85 px-4 text-center">
                {images[openIdx].alt}
              </p>
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

/* ─── FAQ ────────────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Common questions</p>
          <h2 className={sectionTitle}>Answers, before you ask.</h2>
        </motion.div>
        <div className="mt-8 divide-y divide-black/[0.08] rounded-xl bg-white border border-black/[0.06] overflow-hidden">
          {freePexFaqs.map((f, i) => (
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
                <span className="size-6 rounded-full bg-[#F8F7F4] group-open:bg-emerald-50 flex items-center justify-center text-[#86868B] group-open:text-emerald-700 group-open:rotate-45 transition-all text-[12px] shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-[#52525B]">
                {f.a}
              </p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ──────────────────────────────────────────────── */
function FinalCta() {
  const items = [
    'Live FREE PEX measurement on a real canal',
    'Side-by-side wet vs dry stability comparison',
    'Bundle pricing — FREE PEX standalone or with Meet Endo',
    'Warranty walkthrough + calibration plan',
    'Tour of the Pasig showroom (chairs, imaging, sterilization)',
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Visit the showroom</p>
          <h2 className={sectionTitle}>
            Hold FREE PEX before you buy.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Visit the DSD Pasig showroom for a live measurement
            demonstration — FREE PEX standalone, then the same chip running
            inside Meet Endo. Same lineage, two workflows.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-7 divide-y divide-black/[0.08]">
          {items.map((l) => (
            <li
              key={l}
              className="flex items-center gap-2.5 py-2.5 text-[13px] text-[#1D1D1F]"
            >
              <Check />
              {l}
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/contact?interest=endo"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
            <Arrow />
          </Link>
          <Link
            href="/contact?interest=endo"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] bg-white text-[#1D1D1F] px-5 py-2.5 text-[13px] font-medium hover:bg-[#F8F7F4] transition"
          >
            Request a quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
