'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './PremiumProductLayout.module.css';

// Animation variants for scroll reveals
const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function PremiumProductLayout({ product, categoryLabel }) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className={styles.premiumPage}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className="container-wide">
                    <Link href="/products" className={styles.breadLink}>Products</Link>
                    <span className={styles.breadSep}>›</span>
                    <Link href={`/products?c=${product.category}`} className={styles.breadLink}>{categoryLabel}</Link>
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
                            <p className={styles.shortDesc}>{product.shortDesc || product.description}</p>

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
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className={styles.heroImg}
                            />
                            {product.images.length > 1 && (
                                <div className={styles.galleryThumbs}>
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`${styles.thumbBtn} ${i === selectedImage ? styles.thumbActive : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        >
                                            <img src={img} alt={`Thumbnail ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
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
                            <h2 className={styles.sectionTitle}>Engineered for Clinical Excellence</h2>
                            <p className={styles.sectionDesc}>Every component of the {product.name} is meticulously crafted to elevate your workflow and ensure unparalleled patient comfort.</p>
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
                                {/* Placeholder for specific disinfection image if we had one, falling back to a gallery image */}
                                <img src={product.images[1] || product.images[0]} alt="Disinfection Technology" className={styles.immersiveImg} />
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Ergonomics Deep Dive */}
            {product.ergonomicsDeepDive && (
                <section className={`${styles.deepDiveSection} ${styles.deepDiveReverse}`}>
                    <div className="container-wide">
                        <div className={styles.deepDiveSplit}>
                            <motion.div
                                className={styles.splitImage}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1 }}
                            >
                                <img src={product.images[2] || product.images[0]} alt="Ergonomic Design" className={styles.immersiveImg} />
                            </motion.div>
                            <motion.div
                                className={styles.splitText}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <span className={styles.deepDiveSubtitle}>{product.ergonomicsDeepDive.subtitle}</span>
                                <h2 className={styles.deepDiveTitle}>{product.ergonomicsDeepDive.title}</h2>
                                <ul className={styles.ergoList}>
                                    {product.ergonomicsDeepDive.features.map((feat, i) => (
                                        <li key={i} className={styles.ergoItem}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.ergoIcon}>
                                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>
            )}

            {/* Technical Specifications Section */}
            {product.specs && Object.keys(product.specs).length > 0 && (
                <section className={styles.specsSection}>
                    <div className="container">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                        >
                            <h2 className={styles.specsTitle}>Technical Specifications</h2>
                            <div className={styles.specsGrid}>
                                {Object.entries(product.specs).map(([key, value], i) => (
                                    <div key={key} className={styles.specItem}>
                                        <div className={styles.specKey}>{key}</div>
                                        <div className={styles.specValue}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
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
                            Backed by our premium 2-Year Warranty. First year includes free parts and service. Second year includes free service. White-glove installation and comprehensive training are included with every flagship purchase.
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
