'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import { products } from '@/data/products';
import styles from './page.module.css';

const featuredSlugs = ['roson-dxa3', 'roson-dxn2-pro', 'roson-dxs6', 'mecco-q9-curing-light', 'mecco-endo-star-s', 'mecco-mcray-ii'];
const featuredProducts = featuredSlugs.map(s => products.find(p => p.slug === s)).filter(Boolean);

const whyUsItems = [
  {
    num: '01',
    icon: '🤝',
    title: 'Closer to the Dentist',
    desc: "We operate at clinic level, not corporate scale. We understand startup clinics, expanding practices, and multi-branch realities. Decisions are fast, human, and practical.",
    highlight: "Dentists aren't just customers — they're partners.",
  },
  {
    num: '02',
    icon: '🏛️',
    title: 'Showroom-First Experience',
    desc: 'Visit our showroom and experience the equipment firsthand. Sit on the chair, feel the stability, test the ergonomics. We believe equipment should be experienced, not just explained.',
    highlight: 'Specs inform. Experience convinces.',
  },
  {
    num: '03',
    icon: '🎓',
    title: 'Training & Education Built In',
    desc: "We don't just sell products — we build capability. Hands-on training, product mastery, workflow understanding, and a growth mindset for your practice.",
    highlight: 'We help dentists grow into stronger operators.',
  },
  {
    num: '04',
    icon: '💎',
    title: 'Flexible & Transparent',
    desc: "Flexible payment options, practical bundles, and honest recommendations — even if it means selling less. We optimize for your clinic's reality, not our margin.",
    highlight: 'Long-term trust over short-term margin.',
  },
  {
    num: '05',
    icon: '🇵🇭',
    title: 'Built in the Philippines, For Filipino Dentists',
    desc: "We understand local clinic economics, space constraints, staffing realities, and patient behavior. Our support is faster, culturally aligned, and grounded in local reality.",
    highlight: "We don't just sell here — we're building here.",
  },
];

const services = [
  { icon: '🚚', title: 'White Glove Delivery', desc: 'Equipment transported with care, unpacked and placed exactly where you need it. Zero stress.' },
  { icon: '🔧', title: 'Professional Installation', desc: 'Proper positioning, connections, and calibration by experienced technicians — ready to operate on day one.' },
  { icon: '📋', title: 'Training & Orientation', desc: 'Staff walkthrough on safe operation, maintenance basics, and workflow optimization for your specific setup.' },
  { icon: '🛠️', title: 'After-Sales Service', desc: 'Rehousing, repairs, parts sourcing, and ongoing technical support whenever you need it.' },
  { icon: '👁️', title: 'Free Ocular Visitation', desc: 'We visit your space before purchase to assess layout, utilities, and recommend the best configuration.' },
  { icon: '🧹', title: 'Post-Install Cleanup', desc: 'We clean up after ourselves. Your operatory is left spotless and ready for patients.' },
];

const trustStats = [
  { value: '2-Year', label: 'Warranty on Chairs' },
  { value: '24+', label: 'Products Available' },
  { value: 'Free', label: 'Metro Manila Install' },
  { value: '7 Days', label: 'Weekly Support' },
];

export default function Home() {
  return (
    <main className="relative bg-black h-[100dvh] overflow-y-auto snap-y snap-mandatory perspective-[1px] transform-style-preserve-3d font-sans">

      {/* ── CARD 1: HERO & MARQUEE ─────────────────────────────────── */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-10 flex flex-col bg-[#1E3A2E] bg-gradient-to-b from-[#182e24] to-[#12241c]">
        <section className="relative flex-1 flex flex-col items-center justify-center pt-24 pb-12">
          {/* Glow effect at the top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[#2E7D32]/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">Trusted Dental Equipment Partner in the Philippines</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] leading-[1.05] font-medium tracking-tight text-center max-w-5xl mb-6"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your <span className="text-[#F26522] italic font-serif tracking-normal">Growth Partner</span><br />in Dentistry.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/75 text-base sm:text-lg md:text-xl font-light text-center max-w-3xl mb-10 flex-1"
              style={{ lineHeight: '1.7' }}
            >
              Premium dental chairs and equipment with white-glove installation, hands-on training, and the personalized support your practice deserves.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/contact" className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-[#F26522] text-white font-medium hover:bg-[#d9581a] hover:scale-105 transition-all shadow-lg shadow-[#F26522]/30">
                Book a Showroom Experience
              </Link>
              <Link href="/products" className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all font-medium">
                Explore Products
              </Link>
            </motion.div>
          </div>
        </section>

        {/* TRUST STRIP / MARQUEE */}
        <section className="bg-[#0f1d17] border-t border-white/5 py-4 overflow-hidden relative flex items-center shrink-0">
          <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#0f1d17] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#0f1d17] to-transparent z-10 pointer-events-none" />

          <div className="flex whitespace-nowrap animate-marquee">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 sm:gap-16 px-6 sm:px-8 text-white/50 text-sm font-medium tracking-wide">
                <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span>Hands-On Training Included</span>
                <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span>2-Year Warranty</span>
                <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span>Free Ocular Visitation</span>
                <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span>Zero Down Payment</span>
                <span className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]"></span>White-Glove Delivery</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── CARD 2: DENTAL CHAIRS ────────────────────── */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.15)] z-20 bg-[#fbfbfd] flex flex-col justify-center border-t border-black/5">
        <div className="pt-24 px-4 sm:px-8 flex flex-col h-full text-center">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Dental Chairs</h2>
          <p className="text-lg sm:text-xl text-[#86868b] font-medium mb-8">The foundation of your practice.</p>
          <div className="flex justify-center gap-4 mb-auto">
            <Link href="/dentalchairs" className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
              Learn more
            </Link>
          </div>
          <div className="relative w-full max-w-5xl mx-auto flex-1 flex items-end justify-center min-h-0 pb-10">
            <img src="/images/products/s9/047_Model_S9_dental_chair_with_blue_seat__ergonomic_de.jpg" alt="Premium Dental Chairs" className="h-full w-auto object-contain object-bottom max-h-[50dvh]" />
          </div>
        </div>
      </div>

      {/* ── CARD 3: X-RAYS & ENDO ────────────────────── */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.12)] z-30 bg-white flex flex-col justify-center border-t border-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full gap-2 p-2 sm:p-4 max-w-[1800px] mx-auto w-full">
          {/* X-Rays */}
          <div className="bg-[#f5f5f7] rounded-[2rem] flex flex-col items-center pt-16 px-8 pb-0 text-center relative overflow-hidden h-full">
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-3" style={{ fontFamily: 'var(--font-body)' }}>X-Rays</h3>
            <p className="text-lg text-[#86868b] font-medium mb-6">Precision diagnostics you can trust.</p>
            <div className="flex justify-center gap-4 mb-auto relative z-10">
              <Link href="/products?category=imaging" className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
                Learn more
              </Link>
            </div>
            <div className="flex-1 w-full relative flex items-end justify-center pb-8 min-h-0">
              <img src="/images/products/mcray2/main.jpg" alt="X-Ray Equipment" className="h-full w-auto object-contain object-bottom max-h-[40dvh]" />
            </div>
          </div>

          {/* Endodontics */}
          <div className="bg-[#f5f5f7] rounded-[2rem] flex flex-col items-center pt-16 px-8 pb-0 text-center relative overflow-hidden h-full">
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Endodontics</h3>
            <p className="text-lg text-[#86868b] font-medium mb-6">Advanced root canal therapy.</p>
            <div className="flex justify-center gap-4 mb-auto relative z-10">
              <Link href="/products?category=endo" className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
                Learn more
              </Link>
            </div>
            <div className="flex-1 w-full relative flex items-end justify-center pb-8 min-h-0">
              <img src="/images/products/endostars/main.jpg" alt="Endodontics" className="h-[120%] w-auto object-contain object-bottom max-h-[45dvh]" />
            </div>
          </div>
        </div>
      </div>

      {/* ── CARD 4: MICROSCOPES ────────────────────── */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden shadow-[0_-15px_40px_rgba(0,0,0,0.5)] z-40 bg-black flex flex-col justify-center">
        <div className="pt-24 px-4 sm:px-8 flex flex-col h-full text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f5f5f7] mb-3" style={{ fontFamily: 'var(--font-body)' }}>Microscopes</h2>
          <p className="text-lg sm:text-xl text-[#86868b] font-medium mb-8">See the unseen in exceptional detail.</p>
          <div className="flex justify-center gap-4 mb-auto">
            <Link href="/products?category=microscopes" className="bg-[#0071e3] text-white px-6 py-3 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
              Learn more
            </Link>
          </div>
          <div className="relative w-full max-w-4xl mx-auto flex-1 flex items-end justify-center min-h-0 pb-10">
            <img src="/images/products/microscopes/denjoy-hero.png" alt="Dental Microscopes" className="h-full w-auto object-contain object-bottom max-h-[50dvh]" />
          </div>
        </div>
      </div>

      {/* ── CARD 5: WHY US ────────────────────────────────── */}
      <div className="sticky top-0 min-h-[100dvh] w-full shadow-[0_-15px_40px_rgba(0,0,0,0.1)] z-50 bg-white flex flex-col justify-center pt-16">
        <section className={`section ${styles.whySection} flex-1 flex flex-col justify-center border-t border-black/5`}>
          <div className="container-wide">
            <div className="section-header">
              <span className="section-label">The DentaSource Difference</span>
              <h2 className="section-title">Built for Dentists, by People Who Understand Dentistry</h2>
              <p className="section-subtitle">
                We&apos;re not just another distributor. We&apos;re a partner invested in your clinic&apos;s success.
              </p>
            </div>

            <div className={styles.whyGrid}>
              {whyUsItems.map((item, i) => (
                <motion.div
                  key={item.num}
                  className={styles.whyCard}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <div className={styles.whyHeader}>
                    <span className={styles.whyIcon}>{item.icon}</span>
                    <span className={styles.whyNum}>{item.num}</span>
                  </div>
                  <h3 className={styles.whyTitle}>{item.title}</h3>
                  <p className={styles.whyDesc}>{item.desc}</p>
                  <p className={styles.whyHighlight}>{item.highlight}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── CARD 6: CONCLUDING CONTENT (Services, Trade-in, CTA) ──────────────── */}
      <div className="relative z-50 bg-white -mt-px pt-[100dvh] pointer-events-none">
        {/* spacer to allow the final sections to scroll naturally above the sticky why us card */}
      </div>

      <div className="relative z-50 bg-white shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        {/* SERVICES */}
        <section className={`section ${styles.servicesSection}`}>
          <div className="container-wide">
            <div className="section-header">
              <span className="section-label" style={{ color: 'var(--orange)' }}>Full-Service Support</span>
              <h2 className="section-title" style={{ color: 'var(--white)' }}>
                From Delivery to Daily Operations — We&apos;ve Got You
              </h2>
              <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Every purchase includes our signature White Glove Installation and ongoing support. No hidden fees, no surprises.
              </p>
            </div>

            <div className={styles.servicesGrid}>
              {services.map((svc, i) => (
                <motion.div
                  key={svc.title}
                  className={styles.serviceCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <span className={styles.serviceIcon}>{svc.icon}</span>
                  <h4 className={styles.serviceTitle}>{svc.title}</h4>
                  <p className={styles.serviceDesc}>{svc.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRADE-IN TEASER */}
        <section className={`section ${styles.financeSection}`}>
          <div className="container">
            <motion.div
              className={styles.financeCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.financeContent}>
                <span className="section-label">Seamless Trade-In</span>
                <h2 className="section-title">Start Your Practice Without the Financial Stress</h2>
                <p style={{ fontSize: '1.05rem', color: 'var(--gray)', marginBottom: 'var(--space-lg)' }}>
                  Zero down payment options, flexible installment plans, and a trade-in program — because cost shouldn&apos;t be a barrier to building a great practice.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
                  <Link href="/trade-in" className="btn btn-primary btn-lg">
                    Explore Trade-in →
                  </Link>
                  <Link href="/contact?type=trade-in" className="btn btn-outline-dark btn-lg">
                    Talk to Us
                  </Link>
                </div>
              </div>
              <div className={styles.financeHighlights}>
                <div className={styles.finHighlight}>
                  <span className={styles.finIcon}>💰</span>
                  <strong>Zero Down Payment</strong>
                  <span>Start with nothing upfront</span>
                </div>
                <div className={styles.finHighlight}>
                  <span className={styles.finIcon}>🔄</span>
                  <strong>Trade-In Program</strong>
                  <span>Credit for old equipment</span>
                </div>
                <div className={styles.finHighlight}>
                  <span className={styles.finIcon}>📊</span>
                  <strong>Flexible Plans</strong>
                  <span>Tailored to your cash flow</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <motion.div
              className={styles.ctaInner}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={styles.ctaTitle}>Ready to Build Your Dream Clinic?</h2>
              <p className={styles.ctaDesc}>
                Book a free consultation with our team. Visit our showroom, explore the equipment, and let us help you design the perfect setup for your practice.
              </p>
              <div className={styles.ctaButtons}>
                <Link href="/contact" className="btn btn-primary btn-lg">
                  Book Free Consultation →
                </Link>
                <a href="tel:+639625793024" className="btn btn-outline btn-lg">
                  Call +63 962 579 3024
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
