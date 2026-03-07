'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/ProductCard/ProductCard';
import { products, categories } from '@/data/products';
import styles from './page.module.css';

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className={styles.page} />}>
            <ProductsContent />
        </Suspense>
    );
}

function ProductsContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('c') || 'all';
    const [activeCategory, setActiveCategory] = useState(initialCategory);

    const filtered = activeCategory === 'all'
        ? products.filter(p => p.category !== 'chair')
        : products.filter(p => p.category === activeCategory);

    return (
        <div className={styles.page}>
            {/* Page Header */}
            <section className={styles.header}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="section-label">Our Equipment</span>
                        <h1 className={styles.title}>Premium Dental Equipment</h1>
                        <p className={styles.subtitle}>
                            From flagship dental chairs to precision endodontic tools — 23 products, all backed by our 2-year warranty and full-service support.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filter + Grid */}
            <section className="section">
                <div className="container-wide">
                    {/* Category Tabs */}
                    <div className={styles.filters}>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterActive : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                                {cat.id !== 'all' && (
                                    <span className={styles.filterCount}>
                                        {products.filter(p => p.category === cat.id).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className={styles.grid}>
                        <AnimatePresence mode="popLayout">
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.slug}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ProductCard product={product} index={i} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {filtered.length === 0 && (
                        <div className={styles.empty}>
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
