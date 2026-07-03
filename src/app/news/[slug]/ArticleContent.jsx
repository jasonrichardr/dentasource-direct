"use client";

import Image from 'next/image';
import Link from 'next/link';
import { m as motion } from 'framer-motion';
import JsonLd from '@/components/JsonLd';
import { articleGraph } from '@/lib/schemas/article';
import styles from './page.module.css';

export default function ArticleContent({ article }) {
    return (
        <main className={styles.articlePage}>
            <JsonLd id={`article-${article.slug}`} data={articleGraph(article)} />
            {/* Header / Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className={styles.date}>{article.date}</span>
                        <h1 className={styles.title}>{article.title}</h1>
                        <p className={styles.abstract}>{article.abstract}</p>
                    </motion.div>
                </div>
                {article.image && !article.hideHeroImage && (
                    <motion.div
                        className={styles.imageWrapper}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className={styles.heroImage}
                            priority
                        />
                    </motion.div>
                )}
            </section>

            {/* Article Content */}
            <section className={styles.contentSection}>
                <motion.div
                    className={styles.articleBody}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* Render content based on whether it is markdown-like or simple text */}
                    {article.content.split('\n\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        // Handle headings
                        if (trimmed.startsWith('##')) {
                            return <h2 key={idx} className={styles.heading2}>{trimmed.replace('##', '').trim()}</h2>;
                        } else if (trimmed.startsWith('#')) {
                            return <h1 key={idx} className={styles.heading1}>{trimmed.replace('#', '').trim()}</h1>;
                        }
                        // Handle images and videos
                        if (trimmed.startsWith('![')) {
                            const match = trimmed.match(/!\[(.*?)\]\((.*?)\)/);
                            if (match) {
                                if (match[2].endsWith('.mp4')) {
                                    return (
                                        <div key={idx} className={styles.inlineImageWrapper}>
                                            <video
                                                src={match[2]}
                                                controls
                                                muted
                                                playsInline
                                                preload="metadata"
                                                className={styles.inlineImage}
                                                aria-label={match[1]}
                                            />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={idx} className={styles.inlineImageWrapper}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={match[2]} alt={match[1]} className={styles.inlineImage} loading="lazy" />
                                    </div>
                                );
                            }
                        }
                        // A paragraph that is exactly one link renders as a CTA button
                        const ctaMatch = trimmed.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                        if (ctaMatch) {
                            const isExternal = ctaMatch[2].startsWith('http');
                            return (
                                <div key={idx} className={styles.ctaWrapper}>
                                    <a
                                        href={ctaMatch[2]}
                                        className={styles.ctaButton}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                    >
                                        {ctaMatch[1]}
                                    </a>
                                </div>
                            );
                        }
                        // Text paragraphs (with basic bold and link rendering)
                        if (trimmed.length > 0) {
                            // Split by ** for bold text and [text](url) for links
                            const parts = trimmed.split(/(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\))/g);
                            return (
                                <p key={idx} className={styles.paragraph}>
                                    {parts.map((part, i) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                            return <strong key={i}>{part.slice(2, -2)}</strong>;
                                        }
                                        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                                        if (linkMatch) {
                                            const isExternal = linkMatch[2].startsWith('http');
                                            return (
                                                <a
                                                    key={i}
                                                    href={linkMatch[2]}
                                                    target={isExternal ? '_blank' : undefined}
                                                    rel={isExternal ? 'noopener noreferrer' : undefined}
                                                >
                                                    {linkMatch[1]}
                                                </a>
                                            );
                                        }
                                        return part;
                                    })}
                                </p>
                            );
                        }
                        return null;
                    })}
                </motion.div>

                {/* Back Link */}
                <motion.div
                    className={styles.backLinkWrapper}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <Link href="/about" className={styles.backLink}>
                        ← Back to About Us
                    </Link>
                </motion.div>
            </section>
        </main>
    );
}
