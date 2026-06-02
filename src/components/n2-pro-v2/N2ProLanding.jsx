'use client';
import { useState, useEffect } from 'react';
import { m as motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, BadgeCheck, ShieldCheck, Award, FileCheck2, MessageCircle, Eye } from 'lucide-react';
import N2ProAutoplayHero from './N2ProAutoplayHero';
import {
  heroPitch,
  numericFlexes,
  quietDifference,
  featureCards,
  nSeriesComparison,
  colors,
  upholstery,
  specGroups,
  standards,
  microbiologicalCerts,
  dsdWarranty,
  ocularInspection,
  faqs,
  galleryImages,
} from './n2proContent';

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
const bodyText = 'text-[14px] sm:text-[15px] leading-relaxed text-[#52525B]';

export default function N2ProLanding() {
  return (
    <>
      <N2ProAutoplayHero />
      <Pitch />
      <QuietDifference />
      <CompareSeries />
      <ColorsAndUpholstery />
      <SpecsSheet />
      <StandardsBlock />
      <Warranty />
      <Installation />
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

/* ─── 2. PITCH (3 numeric flexes) ─────────────────────────── */
function Pitch() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>The flagship</p>
          <h2 className={sectionTitle}>What the numbers actually mean.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>{heroPitch}</p>
        </motion.div>

        <motion.dl {...fadeUp} className="mt-10 grid sm:grid-cols-3 gap-6 sm:gap-4">
          {numericFlexes.map((f) => (
            <div key={f.label} className="border-t border-black/[0.08] pt-4">
              <dt className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-[#1D1D1F]">
                {f.figure}
              </dt>
              <dd className="mt-1 text-[12.5px] font-medium text-emerald-700 uppercase tracking-wide">
                {f.label}
              </dd>
              <dd className="mt-2 text-[12.5px] leading-relaxed text-[#52525B]">{f.note}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/* ─── 3. QUIET DIFFERENCE (anchor narrative + feature cards) ─ */
function QuietDifference() {
  const [openIdx, setOpenIdx] = useState(null);
  const isOpen = openIdx !== null;
  const close = () => setOpenIdx(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
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
        <motion.div {...fadeUp} className="max-w-3xl mx-auto">
          <p className={eyebrow}>{quietDifference.eyebrow}</p>
          <h2 className={sectionTitle}>{quietDifference.title}</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>{quietDifference.body}</p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08] max-w-3xl mx-auto">
          {quietDifference.pillars.map((p) => (
            <li key={p.tag} className="py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {p.tag}
              </p>
              <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#52525B]">
                {p.body}
              </p>
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-10">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-3 text-center">
            Tap a feature to learn more
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {featureCards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setOpenIdx(i)}
                aria-label={`Learn more about ${card.title}`}
                className="group relative rounded-xl overflow-hidden bg-[#F8F7F4] border border-black/[0.06] text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 cursor-zoom-in"
              >
                <div className="aspect-[4/3] relative bg-white overflow-hidden">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-200">
                      {card.eyebrow}
                    </p>
                    <p className="mt-0.5 text-[13px] sm:text-[13.5px] font-semibold text-white leading-tight">
                      {card.title}
                    </p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 size-7 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-emerald-700 group-hover:bg-white transition">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="feature-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={`${featureCards[openIdx].title} detail`}
          >
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); close(); }}
              aria-label="Close feature detail"
              className="absolute top-4 right-4 z-10 size-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            >
              <X className="size-5" />
            </button>
            <motion.div
              key={openIdx}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-[#F8F7F4]">
                  <Image
                    src={featureCards[openIdx].src}
                    alt={featureCards[openIdx].alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain p-6"
                    priority
                  />
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <p className={eyebrow}>{featureCards[openIdx].eyebrow}</p>
                  <h3 className="mt-2 text-[22px] sm:text-[26px] font-semibold tracking-tight leading-[1.2] text-[#1D1D1F]">
                    {featureCards[openIdx].title}
                  </h3>
                  <p className="mt-3 text-[15px] sm:text-[16px] leading-snug font-medium text-[#1D1D1F]">
                    {featureCards[openIdx].lead}
                  </p>
                  <ul className="mt-5 divide-y divide-black/[0.08]">
                    {featureCards[openIdx].details.map((d) => (
                      <li key={d.label} className="py-3.5 first:pt-0">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                          {d.label}
                        </p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-[#52525B]">
                          {d.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── 4. COMPARE IN N-SERIES ──────────────────────────────── */
function CompareSeries() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Within the series</p>
          <h2 className={sectionTitle}>How the N2 Pro compares to N2+ and N1.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            All three N-series chairs share the silent motor and 150 kg max patient load. The Pro
            wins on workspace, light, disinfection, and chair memory.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 overflow-hidden rounded-xl bg-white border border-black/[0.06]">
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px]">
              <thead>
                <tr className="bg-[#F8F7F4]">
                  <th className="text-left font-medium text-[#86868B] px-4 py-3 w-1/3">Spec</th>
                  <th className="text-left font-semibold text-emerald-700 px-4 py-3">N2 Pro</th>
                  <th className="text-left font-medium text-[#1D1D1F] px-4 py-3">N2+</th>
                  <th className="text-left font-medium text-[#1D1D1F] px-4 py-3">N1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {nSeriesComparison.rows.map((r) => (
                  <tr key={r.label}>
                    <td className="px-4 py-3 text-[#52525B]">{r.label}</td>
                    <td className="px-4 py-3 text-[#1D1D1F] font-medium">{r.n2pro}</td>
                    <td className="px-4 py-3 text-[#52525B]">{r.n2plus}</td>
                    <td className="px-4 py-3 text-[#52525B]">{r.n1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 5. COLORS + UPHOLSTERY ──────────────────────────────── */
function ColorsAndUpholstery() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Configure your unit</p>
          <h2 className={sectionTitle}>Seven cabinet colors. Three upholstery materials.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            Any color pairs with any upholstery. ROSON&rsquo;s 2025/06 palette refresh added
            ROSON Blue (signature), Skyscraper Gray, and Mountain Blue.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-3">
            Cabinet colors
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colors.map((c) => (
              <div
                key={c.code}
                className="rounded-xl overflow-hidden border border-black/[0.06] bg-[#F8F7F4]"
              >
                <div className="aspect-square relative bg-white">
                  <Image
                    src={c.src}
                    alt={`ROSON N2 Pro in ${c.name}`}
                    fill
                    sizes="(min-width: 640px) 25vw, 50vw"
                    className="object-contain p-3"
                  />
                </div>
                <div className="px-3 py-2.5">
                  <p className="text-[12.5px] font-semibold text-[#1D1D1F]">{c.name}</p>
                </div>
              </div>
            ))}
            <Link
              href="/contact?interest=dental-chairs"
              className="group rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition flex flex-col"
            >
              <div className="aspect-square relative flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition">
                <div className="text-center px-3">
                  <MessageCircle className="size-6 text-emerald-700 mx-auto" strokeWidth={1.6} />
                  <p className="mt-2 text-[11.5px] font-semibold text-emerald-800 leading-tight">
                    Want a custom or limited color?
                  </p>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-[12.5px] font-semibold text-emerald-800">Message us</p>
                <p className="text-[10.5px] text-emerald-700/80">More options available on request</p>
              </div>
            </Link>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mt-10">
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#86868B] mb-3">
            Upholstery materials
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {upholstery.map((u) => (
              <div
                key={u.name}
                className="rounded-xl overflow-hidden border border-black/[0.06] bg-[#F8F7F4]"
              >
                <div className="aspect-[4/3] relative bg-white">
                  <Image
                    src={u.src}
                    alt={`${u.name} upholstery option for ROSON N2 Pro`}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-3 py-3">
                  <p className="text-[13.5px] font-semibold text-[#1D1D1F]">{u.name}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[#52525B]">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 6. SPECS SHEET (deep table) ─────────────────────────── */
function SpecsSheet() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Technical specifications</p>
          <h2 className={sectionTitle}>Every number on the spec sheet.</h2>
        </motion.div>

        <motion.div {...fadeUp} className="mt-8 space-y-6">
          {specGroups.map((group) => (
            <div key={group.label} className="rounded-xl bg-white border border-black/[0.06] overflow-hidden">
              <div className="bg-[#F8F7F4] border-b border-black/[0.06] px-4 py-2.5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {group.label}
                </p>
              </div>
              <dl className="divide-y divide-black/[0.06]">
                {group.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-3 px-4 py-3">
                    <dt className="text-[12px] font-medium text-[#86868B]">{k}</dt>
                    <dd className="col-span-2 text-[12.5px] text-[#1D1D1F]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 7. STANDARDS BLOCK (authority + real official logos) ─── */
function StandardsBlock() {
  const badges = [
    {
      src: '/images/badges/ce-marking.svg',
      alt: 'CE marking — European conformity',
      label: 'CE Marked',
      sub: 'Council Directive 93/42/EEC',
    },
    {
      src: '/images/badges/iec-logo.svg',
      alt: 'International Electrotechnical Commission logo',
      label: 'IEC 60601-1',
      sub: 'Electrical safety',
    },
    {
      src: '/images/badges/iso-9001-certified.png',
      alt: 'ISO 9001:2015 certified — quality management',
      label: 'ISO 9680:2014',
      sub: 'Operating light standard',
    },
    {
      src: '/images/badges/iso-with-text.jpeg',
      alt: 'International Organization for Standardization',
      label: 'EN ISO 7494',
      sub: 'Dental units, parts 1 & 2',
    },
  ];
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Standards & certifications</p>
          <h2 className={sectionTitle}>Independently certified — every claim auditable.</h2>
        </motion.div>

        {/* Real official compliance marks */}
        <motion.div {...fadeUp} className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.label}
              className="rounded-xl bg-white border border-black/[0.08] px-3 pt-4 pb-3 flex flex-col items-center text-center gap-2 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            >
              <div className="h-12 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.src}
                  alt={b.alt}
                  width={48}
                  height={48}
                  className="h-12 w-auto object-contain"
                />
              </div>
              <p className="text-[12px] font-semibold text-[#1D1D1F] leading-tight">{b.label}</p>
              <p className="text-[10px] text-[#86868B] leading-tight">{b.sub}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="mt-6 grid md:grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#F8F7F4] p-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700 mb-3">
              Full compliance list
            </p>
            <ul className="space-y-2 text-[12.5px] text-[#1D1D1F]">
              {standards.map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <BadgeCheck className="size-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-[#F8F7F4] p-5">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700 mb-3">
              Sorusha disinfectant — 6 microbiological certs
            </p>
            <ul className="space-y-2 text-[12.5px] text-[#1D1D1F]">
              {microbiologicalCerts.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <ShieldCheck className="size-3.5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 8. WARRANTY (DSD local support) ─────────────────────── */
function Warranty() {
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>DSD local-support warranty</p>
          <h2 className={sectionTitle}>Backed in Pasig, not in offshore email queues.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            DentaSource Direct is the exclusive ROSON service center for the Philippines. Every
            warranty visit is performed locally, with parts staged at the Pasig facility — no
            international RMA wait, no warranty-chain ambiguity.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {dsdWarranty.map((w) => (
            <li key={w.term} className="flex items-start gap-5 py-5">
              <span className="shrink-0 w-24 sm:w-28 text-[15px] sm:text-[16px] font-semibold text-emerald-700">
                {w.term}
              </span>
              <p className="flex-1 text-[13.5px] leading-relaxed text-[#52525B]">{w.body}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ─── 9. FREE OCULAR INSPECTION ───────────────────────────── */
function Installation() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp} className="flex items-start gap-3">
          <Eye className="size-5 text-emerald-700 mt-1.5 shrink-0" strokeWidth={1.75} />
          <div>
            <p className={eyebrow}>{ocularInspection.eyebrow}</p>
            <h2 className={sectionTitle}>{ocularInspection.title}</h2>
          </div>
        </motion.div>

        <motion.p {...fadeUp} className={`mt-4 ${bodyText} max-w-xl pl-8`}>
          {ocularInspection.intro}
        </motion.p>

        <motion.ul {...fadeUp} className="mt-8 divide-y divide-black/[0.08]">
          {ocularInspection.whatWeAdvise.map((it) => (
            <li key={it.tag} className="py-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                {it.tag}
              </p>
              <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-[#52525B]">
                {it.body}
              </p>
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8">
          <Link
            href="/contact?interest=dental-chairs"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-[13px] font-medium transition"
          >
            {ocularInspection.cta}
            <Arrow />
          </Link>
          <p className="mt-3 text-[11.5px] text-[#86868B]">
            No obligation. We bring the tape measure and the floor plan; you bring the questions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── 10. GALLERY (lightbox) ──────────────────────────────── */
function Gallery() {
  const [openIdx, setOpenIdx] = useState(null);
  const isOpen = openIdx !== null;
  const close = () => setOpenIdx(null);
  const next = () => setOpenIdx((i) => (i + 1) % galleryImages.length);
  const prev = () => setOpenIdx((i) => (i - 1 + galleryImages.length) % galleryImages.length);

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
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Product gallery</p>
          <h2 className={sectionTitle}>Look closer.</h2>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 gap-3">
          {galleryImages.map((img, i) => (
            <motion.button
              key={img.src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.04 }}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`Open ${img.alt} full-size`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-white border border-black/[0.04] cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
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
                src={galleryImages[openIdx].src}
                alt={galleryImages[openIdx].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </motion.div>
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
              <p className="text-[12px] text-white/85 px-4 text-center">{galleryImages[openIdx].alt}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 tabular-nums">
                {openIdx + 1} / {galleryImages.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── 11. FAQ ─────────────────────────────────────────────── */
function FaqSection() {
  return (
    <section className={`${sectionPad} bg-white`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Common questions</p>
          <h2 className={sectionTitle}>Answers, before you ask.</h2>
        </motion.div>

        <div className="mt-8 divide-y divide-black/[0.08] rounded-xl bg-[#F8F7F4] border border-black/[0.06] overflow-hidden">
          {faqs.map((f, i) => (
            <motion.details
              key={i}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.03 }}
              className="group px-4 py-3.5 open:bg-white transition-colors"
            >
              <summary className="flex items-center justify-between gap-3 cursor-pointer list-none">
                <span className="text-[13.5px] sm:text-[14px] font-semibold text-[#1D1D1F]">
                  {f.q}
                </span>
                <span className="size-6 rounded-full bg-white group-open:bg-emerald-50 flex items-center justify-center text-[#86868B] group-open:text-emerald-700 group-open:rotate-45 transition-all text-[12px] shrink-0">+</span>
              </summary>
              <p className="mt-3 text-[13px] leading-relaxed text-[#52525B]">{f.a}</p>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 12. FINAL CTA ───────────────────────────────────────── */
function FinalCta() {
  const items = [
    'Live N2 Pro on the showroom floor — sit in it, recline it, hear the silent motor',
    'Patient cycle walk-through (R, LP, P1/P2/P3 positions)',
    'Disinfection cabinet demo — switch sources, run a 30-second purge cycle',
    'Color and upholstery samples — pick your config in person',
    'Written quote within 1 business day, with bundle pricing on imaging + endo',
  ];
  return (
    <section className={`${sectionPad} bg-[#F8F7F4]`}>
      <div className="mx-auto max-w-3xl px-5 sm:px-6">
        <motion.div {...fadeUp}>
          <p className={eyebrow}>Visit the showroom</p>
          <h2 className={sectionTitle}>Sit in the N2 Pro before you commit.</h2>
          <p className={`mt-4 ${bodyText} max-w-xl`}>
            DentaSource Direct operates a 140-square-meter showroom in Pasig with the N2 Pro on
            the floor. Visits are by appointment so you get an unhurried, hands-on walkthrough.
          </p>
        </motion.div>

        <motion.ul {...fadeUp} className="mt-7 divide-y divide-black/[0.08]">
          {items.map((l) => (
            <li key={l} className="flex items-start gap-2.5 py-2.5 text-[13px] text-[#1D1D1F]">
              <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-1" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{l}</span>
            </li>
          ))}
        </motion.ul>

        <motion.div {...fadeUp} className="mt-8 flex flex-wrap gap-3">
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
