'use client';

import { motion } from 'framer-motion';

const MESSENGER_HANDLE = 'dentasourcedirect';

function MessengerIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.12 2 11.2c0 2.86 1.46 5.4 3.74 7.06V22l3.42-1.88c.9.25 1.86.38 2.84.38 5.52 0 10-4.12 10-9.2S17.52 2 12 2zm1 12.4l-2.5-2.66L5.7 14.4l5.3-5.6 2.56 2.66 4.74-2.66-5.3 5.6z" />
    </svg>
  );
}

export default function MessengerButton({
  prefillText,
  label = 'Message us on Messenger',
  variant = 'primary',
  product = null,
}) {
  const text = prefillText ||
    (product ? `Hi DSD, I'd like to know more about the Denjoy ${product}.` : 'Hi DSD, I found you through the Denjoy page.');
  const url = `https://m.me/${MESSENGER_HANDLE}?ref=${encodeURIComponent(text)}`;
  const ariaLabel = product
    ? `Open Facebook Messenger to chat about ${product}`
    : 'Open Facebook Messenger to chat with DentaSource Direct';

  const base = 'inline-flex items-center gap-2 font-semibold rounded-full transition-all';
  const sizing = variant === 'primary'
    ? 'px-6 py-3 text-base'
    : 'px-4 py-2 text-sm';
  const colors = variant === 'primary'
    ? 'bg-[#0084FF] text-white hover:bg-[#0073E0]'
    : 'bg-white text-[#0084FF] border border-[#0084FF] hover:bg-[#E8F4FF]';

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${sizing} ${colors}`}
    >
      <MessengerIcon />
      <span>{label}</span>
    </motion.a>
  );
}
