'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import Hero from '@/components/ui/animated-shader-hero';

export default function ContactPage() {
    return (
        <Suspense fallback={<div className={styles.page} />}>
            <ContactContent />
        </Suspense>
    );
}

function ContactContent() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', clinic: '', product: '', message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const product = searchParams.get('product');
        const type = searchParams.get('type');
        const color = searchParams.get('color');
        const handpiece = searchParams.get('handpiece');
        const upholstery = searchParams.get('upholstery');

        if (product) {
            let msg = `Interested in: ${product}`;
            if (color) msg += `\nColor: ${color}`;
            if (handpiece) msg += `\nHandpiece: ${handpiece}`;
            if (upholstery) msg += `\nUpholstery: ${upholstery}`;
            setFormData(prev => ({ ...prev, product, message: msg }));
        }
        if (type === 'trade-in') {
            const amount = searchParams.get('amount');
            const down = searchParams.get('down');
            const months = searchParams.get('months');
            let msg = 'Interested in trade-in options.';
            if (amount) msg += `\nEquipment cost: ₱${Number(amount).toLocaleString()}`;
            if (down) msg += `\nDown payment: ₱${Number(down).toLocaleString()}`;
            if (months) msg += `\nPreferred term: ${months} months`;
            setFormData(prev => ({ ...prev, message: msg }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In production, this would send to an API / email service
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className={styles.page}>
            <Hero
                trustBadge={{ text: "DentaSource is built by forward-thinking teams." }}
                headline={{ line1: "Let's Build", line2: "Your Dream Clinic Together" }}
                subtitle={<>Whether you need a quote? Schedule a free ocular visit?<br />Want to add more knowledge, skill and confidence to your dental practice?<br />or just have questions. <br />We&apos;re here to help.</>}
                className="min-h-[60vh]"
            />

            <section className="section">
                <div className="container-wide">
                    <div className={styles.grid}>
                        {/* Contact Form */}
                        <motion.div className={styles.formCard} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                            {submitted ? (
                                <div className={styles.success}>
                                    <span className={styles.successIcon}>✅</span>
                                    <h3>Request Received!</h3>
                                    <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn btn-outline-dark">Send Another Message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <h2 className={styles.formTitle}>Request a Quote or Consultation</h2>
                                    <div className={styles.formRow}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="name">Full Name *</label>
                                            <input id="name" name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required placeholder="Dr. Juan Dela Cruz" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="email">Email *</label>
                                            <input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required placeholder="juan@clinic.com" />
                                        </div>
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="phone">Phone Number</label>
                                            <input id="phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleChange} placeholder="+63 XXX XXX XXXX" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="clinic">Clinic Name</label>
                                            <input id="clinic" name="clinic" type="text" className="form-input" value={formData.clinic} onChange={handleChange} placeholder="Dela Cruz Dental Clinic" />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="product">Product of Interest</label>
                                        <input id="product" name="product" type="text" className="form-input" value={formData.product} onChange={handleChange} placeholder="e.g., Roson DX-A3, Dental Chair Package" />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="message">Message</label>
                                        <textarea id="message" name="message" className="form-textarea" value={formData.message} onChange={handleChange} placeholder="Tell us about your needs..." />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                                        Send Request →
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div className={styles.infoPanel} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <div className={styles.infoCard}>
                                <h3 className={styles.infoTitle}>Contact Information</h3>
                                <div className={styles.infoItems}>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoIcon}>📍</span>
                                        <div>
                                            <strong>Showroom & Office</strong>
                                            <p>610 C. Maybunga Rd, Pasig City, Metro Manila, Philippines</p>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoIcon}>📞</span>
                                        <div>
                                            <strong>Phone</strong>
                                            <a href="tel:+639625793024">+63 962 579 3024</a>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoIcon}>✉️</span>
                                        <div>
                                            <strong>Email</strong>
                                            <a href="mailto:dentasourcedirect@gmail.com">dentasourcedirect@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <span className={styles.infoIcon}>🕐</span>
                                        <div>
                                            <strong>Business Hours</strong>
                                            <p>Monday – Sunday, 9:00 AM – 8:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.mapCard}>
                                <iframe
                                    className={styles.map}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.2!2d121.0755!3d14.5700!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDM0JzEyLjAiTiAxMjHCsDA0JzMxLjgiRQ!5e0!3m2!1sen!2sph!4v1"
                                    allowFullScreen
                                    loading="lazy"
                                    title="DentaSource Direct Location"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
