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
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center bg-[#1E3A2E] bg-gradient-to-b from-[#182e24] to-[#12241c] overflow-hidden pt-32 pb-24">
        {/* Glow effect at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[400px] bg-[#2E7D32]/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">Trusted Dental Equipment Partner in the Philippines</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] leading-[1.05] font-medium tracking-tight text-center max-w-5xl mb-8"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Your <span className="text-[#F26522] italic font-serif tracking-normal">Growth Partner</span><br />in Dentistry.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/75 text-base sm:text-lg md:text-xl font-light text-center max-w-3xl mb-12 flex-1"
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

      {/* ── TRUST STRIP / MARQUEE ──────────────────────────── */}
      <section className="bg-[#12241c] border-y border-white/5 py-5 overflow-hidden relative flex items-center">
        <div className="absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#12241c] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#12241c] to-transparent z-10 pointer-events-none" />

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

      {/* ── CATEGORY GRID (Apple-Inspired) ────────────────────── */}
      <section className="bg-white pb-4 sm:pb-6">
        {/* 1. Dental Chairs (Full) */}
        <div className="pt-20 px-4 sm:px-8 text-center bg-[#fbfbfd] border-b border-black/5 overflow-hidden">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-2" style={{ fontFamily: 'var(--font-body)' }}>Dental Chairs</h2>
          <p className="text-lg sm:text-xl text-[#86868b] font-medium mb-6">The foundation of your practice.</p>
          <div className="flex justify-center gap-4 mb-10">
            <Link href="/dentalchairs" className="bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
              Learn more
            </Link>
          </div>
          <div className="relative w-full max-w-5xl mx-auto h-[350px] sm:h-[500px] flex items-end justify-center">
            {/* Using an existing product image */}
            <img src="/images/products/s9/047_Model_S9_dental_chair_with_blue_seat__ergonomic_de.jpg" alt="Premium Dental Chairs" className="w-[80%] h-auto object-contain object-bottom" />
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:gap-6 px-4 sm:px-6 max-w-[1600px] mx-auto">

          {/* 2. X-Rays (Half) */}
          <div className="bg-[#f5f5f7] flex flex-col items-center pt-14 px-8 pb-0 text-center relative overflow-hidden h-[500px] sm:h-[580px]">
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-2" style={{ fontFamily: 'var(--font-body)' }}>X-Rays</h3>
            <p className="text-lg text-[#86868b] font-medium mb-5">Precision diagnostics you can trust.</p>
            <div className="flex justify-center gap-4 mb-8 relative z-10">
              <Link href="/products?category=imaging" className="bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
                Learn more
              </Link>
            </div>
            <div className="flex-1 w-full relative flex items-end justify-center mt-auto">
              {/* Existing Portable X-ray image */}
              <img src="/images/products/mcray2/main.jpg" alt="X-Ray Equipment" className="w-[65%] h-auto object-contain object-bottom transform translate-y-8" />
            </div>
          </div>

          {/* 3. Endodontics (Half) */}
          <div className="bg-[#f5f5f7] flex flex-col items-center pt-14 px-8 pb-0 text-center relative overflow-hidden h-[500px] sm:h-[580px]">
            <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-2" style={{ fontFamily: 'var(--font-body)' }}>Endodontics</h3>
            <p className="text-lg text-[#86868b] font-medium mb-5">Advanced root canal therapy.</p>
            <div className="flex justify-center gap-4 mb-8 relative z-10">
              <Link href="/products?category=endo" className="bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
                Learn more
              </Link>
            </div>
            <div className="flex-1 w-full relative flex items-end justify-center mt-auto">
              <img src="/images/products/endostars/main.jpg" alt="Endodontics" className="w-[75%] h-auto object-contain object-bottom transform translate-y-8" />
            </div>
          </div>
        </div>

        {/* 4. Microscopes (Full) */}
        <div className="mt-4 sm:mt-6 pt-20 px-4 sm:px-8 text-center bg-black border-none overflow-hidden text-white w-full max-w-[1600px] mx-auto">
          <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f5f5f7] mb-2" style={{ fontFamily: 'var(--font-body)' }}>Microscopes</h2>
          <p className="text-lg sm:text-xl text-[#86868b] font-medium mb-6">See the unseen in exceptional detail.</p>
          <div className="flex justify-center gap-4 mb-10">
            <Link href="/products?category=microscopes" className="bg-[#0071e3] text-white px-5 py-2.5 rounded-full text-[15px] font-medium hover:bg-[#0077ED] transition-colors hover:shadow-lg">
              Learn more
            </Link>
          </div>
          <div className="relative w-full max-w-4xl mx-auto h-[350px] sm:h-[500px] flex items-end justify-center">
            {/* Placeholder for Denjoy Microscope - will be downloaded next */}
            <img src="/images/products/microscopes/denjoy-hero.png" alt="Dental Microscopes" className="w-[85%] h-auto object-contain object-bottom" />
          </div>
        </div>
      </section>

      {/* ── WHY US ────────────────────────────────── */}
      <section className={`section ${styles.whySection}`}>
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
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

      {/* ── SERVICES ─────────────────────────────── */}
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

      {/* ── TRADE-IN TEASER ─────────────────────── */}
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

      {/* ── CTA ──────────────────────────────────── */}
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
    </>
  );
}
