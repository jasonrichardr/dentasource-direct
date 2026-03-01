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
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Trusted Dental Equipment Partner in the Philippines
            </div>

            <p className={styles.heroLabel}>FLAGSHIP — ROSON DX-A3 SERIES</p>

            <h1 className={styles.heroTitle}>
              Your <span className={styles.heroAccent}>Growth Partner</span> in Dentistry
            </h1>

            <p className={styles.heroDesc}>
              Premium dental chairs and equipment with white glove installation, hands-on training, and the personalized support your practice deserves.
            </p>

            <div className={styles.heroCtas}>
              <Link href="/products" className="btn btn-primary btn-lg">
                Explore Products →
              </Link>
              <Link href="/contact" className="btn btn-outline btn-lg">
                Book Free Consultation
              </Link>
            </div>

            <div className={styles.heroTrust}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🕐</span>
                <div>
                  <strong>Mon — Sun, 9AM–8PM</strong>
                  <span>Always open when you need us</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡️</span>
                <div>
                  <strong>2-Year Warranty</strong>
                  <span>Full coverage, peace of mind</span>
                </div>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>💳</span>
                <div>
                  <strong>Low Down Payment</strong>
                  <span>Flexible trade-in options</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src="/images/hero/dxa3-hero.png"
              alt="Roson DX-A3 Dental Chair"
              className={styles.heroChair}
            />
            <div className={styles.heroFeatures}>
              {['EOW Disinfection', 'LED Sensor Light', 'Touchscreen Panel', 'Silent & No Jerk Motion', 'Seamless', 'Ergonomic', 'Water Heating System', 'Auto Fill Cup'].map((f, i) => (
                <motion.span
                  key={f}
                  className={styles.featureTag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + i * 0.08 }}
                >
                  ✓ {f}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────── */}
      <section className={styles.trustStrip}>
        <div className="container-wide">
          <div className={styles.trustGrid}>
            {trustStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className={styles.trustStat}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────── */}
      <section className={`section ${styles.productSection}`}>
        <div className="container-wide">
          <div className="section-header">
            <span className="section-label">Our Equipment</span>
            <h2 className="section-title">Premium Dental Equipment</h2>
            <p className="section-subtitle">
              From flagship dental chairs to precision endodontic tools — every product backed by our 2-year warranty and white-glove service.
            </p>
          </div>

          <div className={styles.productGrid}>
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.slug} product={product} index={i} />
            ))}
          </div>

          <div className={styles.viewAll}>
            <Link href="/products" className="btn btn-outline-dark btn-lg">
              View All Products →
            </Link>
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
