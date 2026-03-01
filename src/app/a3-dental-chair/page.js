'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from './page.module.css';

export default function A3DentalChairExactMatchPage() {
    // Hero Images State
    const [activeHeroIdx, setActiveHeroIdx] = useState(0);

    const heroImages = [
        { src: '/images/products/dxa3/dx-a3-main.jpg', alt: 'A3 Main View' },
        { src: '/images/products/dxa3/dx-a3-dentist-element.jpg', alt: 'A3 Dentist Element' },
        { src: '/images/configurator/lcd-command-standard.jpg', alt: 'A3 Command Control' },
        { src: '/images/products/dxa3/dx-a3-assistant-element.jpg', alt: 'A3 Assistant Table' },
        { src: '/images/products/dxa3/dx-a3-cuspidor.jpg', alt: 'A3 Cuspidor' }
    ];

    // Carousel State
    const [carouselIdx, setCarouselIdx] = useState(0);

    const advancedFeatures = [
        {
            id: "05",
            title: "05 Brand new design",
            image: "/images/products/dxa3/dx-a3-main.jpg",
            point1: "Inspired by the shield shape symbolizing the safe guarding of health for both dentists and patients."
        },
        {
            id: "06",
            title: "06 water supply system",
            image: "/images/products/dxa3/dx-a3-cuspidor.jpg",
            point1: "Independent disinfectant water supply system",
            point2: "EOW-Tech pipeline disinfection built-in"
        },
        {
            id: "07",
            title: "07 Assistant table",
            image: "/images/products/dxa3/dx-a3-assistant-element.jpg",
            point1: "With control panel for chair movement.",
            point2: "Wide side table meet the needs of assistant.",
            point3: "3-way syringe(warm water)",
            point4: "pre-posistion for curing light",
            point5: "Flexible movement,more convenient."
        },
        {
            id: "01",
            title: "01 Premium dental light",
            image: "/images/products/roson-s9/s9-light.png",
            point1: "Double mode control",
            point2: "Digital illumination and color temperature",
            point3: "Infrared non-unductive control",
            point4: "Condition breathing lamp"
        },
        {
            id: "02",
            title: "02 Dentist table",
            image: "/images/products/dxa3/dx-a3-dentist-element.jpg",
            point1: "Wide side table,meet the needs of dentist",
            point2: "Cleanable plastic pad protect the table",
            point3: "swiveling instruments holder.",
            point4: "Handpiece holder with 5 posisions",
            point5: "pre-posistion for scaler or electrimotor."
        }
    ];

    // Customization State
    const [activeHandpiece, setActiveHandpiece] = useState('over');

    const handpieceOptions = [
        { id: 'over', label: 'Over-the-Patient', image: '/images/products/dxa3/dx-a3-main.jpg' },
        { id: 'swing', label: 'Swing-Mounted', image: '/images/products/dxa3/dx-a3-cart.jpg' },
        { id: 'cart', label: 'Cart-Mounted', image: '/images/products/dxa3/dx-a3-cart.jpg' }
    ];

    const handleNextHero = () => {
        setActiveHeroIdx((prev) => (prev + 1) % heroImages.length);
    };

    const handlePrevHero = () => {
        setActiveHeroIdx((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    };

    const [cardsToShow, setCardsToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) setCardsToShow(1);
            else if (window.innerWidth <= 1024) setCardsToShow(2);
            else setCardsToShow(3);
        };

        // Initial check on mount
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNextCarousel = () => {
        setCarouselIdx((prev) => Math.min(prev + 1, advancedFeatures.length - cardsToShow));
    };

    const handlePrevCarousel = () => {
        setCarouselIdx((prev) => Math.max(prev - 1, 0));
    };

    return (
        <>
            <Head>
                <title>Roson Flagship Model A3 | Dentasource</title>
            </Head>
            <div className={styles.pageContainer}>

                {/* HERO SECTION MATCHING N2 PRO */}
                <section className={styles.heroSection}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroLeft}>
                            <div className={styles.thumbnailGallery}>
                                {heroImages.map((img, idx) => (
                                    <div
                                        key={idx}
                                        className={`${styles.thumbnail} ${idx === activeHeroIdx ? styles.active : ''}`}
                                        onClick={() => setActiveHeroIdx(idx)}
                                    >
                                        <img src={img.src} alt={`Thumbnail ${idx}`} />
                                    </div>
                                ))}
                            </div>
                            <div className={styles.mainImageWrapper}>
                                <button className={`${styles.navArrow} ${styles.navPrev}`} onClick={handlePrevHero}>&lt;</button>
                                <img src={heroImages[activeHeroIdx].src} alt="Hero Image" className={styles.mainImage} />
                                <button className={`${styles.navArrow} ${styles.navNext}`} onClick={handleNextHero}>&gt;</button>
                            </div>
                        </div>

                        <div className={styles.heroRight}>
                            <h1 className={styles.heroTitle}>Roson Flagship Model A3</h1>
                            <ul className={styles.heroFeatures}>
                                <li>80000+ dentists' continuous choice</li>
                                <li>Advancement Iteration Continuation</li>
                                <li>Ergonomic Design</li>
                                <li>Intelligent soft start/stop system</li>
                                <li>Medical-Grade Color LCD Display</li>
                                <li>Durable and Easy-to-Clean</li>
                                <li>Multiple Color Choices Available</li>
                                <li className={styles.longFeature}>
                                    With an intelligent soft start/stop system, the dental chair starts and stops smoothly without any jerkiness.
                                </li>
                            </ul>

                            <div className={styles.actionButtons}>
                                <button className={styles.playButton}>
                                    <div className={styles.playIcon}></div>
                                </button>
                                <button className={styles.quoteButton}>Get a Quote</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ADVANCED FEATURES CAROUSEL MATCHING N2 PRO */}
                <section className={styles.advancedFeaturesSection}>
                    <h2 className={styles.sectionTitle}>Advanced Features for Superior Dental Care</h2>

                    <div className={styles.carouselContainer}>
                        <div className={styles.timelineNavWrapper}>
                            <div className={styles.timelineLine}></div>
                            <div className={styles.timelineNodes}>
                                <button className={`${styles.carouselNavArrow} ${styles.carouselNavPrev}`} onClick={handlePrevCarousel}>&lt;</button>
                                <div className={`${styles.timelineNode} ${carouselIdx === 0 ? styles.active : ''}`}>
                                    <div className={styles.timelineNodeIcon}></div>
                                </div>
                                <div className={`${styles.timelineNode} ${carouselIdx === 1 ? styles.active : ''}`}>
                                    <div className={styles.timelineNodeIcon}></div>
                                </div>
                                <div className={`${styles.timelineNode} ${carouselIdx === 2 ? styles.active : ''}`}>
                                    <div className={styles.timelineNodeIcon}></div>
                                </div>
                                <div className={`${styles.timelineNode} ${carouselIdx >= 3 ? styles.active : ''}`}>
                                    <div className={styles.timelineNodeIcon}></div>
                                </div>
                                <button className={`${styles.carouselNavArrow} ${styles.carouselNavNext}`} onClick={handleNextCarousel}>&gt;</button>
                            </div>
                        </div>

                        <div className={styles.carouselTrackWrapper}>
                            <div
                                className={styles.carouselTrack}
                                style={{ transform: `translateX(calc(-${carouselIdx * (100 / cardsToShow)}% - ${carouselIdx * 2}rem))` }}
                            >
                                {advancedFeatures.map((feature, idx) => (
                                    <div key={idx} className={styles.featureCard}>
                                        <div className={styles.featureCardImage}>
                                            <img src={feature.image} alt={feature.title} />
                                        </div>
                                        <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                                        <ul className={styles.featureCardList}>
                                            {feature.point1 && <li>{feature.point1}</li>}
                                            {feature.point2 && <li>{feature.point2}</li>}
                                            {feature.point3 && <li>{feature.point3}</li>}
                                            {feature.point4 && <li>{feature.point4}</li>}
                                            {feature.point5 && <li>{feature.point5}</li>}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.carouselPagination}>
                            {advancedFeatures.slice(0, advancedFeatures.length - 2).map((_, idx) => (
                                <button
                                    key={idx}
                                    className={`${styles.paginationDot} ${idx === carouselIdx ? styles.active : ''}`}
                                    onClick={() => setCarouselIdx(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CUSTOMIZATION POSSIBILITIES MATCHING N2 PRO */}
                <section className={styles.customizationSection}>
                    <div className={styles.customizationContent}>
                        <div className={styles.customizationImageWrapper}>
                            <img
                                key={activeHandpiece}
                                src={handpieceOptions.find(opt => opt.id === activeHandpiece)?.image}
                                alt="Selected Customization"
                                className={styles.customizationImage}
                            />
                        </div>

                        <div className={styles.customizationRight}>
                            <h2 className={styles.customizationTitle}>Your Dental Unit, Your Way:<br />Customization Possibilities</h2>
                            <p className={styles.customizationSubtitle}>Handpiece Placement Choices</p>

                            <div className={styles.pillSelector}>
                                {handpieceOptions.map(option => (
                                    <button
                                        key={option.id}
                                        className={`${styles.pillOption} ${activeHandpiece === option.id ? styles.active : ''}`}
                                        onClick={() => setActiveHandpiece(option.id)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}
