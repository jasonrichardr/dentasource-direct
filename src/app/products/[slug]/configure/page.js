'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getProductBySlug } from '@/data/products';
import styles from './page.module.css';

export default function ConfiguratorPage() {
    const params = useParams();
    const product = getProductBySlug(params.slug);

    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedHandpiece, setSelectedHandpiece] = useState(0);
    const [selectedUpholstery, setSelectedUpholstery] = useState(0);

    if (!product || !product.configuratorEnabled) {
        return (
            <div className={styles.notAvailable}>
                <h1>Configurator Not Available</h1>
                <p>This product does not have a configurator.</p>
                <Link href="/products" className="btn btn-primary">Browse Products</Link>
            </div>
        );
    }

    const opts = product.configuratorOptions;
    const currentColor = opts.colors[selectedColor];

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className="container-wide">
                    <Link href={`/products/${product.slug}`} className={styles.backLink}>
                        ← Back to {product.name}
                    </Link>
                    <h1 className={styles.title}>Configure Your {product.name}</h1>
                    <p className={styles.subtitle}>Customize your chair to match your operatory perfectly.</p>
                </div>
            </div>

            <div className={styles.configurator}>
                <div className="container-wide">
                    <div className={styles.grid}>
                        {/* Preview */}
                        <motion.div
                            className={styles.preview}
                            key={currentColor.name}
                            initial={{ opacity: 0.5, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className={styles.previewCard}>
                                <div className={styles.colorLabel}>
                                    <span className={styles.colorDot} style={{ background: currentColor.value }} />
                                    {currentColor.name}
                                </div>
                                <img
                                    src={currentColor.image}
                                    alt={`${product.name} in ${currentColor.name}`}
                                    className={styles.previewImg}
                                />
                            </div>
                        </motion.div>

                        {/* Options Panel */}
                        <div className={styles.options}>
                            {/* Color Selection */}
                            <div className={styles.optionGroup}>
                                <h3 className={styles.optionTitle}>
                                    <span className={styles.optionNum}>01</span>
                                    Upholstery Color
                                </h3>
                                <p className={styles.optionDesc}>Choose from {opts.colors.length} colors to match your clinic&apos;s aesthetic.</p>
                                <div className={styles.colorSwatches}>
                                    {opts.colors.map((color, i) => (
                                        <button
                                            key={color.name}
                                            className={`${styles.swatch} ${i === selectedColor ? styles.swatchActive : ''}`}
                                            style={{ background: color.value }}
                                            onClick={() => setSelectedColor(i)}
                                            title={color.name}
                                        >
                                            {i === selectedColor && <span className={styles.swatchCheck}>✓</span>}
                                        </button>
                                    ))}
                                </div>
                                <p className={styles.selectedLabel}>Selected: <strong>{currentColor.name}</strong></p>
                            </div>

                            {/* Handpiece Placement */}
                            <div className={styles.optionGroup}>
                                <h3 className={styles.optionTitle}>
                                    <span className={styles.optionNum}>02</span>
                                    Handpiece Placement
                                </h3>
                                <p className={styles.optionDesc}>Select the delivery system position that suits your workflow.</p>
                                <div className={styles.radioGroup}>
                                    {opts.handpiece.map((h, i) => (
                                        <button
                                            key={h}
                                            className={`${styles.radioBtn} ${i === selectedHandpiece ? styles.radioBtnActive : ''}`}
                                            onClick={() => setSelectedHandpiece(i)}
                                        >
                                            <span className={styles.radio}>
                                                {i === selectedHandpiece && <span className={styles.radioDot} />}
                                            </span>
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Upholstery Material */}
                            <div className={styles.optionGroup}>
                                <h3 className={styles.optionTitle}>
                                    <span className={styles.optionNum}>03</span>
                                    Upholstery Material
                                </h3>
                                <p className={styles.optionDesc}>Choose the material that fits your budget and comfort needs.</p>
                                <div className={styles.radioGroup}>
                                    {opts.upholstery.map((u, i) => (
                                        <button
                                            key={u}
                                            className={`${styles.radioBtn} ${i === selectedUpholstery ? styles.radioBtnActive : ''}`}
                                            onClick={() => setSelectedUpholstery(i)}
                                        >
                                            <span className={styles.radio}>
                                                {i === selectedUpholstery && <span className={styles.radioDot} />}
                                            </span>
                                            {u}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Summary */}
                            <div className={styles.summary}>
                                <h3 className={styles.summaryTitle}>Your Configuration</h3>
                                <div className={styles.summaryRow}>
                                    <span>Model</span>
                                    <strong>{product.name}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Color</span>
                                    <strong>{currentColor.name}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Handpiece</span>
                                    <strong>{opts.handpiece[selectedHandpiece]}</strong>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span>Upholstery</span>
                                    <strong>{opts.upholstery[selectedUpholstery]}</strong>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className={styles.ctas}>
                                <Link
                                    href={`/contact?product=${encodeURIComponent(product.name)}&color=${encodeURIComponent(currentColor.name)}&handpiece=${encodeURIComponent(opts.handpiece[selectedHandpiece])}&upholstery=${encodeURIComponent(opts.upholstery[selectedUpholstery])}`}
                                    className="btn btn-primary btn-lg"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                >
                                    Request This Configuration →
                                </Link>
                                <a href="tel:+639625793024" className="btn btn-outline-dark" style={{ width: '100%', justifyContent: 'center' }}>
                                    Call to Discuss: +63 962 579 3024
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
