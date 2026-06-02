'use client';

import { m as motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'How many Denjoy products does DentaSource Direct distribute in the Philippines?',
    a: 'Twelve, as of 2026. The full Denjoy line is exclusively distributed by DSD: 3 integrated systems (Meet Endo, Meta Endo Pro I, Meta Endo), 2 apex locators (FREE PEX, i-Pexo), 2 microscopes (ix6, ix7), 1 cordless motor (i-Moto), and 4 auxiliary products (iUe1, iCure, iPack, Meta Pack).',
  },
  {
    q: 'Where can I see and demo a Denjoy unit before buying?',
    a: 'At the DentaSource Direct Pasig showroom — 610 C. Maybunga Rd, Pasig City 1600. The Meet Endo flagship is already installed for live demos. Other units are demo-ready by appointment. Message us via the chat to schedule.',
  },
  {
    q: 'Is DentaSource Direct an official Denjoy distributor?',
    a: 'DSD is the exclusive Denjoy distributor in the Philippines. All units sold by DSD include local warranty, training, and direct support — not just import paperwork.',
  },
];

export default function DenjoyFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      aria-labelledby="denjoy-faq-heading"
      className="snap-start bg-zinc-50 py-12 md:py-16"
    >
      <div className="mx-auto max-w-3xl px-4">
        <h2
          id="denjoy-faq-heading"
          className="font-serif italic text-2xl md:text-3xl text-zinc-900 mb-6 tracking-tight"
        >
          Common questions.
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className="rounded-lg border border-zinc-200 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:bg-zinc-100"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-zinc-900 text-sm md:text-base">
                    {faq.q}
                  </span>
                  <span
                    className={`text-zinc-400 transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 text-zinc-700 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
