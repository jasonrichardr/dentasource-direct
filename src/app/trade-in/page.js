'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import FaqAccordion from './FaqAccordion';

const processSteps = [
    {
        icon: '📋',
        title: '1. Get an Estimate',
        desc: 'Tell us about your current chair. We evaluate brand, year, and condition to give you a fair market estimate.'
    },
    {
        icon: '🚚',
        title: '2. We Pick It Up',
        desc: 'No heavy lifting required. Our white-glove team will safely uninstall and remove your old equipment.'
    },
    {
        icon: '💳',
        title: '3. Get Instant Credit',
        desc: 'The value of your old chair is instantly applied as a discount or downpayment toward your new ROSON setup.'
    }
];

const roiPoints = [
    {
        icon: '✨',
        title: 'Elevate Clinical Confidence',
        desc: 'A modern, high-tech dental chair elevates your skills and confidence handling specialized procedures.'
    },
    {
        icon: '⚡',
        title: 'Zero Operational Downtime',
        desc: 'We coordinate the removal of your old chair and the installation of your new one on the exact same day.'
    }
];

export default function TradeInPage() {
    return (
        <>
            {/* ── HERO ─────────────────────────────────── */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <motion.div
                        className={styles.heroContent}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <p className={styles.heroLabel}>Dentasource Trade-In Program</p>
                        <h1 className={styles.heroTitle}>
                            Turn the chair you have into the clinic you <span className={styles.heroAccent}>want</span>.
                        </h1>
                        <p className={styles.heroDesc}>
                            Upgrade your practice effortlessly. Trade in your old dental chair for instant credit toward a state-of-the-art ROSON dental chair.
                        </p>
                        <Link href="#appraisal" className="btn btn-primary btn-lg">
                            Get an Estimate
                        </Link>
                    </motion.div>

                    <motion.div
                        className={styles.heroImageContainer}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                    >
                        <div className={styles.heroGlow} />
                        <div className={styles.heroBackdrop}>
                            <div className={styles.heroGrid} />
                            <div className={styles.heroBase} />
                        </div>
                        <img
                            src="/images/hero/dxa3-hero.png"
                            alt="Roson DX-A3 Dental Chair Upgrade"
                            className={styles.heroChair}
                        />
                    </motion.div>
                </div>
            </section>

            {/* ── 3 EASY STEPS ──────────────────────────── */}
            <section className={styles.processSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionLabel}>How It Works</span>
                        <h2 className={styles.sectionTitle}>Seamless Upgrades in 3 Steps</h2>
                        <p className={styles.sectionSubtitle}>
                            We handle the logistics so you can focus on dentistry. Our streamlined process makes trading in your old equipment completely hassle-free.
                        </p>
                    </div>

                    <div className={styles.processGrid}>
                        {processSteps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                className={styles.processCard}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <div className={styles.processIconWrapper}>
                                    <span className={styles.processIcon}>{step.icon}</span>
                                </div>
                                <h3 className={styles.processTitle}>{step.title}</h3>
                                <p className={styles.processDesc}>{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ROI / BENEFITS ───────────────────────── */}
            <section className={styles.roiSection}>
                <div className={styles.container}>
                    <div className={styles.roiGrid}>
                        <motion.div
                            className={styles.roiContent}
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className={styles.sectionLabel}>The Hidden Value</span>
                            <h2 className={styles.sectionTitle}>More Than Just a New Chair</h2>
                            <p className={styles.sectionSubtitle} style={{ marginBottom: '2rem' }}>
                                Trading in older equipment isn&apos;t just an aesthetics upgrade; it&apos;s a strategic business decision that pays dividends.
                            </p>

                            <ul className={styles.roiList}>
                                {roiPoints.map((point) => (
                                    <li key={point.title} className={styles.roiItem}>
                                        <span className={styles.roiIcon}>{point.icon}</span>
                                        <div className={styles.roiText}>
                                            <strong>{point.title}</strong>
                                            <span>{point.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            className={styles.roiImageContainer}
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{ boxShadow: 'none' }}
                        >
                            <div className={styles.planetCard}>
                                <div className={styles.planetHeader}>
                                    <h3 className={styles.planetTitle}>
                                        Good for<br />the planet.
                                    </h3>
                                    <svg className={styles.recycleIcon} viewBox="0 0 24 24" fill="#00c853" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.20459 13.916C6.71186 13.916 7.15175 14.1687 7.42415 14.5457H8.64756L10.3601 11.5238H7.72911C6.72852 11.5238 5.86903 10.9577 5.43261 10.1264L2.80164 5.48281V13.916H6.20459ZM21.1984 5.48281L18.5674 10.1264C18.131 10.9577 17.2715 11.5238 16.2709 11.5238H13.6399L15.3524 14.5457H16.5759C16.8482 14.1687 17.2881 13.916 17.7954 13.916H21.1984V5.48281ZM16.2709 3.09062H7.72911C6.9142 3.09062 6.18247 3.48441 5.72758 4.10304L3.8996 7.33083L5.61214 10.3527L8.24311 5.70914H15.7569L18.3879 10.3527L20.1004 7.33083L18.2724 4.10304C17.8175 3.48441 17.0858 3.09062 16.2709 3.09062ZM14.4443 20.3551L12 16.0357L9.55569 20.3551C9.09802 21.1664 8.24647 21.6853 7.31952 21.6853C6.39257 21.6853 5.54101 21.1664 5.08334 20.3551L3.86877 18.2044L5.5813 15.1825L8.21227 19.8261C8.36199 20.0911 8.64805 20.2608 8.96162 20.2608C9.27519 20.2608 9.56125 20.0911 9.71097 19.8261L12 15.7797L14.289 19.8261C14.4388 20.0911 14.7248 20.2608 15.0384 20.2608C15.352 20.2608 15.638 20.0911 15.7877 19.8261L18.4187 15.1825L20.1312 18.2044L18.9167 20.3551C18.459 21.1664 17.6074 21.6853 16.6805 21.6853C15.7535 21.6853 14.902 21.1664 14.4443 20.3551Z" />
                                    </svg>
                                </div>
                                <p className={styles.planetDesc}>
                                    If your dental chair is in good shape, we&apos;ll help get it to a new owner. Or, if it&apos;s seen better days, we can recycle it for free.
                                </p>
                                <button className={styles.planetButton}>
                                    Recycle your dental chair
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── FAQ ACCORDION ───────────────────────── */}
            <FaqAccordion />

            {/* ── CTA / APPRAISAL ──────────────────────── */}
            <section id="appraisal" className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                        <span className={styles.sectionLabel}>Start Your Upgrade</span>
                        <h2 className={styles.sectionTitle}>Ready to Find Out What It&apos;s Worth?</h2>
                    </div>

                    <motion.div
                        className={styles.ctaCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <p className={styles.ctaDesc}>
                            Send us a few details and photos of your current equipment. Our team will evaluate it and provide a trade-in estimate within 24 hours.
                        </p>
                        <Link href="/contact?type=trade-in" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                            Request Free Appraisal →
                        </Link>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
