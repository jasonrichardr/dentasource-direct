'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './page.module.css';

const services = [
    {
        icon: '🚚',
        title: 'White Glove Delivery',
        desc: 'Your equipment is professionally packed, transported with care, and delivered directly to your operatory. We handle all the heavy lifting — literally. Your team doesn\'t touch a thing until it\'s right where it needs to be.',
    },
    {
        icon: '🔧',
        title: 'Professional Installation',
        desc: 'Our experienced technicians handle the complete setup — correct positioning, plumbing and electrical connections, air line integration, and full system calibration. Everything is tested and verified before we call it done.',
    },
    {
        icon: '📋',
        title: 'Training & Orientation',
        desc: 'We walk your entire team through safe operation, daily maintenance, troubleshooting basics, and workflow optimization specific to your setup. Your staff leaves the training confident and capable.',
    },
    {
        icon: '🛠️',
        title: 'After-Sales Service',
        desc: 'Equipment issues don\'t wait for business hours, and neither do we. Our after-sales team handles repairs, rehousing, parts sourcing, and ongoing technical support for the lifetime of your equipment.',
    },
    {
        icon: '👁️',
        title: 'Free Ocular Visitation',
        desc: 'Before you purchase, we visit your space — free of charge. We assess your layout, check utilities and connections, measure clearances, and recommend the best equipment configuration for your specific situation.',
    },
    {
        icon: '🧹',
        title: 'Post-Install Cleanup',
        desc: 'After installation is complete, we clean up everything. Packaging materials, dust, debris — all removed. Your operatory is left spotless and ready for patients.',
    },
];

const warrantyDetails = [
    { period: 'Year 1', chairs: 'Free parts + free service', other: 'Free parts + free service' },
    { period: 'Year 2', chairs: 'Free service (parts at cost)', other: '—' },
    {
        period: '5 Years',
        chairs: (
            <div className={styles.premiumWarranty}>
                <div className={styles.warrantyItem}>
                    <div className={styles.badgeWrapper}>
                        <span className={styles.badgeLabel}>Motor</span>
                        <span className={styles.badgeBrand}>TiMOTION</span>
                    </div>
                    <p className={styles.warrantyDesc}>
                        <strong>The gold-standard in premium actuation.</strong> Silent, no whirring sound, no jolt, and precision-engineered for decades of maintenance-free reliability.
                    </p>
                </div>
            </div>
        ),
        other: 'Varies by model'
    },
];

export default function ServicesPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <section className={styles.header}>
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <span className="section-label">Full-Service Support</span>
                        <h1 className={styles.title}>From Delivery to Daily Operations — We&apos;ve Got You</h1>
                        <p className={styles.subtitle}>
                            Every purchase includes our signature White Glove Package. No hidden fees, no surprise charges. Just complete, end-to-end support from the moment you place your order.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section">
                <div className="container-wide">
                    <div className={styles.grid}>
                        {services.map((svc, i) => (
                            <motion.div
                                key={svc.title}
                                className={styles.card}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                                <span className={styles.icon}>{svc.icon}</span>
                                <h3 className={styles.cardTitle}>{svc.title}</h3>
                                <p className={styles.cardDesc}>{svc.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Warranty */}
            <section className={`section ${styles.warrantySection}`}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Peace of Mind</span>
                        <h2 className="section-title">Warranty Coverage</h2>
                        <p className="section-subtitle">
                            Every product is backed by our comprehensive warranty. No fine print, no runaround — just straightforward coverage when you need it.
                        </p>
                    </div>

                    <div className={styles.warrantyTable}>
                        <div className={styles.warrantyHeader}>
                            <span>Period</span>
                            <span>Dental Chairs</span>
                            <span>Other Equipment</span>
                        </div>
                        {warrantyDetails.map(row => (
                            <div key={row.period} className={styles.warrantyRow}>
                                <span className={styles.wPeriod}>{row.period}</span>
                                <span>{row.chairs}</span>
                                <span>{row.other}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <h2 className={styles.ctaTitle}>Ready to Experience the DentaSource Difference?</h2>
                    <p className={styles.ctaDesc}>Book a free consultation and see our service in action.</p>
                    <div className={styles.ctaButtons}>
                        <Link href="/contact" className="btn btn-primary btn-lg">Book Free Consultation →</Link>
                        <a href="tel:+639625793024" className="btn btn-outline btn-lg">Call +63 962 579 3024</a>
                    </div>
                </div>
            </section>
        </div>
    );
}
