import Link from 'next/link';
import styles from './Footer.module.css';

const productLinks = [
    { href: '/products?c=chair', label: 'Dental Chairs' },
    { href: '/products?c=imaging', label: 'Imaging Equipment' },
    { href: '/products?c=endo', label: 'Endodontics' },
    { href: '/products?c=curing', label: 'Curing & Filling' },
    { href: '/products?c=sterilization', label: 'Sterilization' },
    { href: '/products?c=accessories', label: 'Accessories' },
];

const companyLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Our Services' },
    { href: '/trade-in', label: 'Trade-in' },
    { href: '/contact', label: 'Contact Us' },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={`container-wide ${styles.grid}`}>
                {/* Brand Column */}
                <div className={styles.brand}>
                    <div className={styles.tagline}>
                        <Link href="/" className={styles.taglineLink}><strong>Your Growth Partner in Dentistry</strong></Link>
                        <br />
                        <Link href="/" className={styles.taglineLink}><strong>Dental equipments with Research & Development</strong></Link>
                        <br />
                        <Link href="/" className={styles.taglineLink}><strong>White-glove service</strong></Link>
                        <br />
                        <Link href="/" className={styles.taglineLink}><strong>Hands-on training</strong></Link>
                        <br />
                        <Link href="/" className={styles.taglineLink}><strong>Personalized support</strong></Link>
                    </div>
                    <div className={styles.badges}>
                        <div className={styles.trustBadge}>
                            <span className={styles.trustIcon}>🛡️</span>
                            <span>2-Year Warranty</span>
                        </div>
                        <div className={styles.trustBadge}>
                            <span className={styles.trustIcon}>🕐</span>
                            <span>Mon–Sun 9AM–8PM</span>
                        </div>
                    </div>
                </div>

                {/* Products Column */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Products</h4>
                    <ul className={styles.colList}>
                        {productLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.colLink}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Company Column */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Company</h4>
                    <ul className={styles.colList}>
                        {companyLinks.map(link => (
                            <li key={link.href}>
                                <Link href={link.href} className={styles.colLink}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Column */}
                <div className={styles.col}>
                    <h4 className={styles.colTitle}>Get in Touch</h4>
                    <ul className={styles.colList}>
                        <li className={styles.contactItem}>
                            <span className={styles.contactIcon}>📍</span>
                            <span>610 C. Maybunga Rd, Pasig City, Metro Manila</span>
                        </li>
                        <li className={styles.contactItem}>
                            <span className={styles.contactIcon}>📞</span>
                            <a href="tel:+639625793024" className={styles.colLink}>+63 962 579 3024</a>
                        </li>
                        <li className={styles.contactItem}>
                            <span className={styles.contactIcon}>✉️</span>
                            <a href="mailto:dentasourcedirect@gmail.com" className={styles.colLink}>dentasourcedirect@gmail.com</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottom}>
                <div className="container-wide">
                    <p className={styles.copy}>
                        © {currentYear} DentaSource Direct. All rights reserved. | Exclusive ROSON distributor in the Philippines.
                    </p>
                </div>
            </div>
        </footer>
    );
}
