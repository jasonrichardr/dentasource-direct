'use client';
import { useState, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers, Lightbulb, Armchair, Activity, Palette,
  X, ChevronLeft, ChevronRight, Save, Droplets, Sparkles,
  GraduationCap, Heart, Baby, Gem, Building2, Pencil,
} from 'lucide-react';
import { a1proFaqs, dentistSegments, signatureColors } from './a1proContent';
import A1ProAutoplayHero from './A1ProAutoplayHero';
import SpecGate from '@/components/SpecGate';

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

export default function A1ProLanding() {
  return (
    <>
      <A1ProAutoplayHero />
      <ProductIntro />
      <Pillars />
      <ColorStory />
      <SiliconeLeather />
      <SmartDetails />
      <RolightSDetail />
      <RS07StoolDetail />
      <FourHandedSpace />
      <DentistProfiles />
      <SpecGate><TechSpecs /></SpecGate>
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

/* ─── PRODUCT INTRO ─────────────────────────────────────────── */
function ProductIntro() {
  const features = [
    { Icon: Layers, label: '12 mm carbon-steel structural frame' },
    { Icon: Lightbulb, label: 'Rolight S 8-LED tri-mode dental light' },
    { Icon: Activity, label: 'Sleep-grade soft start/stop motion' },
    { Icon: Armchair, label: 'RS-07 Professional Dentist Stool included' },
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] font-semibold tracking-tight leading-[1.1] text-[#1D1D1F]">
            ROSON A1 Pro
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed text-[#52525B] max-w-xl">
            The first dental unit built for the new generation of dentists.
            Premium engineering. Color as a first-class design choice. The
            complete chair, stool, and light kit — out of the box, ready to
            define your practice.
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
            href="/contact?interest=dental-chairs"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── PILLARS ───────────────────────────────────────────────── */
function Pillars() {
  const items = [
    {
      tag: 'Stability',
      title: '12 mm Carbon-Steel Frame · 150 kg Patient Load',
      body: 'Premium carbon structural steel forms the load-bearing core. Rock-solid stability, no wobble during diagnosis, no drift across long procedures, no compromise on heavier patients.',
    },
    {
      tag: 'Motion',
      title: 'Sleep-Grade Soft Start/Stop System',
      body: 'Whisper-soft transitions on every chair adjustment. Quiet rise and fall reduces patient anxiety, especially for first-time visitors and pediatric cases. The chair never lurches — it eases.',
    },
    {
      tag: 'Workflow',
      title: 'Intelligent Memory + Linked Smart Workflows',
      body: 'One-touch chair-position memory. Smart Clean button auto-rinses the spittoon and flushes pipelines while the chair returns to entry pose. Every detail trims seconds off daily workflow — at scale, that\'s real time.',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The engineering</p>
          <h2 className={sectionTitle}>
            Three pillars beneath the colorful exterior.
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

/* ─── COLOR STORY (replaces FocalSpotStory — A1 Pro's signature feature) ─ */
function ColorStory() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The aesthetic statement</p>
          <h2 className={sectionTitle}>
            Three signature colors.{' '}
            <em className="not-italic text-emerald-700">Thirty-three</em> ways to make it yours.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            ROSON&rsquo;s design team pre-styled three signature palettes for the A1
            Pro — color stories you can drop into your operatory without a
            decorator. Beyond the signatures, twelve silicone leather options
            and twenty-one medical-grade PU leather options let you
            fully customize.
          </p>
        </motion.div>

        {/* Three signature color cards — chair silhouettes from brochure */}
        <motion.div {...fadeUp} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {signatureColors.map((c) => {
            const slug = c.name.toLowerCase().replace(/\s+/g, '-');
            return (
              <div
                key={c.name}
                className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
              >
                <div className="aspect-[4/5] relative" style={{ backgroundColor: c.hex }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/products/a1-pro/pieces/chair-silhouette-${slug}.png`}
                    alt={`ROSON A1 Pro in ${c.name} (${c.code}) — full chair silhouette from brochure`}
                    className="absolute inset-0 w-full h-full object-contain p-5"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/55 to-transparent">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                      {c.code}
                    </p>
                    <p className="text-[16px] font-semibold text-white">{c.name}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[12.5px] leading-relaxed text-[#52525B]">{c.poetry}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Customization grid reference */}
        <motion.div {...fadeUp} className="mt-6 rounded-2xl bg-white border border-black/[0.06] p-5">
          <p className={eyebrow}>Beyond the signatures</p>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[#52525B]">
            Soft silicone rubber leather: 12 colorways including Orange, Nacarat, Olive Green,
            Light Green, Grass Green, Coloured Mountain Blue, Sea Blue, Starry Sky Blue, and the
            three signatures. Medical-grade PU leather: 21 colorways including Amber, Brown,
            Ice Blue, Sky Blue, Navy, Lake Green, Yellow, Champagne, Pink, Red, Silver Gray,
            Bordeaux Red, Jewel Green, and the signatures.
          </p>
          <div className="mt-4 grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {[
              '#3D6F90', '#D87B8A', '#9BC5B4', '#E89B5A', '#D85A6F', '#7A9450',
              '#A8C97D', '#5C8A4E', '#3B5A7A', '#5577A8', '#7BA8C4', '#1C3A5C',
              '#C19B6F', '#7A4F2A', '#A8B8C4', '#7BA0C4', '#2C3E5C', '#5A8270',
              '#D4A85C', '#E8C896', '#1A1A1A',
            ].map((hex, i) => (
              <div
                key={i}
                className="aspect-square rounded-md border border-black/[0.05]"
                style={{ backgroundColor: hex }}
                aria-hidden
              />
            ))}
          </div>
          <p className="mt-3 text-[10.5px] text-[#86868B] leading-relaxed">
            Indicative palette swatches. Confirm exact color codes and lead times at the Pasig showroom — full physical sample panels are on hand.
          </p>
        </motion.div>

        {/* Integrated color customization callout — with brochure piece */}
        <motion.div {...fadeUp} className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 overflow-hidden">
          <div className="grid sm:grid-cols-2 items-center gap-4">
            <div className="aspect-[4/3] relative bg-white sm:bg-emerald-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/integrated-color-customization.png"
                alt="ROSON A1 Pro integrated color customization — water box, upholstery, and instrument tray color-matched as a set"
                className="absolute inset-0 w-full h-full object-contain p-3"
                loading="lazy"
              />
            </div>
            <div className="p-5 flex items-start gap-3">
              <Palette className="size-5 text-emerald-700 shrink-0 mt-0.5" strokeWidth={1.6} />
              <div>
                <p className="text-[14px] font-semibold text-[#1D1D1F]">
                  Integrated color customization
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#52525B]">
                  Water box, upholstery, and instrument tray color-matched as a set —
                  a unified visual language across every clinical surface. Your operatory
                  stops looking like a medical room and starts looking like your brand.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── SILICONE LEATHER (replaces UpholsteryStory) ───────────── */
function SiliconeLeather() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The upholstery</p>
          <h2 className={sectionTitle}>
            Soft silicone rubber leather. A new era of dental-unit comfort.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Upholstery is the only part of the chair the patient touches with
            their whole body for forty minutes at a time. The A1 Pro&rsquo;s soft
            silicone rubber leather is engineered for skin-level comfort,
            stain-resistance, and a 20,000-cycle Martindale abrasion rating —
            wipe-clean instantly, stays like new for years.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 rounded-2xl overflow-hidden border border-black/[0.06] bg-white">
          <div className="aspect-[5/3] relative bg-[#F8F7F4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/a1-pro/pieces/silicone-leather-rainbow-drape.png"
              alt="ROSON A1 Pro soft silicone rubber leather upholstery — rainbow drape showing color depth, stain-resistance, and CNAS-certified durability"
              className="absolute inset-0 w-full h-full object-contain p-4"
              loading="lazy"
            />
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
          {[
            { label: 'Stain-resistant', sub: 'Wipes clean instantly' },
            { label: 'Abrasion-resistant', sub: '20,000 Martindale cycles' },
            { label: 'UV-resistant', sub: 'Resists yellowing & fading' },
            { label: 'Hypoallergenic', sub: 'CNAS-accredited' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-[#F8F7F4] p-3 border border-black/[0.04]">
              <p className="text-[12px] font-semibold text-[#1D1D1F]">{s.label}</p>
              <p className="mt-1 text-[11px] leading-snug text-[#86868B]">{s.sub}</p>
            </div>
          ))}
        </motion.div>

        {/* Two color charts side-by-side from brochure */}
        <motion.div {...fadeUp} className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[#F8F7F4] border border-black/[0.06] overflow-hidden">
            <div className="aspect-[5/4] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/silicone-leather-color-chart.png"
                alt="A1 Pro silicone leather color chart — 12 soft silicone rubber leather options (FS series)"
                className="absolute inset-0 w-full h-full object-contain p-3"
                loading="lazy"
              />
            </div>
            <div className="px-4 pb-4">
              <p className="text-[12px] font-semibold text-[#1D1D1F]">Soft silicone rubber leather</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#86868B]">
                12 colorways · including the 3 signatures (FS21 / FS22 / FS23).
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-[#F8F7F4] border border-black/[0.06] overflow-hidden">
            <div className="aspect-[5/4] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/pu-leather-color-chart.png"
                alt="A1 Pro PU leather color chart — 21 medical-grade PU leather options (PU series)"
                className="absolute inset-0 w-full h-full object-contain p-3"
                loading="lazy"
              />
            </div>
            <div className="px-4 pb-4">
              <p className="text-[12px] font-semibold text-[#1D1D1F]">Medical-grade PU leather</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-[#86868B]">
                21 colorways · the durability-tier pick for high-volume operatories.
              </p>
            </div>
          </div>
        </motion.div>
        <p className="mt-3 text-[10.5px] text-[#86868B] text-center">
          Confirm exact color codes and lead times at the Pasig showroom — full physical sample panels are on hand.
        </p>
      </div>
    </section>
  );
}

/* ─── SMART DETAILS — Pro Shortcut hero + 3 icon cards + 4 detail tiles ── */
function SmartDetails() {
  const iconCards = [
    {
      Icon: Save,
      title: 'Intelligent Memory',
      body: 'Short press → enter/exit position. Press again → returns to last treatment position.',
    },
    {
      Icon: Droplets,
      title: 'Cup Fill & Rinse Linkage',
      body: 'Spittoon rinse auto-starts 8 seconds after cup filling. One workflow, two actions.',
    },
    {
      Icon: Sparkles,
      title: 'Smart Clean Button',
      body: 'One touch lifts the chair, triggers a 5-minute spittoon rinse and pipeline flush.',
    },
  ];

  const detailTiles = [
    {
      title: '4-Position Adjustable Handpiece Holder',
      body: 'Grasp, Grip Angle 1, Grip Angle 2, Storage. Sleeves stay clear of burs — clinical risk reduced where it matters most.',
      img: '/images/products/a1-pro/pieces/handpiece-holder-4-positions.png',
      alt: 'A1 Pro 4-position adjustable handpiece holder showing Grasp, Grip Angle 1, Grip Angle 2, and Storage positions',
    },
    {
      title: 'Spittoon Odor Trap',
      body: 'Blocks sewer odors at the source — the operatory stays fresh between cases.',
      img: '/images/products/a1-pro/pieces/spittoon-odor-trap-gloved.png',
      alt: 'A1 Pro spittoon odor trap with gloved hand operating the rotary handle — contact-free operation',
    },
    {
      title: 'Integrated Rotary Handle',
      body: 'Rotary operation. No contact with the spittoon bowl. Cross-infection reduced in every detail.',
      img: '/images/products/a1-pro/pieces/integrated-rotary-handle.png',
      alt: 'A1 Pro integrated rotary spittoon handle — contact-free operation',
    },
    {
      title: 'Patient Self-Help Cup Filling',
      body: 'One button. Patient fills their own cup and rinses, freeing the dentist and assistant on high-throughput days.',
      img: '/images/products/a1-pro/pieces/patient-self-help-cup-fill.png',
      alt: 'A1 Pro patient self-help cup filling button — patient-controlled one-touch dispenser',
    },
  ];

  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <motion.div {...fadeUp} className="max-w-3xl">
          <p className={eyebrow}>Smart details</p>
          <h2 className={sectionTitle}>
            Every detail trims a few seconds off the day.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Multiplied across hundreds of patients per week, the smart
            workflows built into the A1 Pro give your team back real time —
            and reduce the small frictions that compound into staff fatigue.
          </p>
        </motion.div>

        {/* Pro Shortcut Combos — hero piece (sculpted iridescent control panel) */}
        <motion.div {...fadeUp} className="mt-10 rounded-2xl bg-white border border-black/[0.06] overflow-hidden">
          <div className="grid sm:grid-cols-5 items-center gap-0">
            <div className="sm:col-span-3 aspect-[16/9] sm:aspect-auto sm:h-full relative bg-[#F8F7F4] min-h-[260px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/pro-shortcut-control-panel.png"
                alt="A1 Pro Pro Shortcut Combos — sculpted iridescent control panel with three smart shortcuts"
                className="absolute inset-0 w-full h-full object-contain p-4"
                loading="lazy"
              />
            </div>
            <div className="sm:col-span-2 p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Pro Shortcut Combos
              </p>
              <h3 className="mt-2 text-[18px] sm:text-[20px] font-semibold text-[#1D1D1F] leading-tight">
                A trio of one-touch automations.
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-[#52525B]">
                Memory recall, cup-fill linkage, and Smart Clean — three workflows that used to take
                a sequence of menu clicks, now condensed onto a single iridescent panel.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Three native icon cards */}
        <motion.div {...fadeUp} className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {iconCards.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white border border-black/[0.06] p-6">
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <c.Icon className="size-5" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-[14px] font-semibold text-[#1D1D1F]">{c.title}</h3>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#52525B]">{c.body}</p>
            </div>
          ))}
        </motion.div>

        {/* Four detail tiles */}
        <motion.div {...fadeUp} className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {detailTiles.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden flex flex-col">
              <div className="aspect-[4/3] relative bg-[#F8F7F4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                  loading="lazy"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-[13px] font-semibold text-[#1D1D1F]">{c.title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-[#52525B]">{c.body}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── ROLIGHT S DETAIL ──────────────────────────────────────── */
function RolightSDetail() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Rolight S Dental Light</p>
          <h2 className={sectionTitle}>
            A large light spot. Tri-mode, hands-free, removable.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            The Rolight S delivers stable, consistent brightness across the
            entire oral cavity. Three light modes — yellow, white, and mixed —
            switch as the case demands. Dual control: infrared sensing for
            hands-free operation plus a precise manual button. The handle is
            removable for thorough disinfection — an HAI-prevention detail
            that matters across thousands of patient turnovers.
          </p>
        </motion.div>

        {/* Three isolated Rolight S detail panels */}
        <motion.div {...fadeUp} className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              tag: 'Tri-mode source',
              title: 'Yellow · White · Mixed',
              body: 'Switch as the case demands. Yellow is composite-friendly — it won’t trigger early curing.',
              img: '/images/products/a1-pro/pieces/rolight-s-light-tri-mode.png',
              alt: 'Rolight S 8-LED tri-mode light — yellow, white, and mixed color modes',
            },
            {
              tag: 'Dual control',
              title: 'Infrared + Manual',
              body: 'Wave for hands-free activation, glove-friendly. Manual button is right there when you want precision.',
              img: '/images/products/a1-pro/pieces/rolight-s-dual-mode-control.png',
              alt: 'Rolight S dual mode control — infrared sensor and manual button',
            },
            {
              tag: 'Disinfection',
              title: 'Removable handle',
              body: 'Detachable handle for thorough cleaning between cases — HAI-prevention detail across thousands of patient turnovers.',
              img: '/images/products/a1-pro/pieces/rolight-s-removable-handle.png',
              alt: 'Rolight S removable handle for sterilization between cases',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden">
              <div className="aspect-[4/3] relative bg-[#F8F7F4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.alt}
                  className="absolute inset-0 w-full h-full object-contain p-3"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {c.tag}
                </p>
                <h3 className="mt-1.5 text-[14px] font-semibold text-[#1D1D1F]">{c.title}</h3>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#52525B]">{c.body}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── RS-07 STOOL DETAIL ────────────────────────────────────── */
function RS07StoolDetail() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Included as standard</p>
          <h2 className={sectionTitle}>
            RS-07 Professional Dentist Stool. Engineered against occupational fatigue.
          </h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Most chairs leave the stool to a separate budget line. The A1 Pro
            ships with the RS-07 — a clinical and rest-grade dentist stool
            designed to prevent the lumbar and circulatory strain dentists
            report after years of standard stools. U-shaped ventilation cutout,
            adaptive 90°-110° backrest, sloped leg rest, and a 300-428 mm
            adjustable seat depth that contours to your natural lumbar curve.
          </p>
        </motion.div>

        {/* Feature blocks panel — full-width hero */}
        <motion.div {...fadeUp} className="mt-8 rounded-2xl overflow-hidden border border-black/[0.06] bg-white">
          <div className="aspect-[2/1] relative bg-[#F8F7F4]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/products/a1-pro/pieces/rs07-stool-feature-blocks.png"
              alt="RS-07 Professional Dentist Stool — feature blocks: U-shaped ventilation, 90°-110° adaptive backrest, sloped leg rest, 300-428 mm adjustable seat depth"
              className="absolute inset-0 w-full h-full object-contain p-4"
              loading="lazy"
            />
          </div>
        </motion.div>

        {/* Two stool views — front + rear */}
        <motion.div {...fadeUp} className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden">
            <div className="aspect-[3/4] relative bg-[#F8F7F4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/rs07-stool-front-view.png"
                alt="RS-07 dentist stool front view — adaptive backrest and sloped leg rest"
                className="absolute inset-0 w-full h-full object-contain p-4"
                loading="lazy"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-[11.5px] font-semibold text-[#1D1D1F]">Front view</p>
              <p className="mt-0.5 text-[11px] text-[#86868B]">Sloped leg rest · adaptive recline</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden">
            <div className="aspect-[3/4] relative bg-[#F8F7F4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/rs07-stool-rear-view.png"
                alt="RS-07 dentist stool rear view — U-shaped ventilation cutout"
                className="absolute inset-0 w-full h-full object-contain p-4"
                loading="lazy"
              />
            </div>
            <div className="p-3 text-center">
              <p className="text-[11.5px] font-semibold text-[#1D1D1F]">Rear view</p>
              <p className="mt-0.5 text-[11px] text-[#86868B]">U-shaped ventilation cutout</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOUR-HANDED TREATMENT SPACE ──────────────────────────── */
function FourHandedSpace() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div {...fadeUp}>
            <p className={eyebrow}>Four-handed dentistry</p>
            <h2 className={sectionTitle}>
              Reinvented for unobstructed assistant collaboration.
            </h2>
            <p className={`mt-4 ${bodyText} max-w-xl`}>
              The instrument tray and chair are scientifically positioned to reserve
              ample operating space for the assistant. Layout follows clinical habits —
              close-up treatment, greater precision, efficient staff workflow,
              optimized patient comfort.
            </p>
            <ul className="mt-5 divide-y divide-black/[0.08]">
              {[
                'Tray geometry tuned for assistant pass-and-receive',
                'Chair geometry preserves dentist + assistant arm radius',
                'Patient remains centered without re-positioning between roles',
              ].map((l) => (
                <li key={l} className="flex items-start gap-2.5 py-2.5 text-[13px] text-[#1D1D1F]">
                  <Check />
                  <span>{l}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-2xl overflow-hidden border border-black/[0.06] bg-[#F8F7F4]">
            <div className="aspect-square relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/products/a1-pro/pieces/four-handed-top-down-pink.png"
                alt="ROSON A1 Pro four-handed treatment space — top-down view of Ballet Pink chair with dentist and assistant positions, instrument tray geometry"
                className="absolute inset-0 w-full h-full object-contain p-4"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── DENTIST PROFILES (replaces FilipinoClinics) ───────────── */
const segmentIcons = [GraduationCap, Heart, Baby, Gem, Building2, Pencil];

function DentistProfiles() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Built for the new generation</p>
          <h2 className={sectionTitle}>
            Six dentist profiles where the A1 Pro fits.
          </h2>
        </motion.div>
        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {dentistSegments.map((s, i) => {
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
    ['Frame', '12 mm premium carbon structural steel'],
    ['Maximum patient load', '150 kg'],
    ['Motion system', 'Sleep-grade soft start/stop'],
    ['Operating light', 'Rolight S — 8-LED, large illumination spot'],
    ['Light modes', 'Yellow, White, Mixed (tri-mode)'],
    ['Light control', 'Infrared sensing + manual button'],
    ['Light handle', 'Removable for thorough disinfection'],
    ['Memory positions', 'Intelligent chair-position recall (one-touch)'],
    ['Smart Clean button', 'Auto-rinse spittoon (5 min) + pipeline flush'],
    ['Cup filling', 'Linked to spittoon rinse + patient self-help button'],
    ['Handpiece holder', '4-position adjustable (storage + 2 grip angles)'],
    ['Spittoon', 'Detachable ceramic, with rotary odor trap'],
    ['Upholstery', 'Soft silicone rubber leather OR medical-grade PU leather'],
    ['Signature colors', 'ROSON Blue, Ballet Pink, Mint Green'],
    ['Custom colors', '12 silicone + 21 PU leather options'],
    ['Dentist stool', 'RS-07 Professional (included standard)'],
    ['Stool ventilation', 'U-shaped cutout for groin-area airflow'],
    ['Stool backrest', '90°-110° adaptive recline'],
    ['Stool seat depth', '300-428 mm adjustable'],
    ['Origin', 'Foshan Roson Medical, China'],
    ['Distributor (PH)', 'DentaSource Direct (exclusive)'],
    ['Warranty', '2 years (1st year parts + service, 2nd year service)'],
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
          Voltage, motor current, dimensions, and crating weight confirmed at showroom demo + quote.
        </p>
      </div>
    </section>
  );
}

/* ─── GALLERY (tap-to-zoom lightbox) ────────────────────────── */
function Gallery() {
  const images = [
    { src: '/images/products/a1-pro/hero.jpg', alt: 'A1 Pro — full chair with light arm and assistant tray' },
    { src: '/images/products/a1-pro/view-2-headrest.jpg', alt: 'A1 Pro headrest detail — navy silicone leather upholstery' },
    { src: '/images/products/a1-pro/view-3-touchscreen.jpg', alt: 'A1 Pro touchscreen control panel — dental icons and chair memory' },
    { src: '/images/products/a1-pro/view-4-instrument-arm.jpg', alt: 'A1 Pro swing-mount instrument bridge with five handpieces' },
    { src: '/images/products/a1-pro/view-5-light.jpg', alt: 'Rolight S 8-LED dental light head — tri-mode, IR-controlled' },
    { src: '/images/products/a1-pro/view-6-cart.jpg', alt: 'A1 Pro full unit with optional cart-mounted instrument tray' },
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
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.button
              key={img.src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Open ${img.alt} full-size`}
              className="group relative aspect-video overflow-hidden rounded-xl bg-white border border-black/[0.06] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 320px, 50vw"
                className="object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
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
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close image viewer"
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 size-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
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
          {a1proFaqs.map((f, i) => (
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
    'Live A1 Pro demonstration in your preferred signature color',
    'Sit in the RS-07 stool and feel the soft start/stop motion',
    'Touch every silicone and PU upholstery sample on hand',
    'Walk through smart workflows: memory, smart clean, cup-fill linkage',
    'Complete kit pricing — chair, stool, light, instrument bridge',
    'Tour of the Pasig showroom (chairs, imaging, sterilization)',
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Visit the showroom</p>
          <h2 className={sectionTitle}>Sit in the A1 Pro before you choose.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Color is a decision best made in person. Visit the Pasig showroom
            to feel the leather, hear the motor, and see your three signature
            colors in real light — paired with the RS-07 stool and Rolight S
            light, exactly as the kit ships.
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
            href="/contact?interest=dental-chairs"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            Book a showroom demo
            <Arrow />
          </Link>
          <Link
            href="/contact?interest=dental-chairs"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.12] bg-white text-[#1D1D1F] px-5 py-2.5 text-[13px] font-medium hover:bg-[#F8F7F4] transition"
          >
            Request a quote
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
