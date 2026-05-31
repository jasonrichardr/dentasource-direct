'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Hand,
  Activity,
  Wifi,
  BatteryCharging,
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
import { iPexoFaqs } from './iPexoContent';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
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

export default function IPexoLanding() {
  return (
    <>
      <ProductIntro />
      <Pillars />
      <TouchscreenStory />
      <BatteryEndurance />
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
    { Icon: Hand, label: 'Phone-format touchscreen interface' },
    { Icon: Activity, label: 'Multi-frequency apex measurement' },
    { Icon: Wifi, label: 'Wireless handpiece pairing' },
    { Icon: BatteryCharging, label: '3.7V 2000mAh rechargeable battery' },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Apex locator · Touchable</p>
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight leading-[1.1] text-[#1D1D1F]">
            Denjoy i-Pexo
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl">
            The apex locator that feels like a phone. Tap, swipe, and pinch
            the apex graphic the same way you&rsquo;d interact with any
            modern device. Underneath the touchscreen lives the same
            measurement engine that powers the MeetPex module inside
            Meet&nbsp;Endo.
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
      tag: 'Interface',
      title: 'Phone-format touchscreen',
      body: 'A touch interface every modern clinician already knows how to use. Tap to set, swipe to scroll, pinch to zoom — the apex graphic responds the way a phone responds.',
    },
    {
      tag: 'Lineage',
      title: 'Same engine as Meet Endo',
      body: 'i-Pexo runs the identical measurement chip as the MeetPex module inside Meet Endo. One calibration standard across every operatory — standalone today, integrated tomorrow.',
    },
    {
      tag: 'Endurance',
      title: '2000mAh clinic-day battery',
      body: 'A 3.7V 2000mAh rechargeable battery carries through a high-volume endodontics day. No mid-day charging anxiety, no swap to backup units between cases.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The engineering</p>
          <h2 className={sectionTitle}>
            Three pillars behind a phone-format apex locator.
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

/* ─── TOUCHSCREEN STORY ──────────────────────────────────────── */
function TouchscreenStory() {
  const gestures = [
    {
      title: 'Tap',
      body: 'Set the apex reference. Confirm the measurement. Acknowledge the canal-entry tone.',
    },
    {
      title: 'Swipe',
      body: 'Scroll through file presets. Move between archived measurements. Switch operating modes.',
    },
    {
      title: 'Pinch',
      body: 'Zoom into the apex graphic for fine reading. Pull back for the full canal view.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Touchscreen, explained</p>
          <h2 className={sectionTitle}>
            The apex locator that feels like a{' '}
            <em className="not-italic text-emerald-700">phone</em>.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Most apex locators were designed in the era of physical
            buttons. i-Pexo was designed for a clinician whose first
            instinct is to touch the screen — because that&rsquo;s how
            every other device in their day already works.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-8 relative aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-black/[0.06]"
        >
          <Image
            src="/images/denjoy/i-pexo/ipexo-landscape-hero.jpg"
            alt="Denjoy i-Pexo touchscreen apex graphic in action"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {gestures.map((g) => (
            <li key={g.title} className="py-4">
              <h3 className="text-[15px] sm:text-[16px] font-semibold text-[#1D1D1F]">
                {g.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#52525B]">
                {g.body}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── BATTERY ENDURANCE ──────────────────────────────────────── */
function BatteryEndurance() {
  const stats = [
    {
      label: 'Capacity',
      value: '2000 mAh',
    },
    {
      label: 'Voltage',
      value: '3.7 V',
    },
    {
      label: 'Designed for',
      value: 'Full clinic day',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Extended battery endurance</p>
          <h2 className={sectionTitle}>
            2000 mAh. No mid-day charge anxiety.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            High-capacity 3.7V 2000mAh battery delivers an enduring,
            reliable power supply — uninterrupted focus on the patient,
            no concern over power drain between cases.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          className="mt-8 grid grid-cols-3 gap-3"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-black/[0.06] bg-[#F8F7F4] p-4 text-center"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#86868B]">
                {s.label}
              </p>
              <p className="mt-2 text-[18px] sm:text-[20px] font-semibold text-emerald-700">
                {s.value}
              </p>
            </div>
          ))}
        </motion.div>
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
            i-Pexo is a complete touchable apex locator on its own. It
            also shares its measurement engine with Meet Endo&rsquo;s
            MeetPex module — so a clinic running both keeps a single
            calibration standard across every operatory.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 grid sm:grid-cols-3 gap-3">
          <KitCard
            label="Standalone"
            title="i-Pexo"
            specs={[
              'Phone-format touchscreen',
              'Wireless handpiece',
              '2000 mAh battery',
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
    title: 'Phone-native clinicians',
    body: 'Dentists who already do everything else on a touchscreen. The familiar gesture set means the apex graphic responds the way they expect.',
  },
  {
    title: 'Multi-operatory clinics on Denjoy',
    body: 'Clinics standardizing on Denjoy across rooms — i-Pexo shares the MeetPex measurement lineage for consistent calibration.',
  },
  {
    title: 'Family practices upgrading endo',
    body: 'GPs adding rotary endodontics. The touchscreen flattens the learning curve faster than physical-button locators.',
  },
  {
    title: 'Provincial and outreach setups',
    body: 'Rural clinics where field repairs are slow — local DSD warranty + Pasig service center keeps the locator alive.',
  },
  {
    title: 'Teaching hospitals and CPD programs',
    body: 'Training new dentists on a touchscreen interface they will see again on every clinical instrument they encounter for the rest of their careers.',
  },
  {
    title: 'Pediatric and mixed-age clinics',
    body: 'Mixed-canal-anatomy days where the wireless handpiece + touchscreen workflow keeps the chair-side dance fluid.',
  },
];

function FilipinoClinics() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Built for Filipino practice</p>
          <h2 className={sectionTitle}>
            Six clinic profiles where i-Pexo wins.
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
    ['Form factor', 'Phone-format handheld with stand'],
    ['Display', 'Color touchscreen'],
    ['Interface', 'Tap · Swipe · Pinch gesture set'],
    ['Measurement type', 'Multi-frequency apex (MeetPex lineage)'],
    ['Canal conditions', 'Wet, dry, blood-contaminated'],
    ['Handpiece', 'Wireless'],
    ['Battery', '3.7 V · 2000 mAh rechargeable'],
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
      src: '/images/denjoy/i-pexo/ipexo-front-hero.jpg',
      alt: 'Denjoy i-Pexo at the DSD Pasig showroom',
    },
    {
      src: '/images/denjoy/i-pexo/ipexo-landscape-hero.jpg',
      alt: 'Denjoy i-Pexo landscape view with apex graphic on screen',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-1.jpg',
      alt: 'Denjoy i-Pexo three-quarter studio view',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-2.jpg',
      alt: 'Denjoy i-Pexo touchscreen detail',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-3.jpg',
      alt: 'Denjoy i-Pexo with stand',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-4.jpg',
      alt: 'Denjoy i-Pexo alternate angle',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-5.jpg',
      alt: 'Denjoy i-Pexo with wireless handpiece',
    },
    {
      src: '/images/denjoy/i-pexo/denjoy-ipexo-6.jpg',
      alt: 'Denjoy i-Pexo back view',
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
          {iPexoFaqs.map((f, i) => (
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
    'Live i-Pexo measurement on a real canal',
    'Touch-and-feel the gesture interface',
    'Bundle pricing — i-Pexo standalone or with Meet Endo',
    'Warranty walkthrough + calibration plan',
    'Tour of the Pasig showroom (chairs, imaging, sterilization)',
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Visit the showroom</p>
          <h2 className={sectionTitle}>Hold i-Pexo before you buy.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Visit the DSD Pasig showroom for a live measurement
            demonstration — i-Pexo standalone, then the same chip running
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
