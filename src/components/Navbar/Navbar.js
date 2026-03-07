'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navLinks = [
    { href: '/dentalchairs', label: 'Dental Chairs' },
    { href: '/products', label: 'Other Products' },
    { href: '/services', label: 'Services' },
    { href: '/trade-in', label: 'Trade-in' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const timeout = setTimeout(() => setMobileOpen(false), 0);
        return () => clearTimeout(timeout);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <Link href="/" className={styles.logo}>
                    <img
                        src="/images/brand/dsd-logo-transparent.png"
                        alt="DentaSource Direct"
                        className={styles.logoImg}
                    />
                </Link>

                <div className={`${styles.links} ${mobileOpen ? styles.open : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`${styles.link} ${pathname === link.href || pathname.startsWith(link.href + '/') ? styles.active : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link href="/contact?type=quote" className={`btn btn-primary btn-sm ${styles.cta}`}>
                        Connect
                    </Link>
                </div>

                <button
                    className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <span />
                    <span />
                    <span />
                </button>
            </div>
        </nav>
    );
}
