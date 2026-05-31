'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { newsData as newsItems } from '@/data/news';
import styles from '@/app/about/page.module.css';

import AboutHero from '@/components/about/AboutHero';
import MissionSection from '@/components/about/MissionSection';
import ValuesGrid from '@/components/about/ValuesGrid';

export default function AboutContent() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    const yHero = useTransform(scrollYProgress, [0, 1], [0, 800]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    return (
        <main className="w-full min-h-screen bg-white selection:bg-[#10b981] selection:text-white pb-20 overflow-hidden">
            <AboutHero />
            <MissionSection />
            <ValuesGrid />

            <div className={styles.page} ref={containerRef}>
                {/* PREMIUM TRAINING CENTER SECTION */}
            <section className={styles.premiumTrainingSection}>
                <div className={styles.containerWide}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className={styles.trainingHeader}
                    >
                        <span className={styles.glowBadge}>DentaSource Training Center</span>
                        <h2>Master the Future of Dentistry.</h2>
                        <p>Learn, scan, design, and create. Innovation meets clinical practice in our state-of-the-art facility designed to elevate your skills.</p>
                    </motion.div>

                    <div className={styles.trainingGrid}>
                        {[
                            { img: 'digital-dentistry', title: 'Digital Dentistry', desc: 'End-to-end digital workflows. Learn intraoral scanning, CAD design, and 3D printing for absolute precision.', active: true },
                            { img: 'oral-surgery', title: 'Oral Surgery', desc: 'Advanced surgical techniques utilizing the latest in guided implantology and minimally invasive tools.', active: true },
                            { img: 'endodontics', title: 'Endodontics', desc: 'Master modern rotary systems, apical locators, and warm obturation for predictable success.', active: false },
                            { img: 'prosthodontics', title: 'Prosthodontics', desc: 'From single units to full-mouth rehabs. Elevate your restorative skills with cutting-edge materials.', active: false },
                            { img: 'aesthetics', title: 'Aesthetics', desc: 'Art meets science. Perfect anterior restorations, composite bonding, and smile design principles.', active: false },
                            { img: 'business', title: 'Dental Business Management', desc: 'Master the business side of dentistry. Optimize daily clinic operations, patient acquisition, and financial growth.', active: false },
                        ].map((program, i) => (
                            <motion.div
                                key={program.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: (i + 1) * 0.1, duration: 0.5 }}
                                className={styles.premiumProgramCard}
                            >
                                <div className={styles.cardBackground} style={{ backgroundImage: `url('/images/training/${program.img}.png')` }} />
                                <div className={styles.cardOverlay} />
                                <div className={styles.cardContent}>
                                    <h3>{program.title}</h3>
                                    <p>{program.desc}</p>
                                    <span className={`${styles.programStatus} ${program.active ? styles.statusActive : styles.statusSoon}`}>
                                        {program.active ? 'Active Program' : 'Coming Soon'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Link href="/contact" className={styles.btnTrainingCTA}>
                            Inquire About Next Batch
                        </Link>
                    </div>
                </div>
            </section>

            {/* ROSON SCALE / STATS SECTION */}
            <section className={styles.statsSection}>
                <div className={styles.containerWide}>
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className={styles.statsHeader}
                    >
                        <span className={styles.badgeGreen}>Global Scale & Reliability</span>
                        <h2>Backed by the might of ROSON manufacturing.</h2>
                        <p>As the exclusive Philippine distributor, we bring you the direct output of a world-class dental engineering powerhouse.</p>
                    </motion.div>

                    <div className={styles.statsGrid}>
                        {[
                            { number: '20+', label: 'Years of Excellence', sub: 'Manufacturing since 2005' },
                            { number: '100K+', label: 'Dentists Worldwide', sub: 'Trusted across 100+ countries' },
                            { number: '1,000+', label: 'Units Monthly Output', sub: 'Driven by a Lean Factory' },
                            { number: '10,000㎡', label: 'Manufacturing Facility', sub: 'With MES digital traceability' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: i * 0.15, duration: 0.6, type: 'spring' }}
                                className={styles.statCard}
                            >
                                <div className={styles.statNumber}>{stat.number}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                                <div className={styles.statSub}>{stat.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SHOWROOM & PARTNER - DARK SECTION */}
            <section className={styles.darkSection}>
                <div className={styles.containerWide}>
                    <div className={styles.darkGrid}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.1 }}
                            className={styles.showroomCard}
                        >
                            <span className={styles.badgeOrange}>Experience It</span>
                            <h2>The Flagship Showroom</h2>
                            <p>See, sit, and experience every product before you buy. We believe in informed decisions — and nothing informs like hands-on experience.</p>
                            <ul className={styles.contactList}>
                                <li><strong>Location:</strong> 610 C. Maybunga Rd, Pasig City</li>
                                <li><strong>Hours:</strong> Mon–Sun, 9AM–8PM</li>
                                <li><strong>Direct:</strong> +63 962 579 3024</li>
                            </ul>
                            <Link href="/contact" className={styles.btnAction}>
                                Visit our 140 sqm showroom located at pasig
                            </Link>
                        </motion.div>

                        <div className={styles.partnersColumn}>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                className={styles.partnerRevealCard}
                            >
                                <div className={styles.partnerContent}>
                                    <span className={styles.badgeOrange} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>Exclusive Partner</span>
                                    <div style={{ margin: '1rem 0 3rem 0', position: 'relative', width: '280px', height: '60px' }}>
                                        <Image src="/images/brand/roson-logo-final.png" alt="ROSON Dental" fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
                                    </div>
                                    <p className={styles.partnerText}>
                                        Built on 20 years of engineering and a relentless pursuit of quality, refined through continuous innovation, and already trusted by dentists in Germany, Dubai, Russia, Mexico, Brazil, Australia, and 100+ countries worldwide. A giant in Dental Chair industry.
                                        <br /><br />
                                        And now, through DentaSource Direct, that same world-class dental chair is finally within reach of Filipino dentists.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.1 }}
                                transition={{ delay: 0.2 }}
                                className={`${styles.partnerRevealCard} ${styles.denjoyCard}`}
                            >
                                <div className={styles.partnerContent}>
                                    <span className={styles.badgeOrange} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff' }}>Exclusive Partner</span>
                                    <div style={{ margin: '1rem 0 3rem 0', position: 'relative', width: '220px', height: '110px' }}>
                                        <Image src="/images/brand/denjoy-logo-final.png" alt="DENJOY Endo" fill style={{ objectFit: 'contain', objectPosition: 'left center' }} />
                                    </div>
                                    <p className={styles.partnerText}>
                                        Italy and Russia have some of the strictest medical device standards in Europe. That same endodontic technology trusted by European clinics is now here in the Philippines, backed by DentaSource Direct&apos;s hands-on support, local training, and a commitment to keeping your clinic ahead of the curve through continuous research and development.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LATEST NEWS */}
            <section className={styles.newsSection}>
                <div className={styles.containerWide}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className={styles.newsHeader}
                    >
                        <h2>Latest Global News</h2>
                        <p>Stay updated with our manufacturing partners&apos; latest breakthroughs and global events.</p>
                    </motion.div>

                    <div className={styles.newsGrid}>
                        {newsItems.map((news, i) => (
                            <Link href={`/news/${news.slug}`} key={i} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.1 }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    className={styles.newsCard}
                                    style={{ cursor: 'pointer', height: '100%' }}
                                >
                                    <div className={styles.newsImageWrapper}>
                                        <img src={news.image} alt={news.title} className={styles.newsImage} />
                                    </div>
                                    <div className={styles.newsContent}>
                                        <span className={styles.newsDate}>{news.date}</span>
                                        <h3 className={styles.newsTitle}>{news.title}</h3>
                                        <span className={styles.newsReadMore}>Read Full Story →</span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
        </main>
    );
}
