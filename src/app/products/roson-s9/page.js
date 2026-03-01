'use client';

import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductBySlug } from '@/data/products';
import styles from './page.module.css';

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function RosonS9Page() {
    // S9 specific product data
    const product = getProductBySlug('roson-s9');

    // Angle Selector State
    // Since we only have main.jpg right now, we setup the array with placeholders
    // The user will upload actual images to public/images/products/s9/
    const angles = [
        { id: 'front-left', label: 'Front Angle', src: '/images/products/s9/s9-front.jpg' },
        { id: 'side', label: 'Side Profile', src: '/images/products/s9/s9-side.jpg' },
        { id: 'rear', label: 'Rear View', src: '/images/products/s9/s9-rear.jpg' },
        { id: 'angle1', label: 'Top View', src: '/images/products/s9/s9-angle1.jpg' },
        { id: 'angle2', label: 'Delivery Unit', src: '/images/products/s9/s9-angle2.jpg' },
        { id: 'angle3', label: 'Assistant Control', src: '/images/products/s9/s9-angle3.jpg' }
    ];
    const [selectedAngle, setSelectedAngle] = useState(angles[0]);

    if (!product) return null;

    return (
        <>
            <Head>
                <title>Roson S9 Signature Dental Chair | Premium Operatory | DentaSource</title>
                <meta name="description" content="Deliver exceptional patient experiences and boost clinical efficiency with the Roson S9 Signature dental chair. Features industry-leading EOW-TECH water disinfection." />
                <meta name="keywords" content="dental chair, roson s9, dental equipment, dental operatory, eow-tech, premium dental chair" />
            </Head>

            <div className={styles.premiumPage}>
                {/* Breadcrumb */}
                <div className={styles.breadcrumb}>
                    <div className="container-wide">
                        <Link href="/products" className={styles.breadLink}>Products</Link>
                        <span className={styles.breadSep}>›</span>
                        <Link href={`/products?c=${product.category}`} className={styles.breadLink}>Dental Chairs</Link>
                        <span className={styles.breadSep}>›</span>
                        <span className={styles.breadCurrent}>{product.name}</span>
                    </div>
                </div>

                {/* Immersive Hero Section */}
                <section className={styles.heroSection}>
                    <div className={styles.heroBgGradient}></div>
                    <div className="container-wide">
                        <div className={styles.heroContent}>
                            <motion.div
                                className={styles.heroText}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <span className={styles.badge}>{product.badge}</span>
                                <h1 className={styles.title}>{product.name}</h1>
                                <h2 className={styles.tagline}>{product.tagline}</h2>
                                <p className={styles.shortDesc}>{product.description}</p>

                                <div className={styles.heroCtas}>
                                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className={styles.btnPrimary}>
                                        Request a Quote
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                className={styles.heroImageContainer}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.2, delay: 0.2 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={selectedAngle.id}
                                        src={selectedAngle.src}
                                        alt={`${product.name} - ${selectedAngle.label}`}
                                        className={styles.heroImg}
                                        initial={{ opacity: 0, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, filter: "blur(10px)" }}
                                        transition={{ duration: 0.4 }}
                                        // Adding a fallback in case placeholder image doesn't exist yet
                                        onError={(e) => {
                                            e.currentTarget.src = '/images/products/s9/main.jpg';
                                        }}
                                    />
                                </AnimatePresence>

                                {/* Angle Selector */}
                                <div className={styles.angleSelector}>
                                    {angles.map((angle) => (
                                        <button
                                            key={angle.id}
                                            className={`${styles.angleBtn} ${selectedAngle.id === angle.id ? styles.angleBtnActive : ''}`}
                                            onClick={() => setSelectedAngle(angle)}
                                        >
                                            {angle.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Dynamic Advanced Features Grid */}
                {product.advancedFeatures && product.advancedFeatures.length > 0 && (
                    <section className={styles.advancedFeaturesSection}>
                        <div className="container-wide">
                            <motion.div
                                className={styles.advancedFeaturesIntro}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeInUp}
                            >
                                <h2 className={styles.sectionTitle}>Engineered for the Modern Practice</h2>
                                <p className={styles.sectionDesc}>Every component of the {product.name} is meticulously crafted to elevate your clinical workflow and ensure unparalleled patient comfort from start to finish.</p>
                            </motion.div>

                            <motion.div
                                className={styles.advancedGrid}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={staggerContainer}
                            >
                                {product.advancedFeatures.map((feat, i) => (
                                    <motion.div key={i} className={styles.advFeatureCard} variants={fadeInUp}>
                                        <div className={styles.advFeatureNumber}>0{i + 1}</div>
                                        <h3 className={styles.advFeatureTitle}>{feat.title}</h3>
                                        <p className={styles.advFeatureDesc}>{feat.description}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </section>
                )}

                {/* Disinfection Deep Dive */}
                {product.disinfectionDeepDive && (
                    <section className={styles.deepDiveSection}>
                        <div className="container-wide">
                            <div className={styles.deepDiveSplit}>
                                <motion.div
                                    className={styles.splitText}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <span className={styles.deepDiveSubtitle}>{product.disinfectionDeepDive.subtitle}</span>
                                    <h2 className={styles.deepDiveTitle}>{product.disinfectionDeepDive.title}</h2>
                                    <div className={styles.deepDiveList}>
                                        {product.disinfectionDeepDive.features.map((feat, i) => (
                                            <div key={i} className={styles.deepDiveItem}>
                                                <h4 className={styles.deepDiveItemTitle}>✦ {feat.name}</h4>
                                                <p className={styles.deepDiveItemDesc}>{feat.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                                <motion.div
                                    className={styles.splitImage}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                >
                                    <img src="/images/products/s9/main.jpg" alt="Active EOW Disinfection Technology" className={styles.immersiveImg} />
                                </motion.div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Premium Warranty Block */}
                <section className={styles.warrantySection}>
                    <div className="container">
                        <motion.div
                            className={styles.warrantyBox}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h3 className={styles.warrantyTitle}>Uncompromising Support</h3>
                            <p className={styles.warrantyText}>
                                Backed by our premium 2-Year Warranty. First year includes free parts and service. Second year includes free service. White-glove installation and comprehensive training are standard with your S9 Signature purchase.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </div>
        </>
    );
}
