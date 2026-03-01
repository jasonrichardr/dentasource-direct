'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProductBySlug, getRelatedProducts } from '@/data/products';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

export default function ProductPage() {
    const params = useParams();
    const product = getProductBySlug(params.slug);
    const [selectedImage, setSelectedImage] = useState(0);

    if (!product) {
        return (
            <div className={styles.notFound}>
                <h1>Product Not Found</h1>
                <Link href="/products" className="btn btn-primary">Back to Products</Link>
            </div>
        );
    }

    const related = getRelatedProducts(params.slug, 3);
    const categoryLabel = product.category === 'chair' ? 'Dental Chairs' :
        product.category === 'imaging' ? 'Imaging' :
            product.category === 'endo' ? 'Endodontics' :
                product.category === 'curing' ? 'Curing & Filling' :
                    product.category === 'sterilization' ? 'Sterilization' : 'Accessories';

    return (
        <div className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <div className="container-wide">
                    <Link href="/products">Products</Link>
                    <span className={styles.breadSep}>›</span>
                    <Link href={`/products?c=${product.category}`}>{categoryLabel}</Link>
                    <span className={styles.breadSep}>›</span>
                    <span className={styles.breadCurrent}>{product.name}</span>
                </div>
            </div>

            {/* Product Hero */}
            <section className={styles.productHero}>
                <div className="container-wide">
                    <div className={styles.heroGrid}>
                        {/* Gallery */}
                        <motion.div
                            className={styles.gallery}
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className={styles.mainImage}>
                                {product.badge && (
                                    <span className={`badge ${product.badge === 'Flagship' || product.badge === 'Best Seller' ? 'badge-orange' : 'badge-green'} ${styles.galleryBadge}`}>
                                        {product.badge}
                                    </span>
                                )}
                                <img
                                    src={product.images[selectedImage]}
                                    alt={`${product.name} - view ${selectedImage + 1}`}
                                    className={styles.mainImg}
                                />
                            </div>
                            {product.images.length > 1 && (
                                <div className={styles.thumbnails}>
                                    {product.images.map((img, i) => (
                                        <button
                                            key={i}
                                            className={`${styles.thumb} ${i === selectedImage ? styles.thumbActive : ''}`}
                                            onClick={() => setSelectedImage(i)}
                                        >
                                            <img src={img} alt={`${product.name} thumbnail ${i + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div
                            className={styles.info}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <span className={styles.infoCategory}>{categoryLabel}</span>
                            <h1 className={styles.infoName}>{product.name}</h1>
                            <p className={styles.infoTagline}>{product.tagline}</p>
                            <p className={styles.infoDesc}>{product.description}</p>

                            {/* Key Features */}
                            <div className={styles.features}>
                                <h3 className={styles.featuresTitle}>Key Features</h3>
                                <ul className={styles.featureList}>
                                    {product.features.map((f, i) => (
                                        <li key={i} className={styles.featureItem}>
                                            <span className={styles.featureCheck}>✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTAs */}
                            <div className={styles.ctas}>
                                <Link
                                    href={`/contact?product=${encodeURIComponent(product.name)}`}
                                    className="btn btn-primary btn-lg"
                                >
                                    Request a Quote →
                                </Link>
                                {product.configuratorEnabled && (
                                    <Link
                                        href={`/products/${product.slug}/configure`}
                                        className="btn btn-secondary btn-lg"
                                    >
                                        Configure This Chair
                                    </Link>
                                )}
                                <a href="tel:+639625793024" className="btn btn-outline-dark">
                                    Call Us: +63 962 579 3024
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
                <section className={`section ${styles.specsSection}`}>
                    <div className="container">
                        <div className="section-header">
                            <span className="section-label">Technical Details</span>
                            <h2 className="section-title">Specifications</h2>
                        </div>
                        <div className={styles.specsTable}>
                            {Object.entries(product.specs).map(([key, value]) => (
                                <div key={key} className={styles.specRow}>
                                    <span className={styles.specKey}>{key}</span>
                                    <span className={styles.specValue}>{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Warranty */}
            <section className={styles.warrantySection}>
                <div className="container">
                    <div className={styles.warrantyCard}>
                        <div className={styles.warrantyIcon}>🛡️</div>
                        <div>
                            <h3 className={styles.warrantyTitle}>Covered by Our Warranty</h3>
                            <p className={styles.warrantyDesc}>
                                {product.category === 'chair'
                                    ? '2-Year Warranty — 1st year includes free parts and service. 2nd year includes free service. Plus white-glove installation and training included with every purchase.'
                                    : '1-Year Warranty — Includes free parts and service support. All equipment backed by our dedicated after-sales team.'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {related.length > 0 && (
                <section className={`section ${styles.relatedSection}`}>
                    <div className="container-wide">
                        <div className="section-header">
                            <span className="section-label">You Might Also Like</span>
                            <h2 className="section-title">Related Products</h2>
                        </div>
                        <div className={styles.relatedGrid}>
                            {related.map((p, i) => (
                                <ProductCard key={p.slug} product={p} index={i} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
