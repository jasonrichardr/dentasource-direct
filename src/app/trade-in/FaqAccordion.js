'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FaqAccordion.module.css';

const faqs = [
    {
        question: 'What dental chair is eligible for trade-in?',
        answer: 'You can trade in almost any make or model of dental chair for a trade-in credit toward a new premium ROSON dental chair. Even if your dental chair does not qualify for trade-in value, our team can still dismantle and recycle it for free to clear out your space.'
    },
    {
        question: 'Does my current chair need to be in working condition?',
        answer: 'Not at all. While fully functional chairs typically command higher trade-in values, our comprehensive appraisal process evaluates your dental chair in any condition—from legacy units to non-operational chairs. Our priority is maximizing your value to ensure a smooth clinic upgrade.'
    },
    {
        question: 'How do I prepare my dental chair before I trade it in?',
        answer: 'There is no heavy lifting or dismantling required on your part. Our specialized white-glove team handles everything from safely uninstalling your old chair to flawlessly installing your new ROSON setup. We coordinate everything for the exact same day, guaranteeing zero operational downtime.'
    },
    {
        question: 'How quickly can I get an appraisal?',
        answer: 'It is a completely seamless process. Simply send us a few photos and basic details of your current dental chair, and our evaluation team will provide a transparent, no-obligation estimate within 24 hours. Once accepted, your credit is instantly applied toward your new purchase.'
    }
];

function AccordionItem({ faq, isOpen, onClick }) {
    return (
        <div className={styles.accordionItem}>
            <button
                className={styles.accordionHeader}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <h3 className={styles.question}>{faq.question}</h3>
                <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        className={styles.accordionContent}
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                            open: { opacity: 1, height: 'auto', marginTop: 16 },
                            collapsed: { opacity: 0, height: 0, marginTop: 0 }
                        }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                        <p className={styles.answer}>{faq.answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FaqAccordion() {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className={styles.faqSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Trade-in Eligibility</h2>
                <div className={styles.accordionList}>
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            faq={faq}
                            isOpen={index === openIndex}
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
