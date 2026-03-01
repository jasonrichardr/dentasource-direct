'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

export default function ProductCard({ product, index = 0 }) {
    return (
        <motion.div
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
        >
            <Link href={`/products/${product.slug}`} className={styles.imageWrap}>
                {product.badge && (
                    <span className={`badge ${product.badge === 'Flagship' || product.badge === 'Best Seller' ? 'badge-orange' : 'badge-green'} ${styles.badge}`}>
                        {product.badge}
                    </span>
                )}
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className={styles.image}
                    loading="lazy"
                />
            </Link>

            <div className={styles.body}>
                <span className={styles.category}>
                    {product.category === 'chair' ? 'Dental Chair' :
                        product.category === 'imaging' ? 'Imaging' :
                            product.category === 'endo' ? 'Endodontics' :
                                product.category === 'curing' ? 'Curing & Filling' :
                                    product.category === 'sterilization' ? 'Sterilization' :
                                        'Accessories'}
                </span>
                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.desc}>{product.shortDesc}</p>

                <div className={styles.actions}>
                    <Link href={`/products/${product.slug}`} className="btn btn-secondary btn-sm">
                        View Details
                    </Link>
                    <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn btn-outline-dark btn-sm">
                        Get Quote
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
