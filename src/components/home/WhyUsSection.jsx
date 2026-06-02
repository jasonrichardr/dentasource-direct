'use client';
import { m as motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const items = [
  {
    num: '01',
    title: 'We Start Where You Are',
    descParts: [
      { text: "Opening your first clinic? Upgrading your third operatory? It doesn't matter — ", metal: false },
      { text: "we meet you at your stage. We'll walk your floor plan, understand your patient volume, and recommend equipment that matches where you are today and where you're headed.", metal: true },
    ],
    accent: '#c4993c',
  },
  {
    num: '02',
    title: 'Sit Before You Spend',
    descParts: [
      { text: "140 sqm — the largest dental equipment showroom in the Philippines. Every ROSON chair on display. Sit on it. Recline it. Feel the hydraulic. Compare side by side. Your next chair deserves more than a product photo — ", metal: false },
      { text: "it deserves your hands on it.", metal: true },
    ],
    accent: '#369078',
  },
  {
    num: '03',
    title: "We Stay Until You're Ready",
    descParts: [
      { text: "White-glove delivery. Professional installation. Staff training on day one. We don't just drop off a crate and leave ", metal: false },
      { text: "— we position your chair, calibrate your light, train your assistant, and clean up before your first patient walks in.", metal: true },
    ],
    accent: '#c4993c',
  },
  {
    num: '04',
    title: "We Grow With You",
    descParts: [
      { text: "Your first chair is just the beginning. As your practice grows, so does our support ", metal: false },
      { text: "— continuing education at our training center, equipment upgrade paths when you're ready, and a team that remembers your name years after the first install.", metal: true },
    ],
    accent: '#369078',
    badges: ['Training Center', 'CE Programs', 'Upgrade Path'],
  },
  {
    num: '05',
    title: "Your Clinic, Professionally Designed",
    descParts: [
      { text: "Starting a clinic from scratch? Our in-house architect will design your operatory layout ", metal: false },
      { text: "— optimized for patient flow, infection control, and equipment placement. Most dentists figure this out by trial and error. Our clients get it right the first time, free of charge.", metal: true },
    ],
    accent: '#c4993c',
    badges: ['Free Layout Design', 'Licensed Architect', 'Operatory Planning'],
  },
];

function TypewriterRich({ parts, speed = 10 }) {
  const ref = useRef(null);
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);
  const fullText = parts.map(p => p.text).join('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let i = 0;
          const tick = () => {
            i++;
            setCharCount(i);
            if (i < fullText.length) {
              setTimeout(tick, speed);
            } else {
              setDone(true);
            }
          };
          tick();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fullText, speed]);

  // Render parts with metallic styling
  let charsRendered = 0;
  return (
    <span ref={ref}>
      {parts.map((part, idx) => {
        const partStart = charsRendered;
        const partEnd = partStart + part.text.length;
        charsRendered = partEnd;

        if (charCount <= partStart) return null;

        const visibleChars = Math.min(charCount - partStart, part.text.length);
        const visibleText = part.text.slice(0, visibleChars);

        if (part.metal) {
          return (
            <span key={idx} className="metal-text">
              {visibleText}
            </span>
          );
        }

        return <span key={idx}>{visibleText}</span>;
      })}
      {!done && startedRef.current && (
        <span className="inline-block w-[2px] h-[1em] bg-white/40 ml-[1px] animate-pulse align-text-bottom" />
      )}
    </span>
  );
}

function SparkDots({ color }) {
  return (
    <div className="absolute -top-2 -right-2 flex gap-1">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 5, height: 5, background: color }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

function AnimatedCard({ item, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        className="relative rounded-3xl p-8 sm:p-10 transition-all duration-500 overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${item.accent}15, transparent 70%)`,
          }}
        />

        {/* Spark dots */}
        <SparkDots color={item.accent} />

        {/* Number */}
        <div className="relative z-10">
          <motion.span
            className="block text-6xl sm:text-7xl font-serif italic leading-none mb-6"
            style={{ color: item.accent, opacity: 0.25 }}
            animate={{ opacity: [0, 0.25] }}
            transition={{ duration: 1.5, delay: index * 0.2 }}
          >
            {item.num}
          </motion.span>

          {/* Title with animated underline */}
          <h3 className="text-2xl sm:text-[1.7rem] font-bold text-white mb-4 relative inline-block">
            {item.title}
            <motion.span
              className="absolute -bottom-1 left-0 h-[2px] rounded-full"
              style={{ background: item.accent }}
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, delay: 0.5 + index * 0.15 }}
            />
          </h3>

          <p className="text-white/55 leading-relaxed text-[1.05rem]" style={{ minHeight: '7em' }}>
            <TypewriterRich parts={item.descParts} speed={10} />
          </p>

          {/* Badges */}
          {item.badges && (
            <div className="flex flex-wrap gap-2 mt-5">
              {item.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full border"
                  style={{
                    color: item.accent,
                    borderColor: `${item.accent}40`,
                    background: `${item.accent}10`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.accent }} />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function WhyUsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-[#0A1410] relative overflow-hidden">
      <style>{`
        @keyframes metalShine {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .metal-text {
          background: linear-gradient(110deg, #8a9aaa 0%, #c8d4de 20%, #ffffff 35%, #c8d4de 50%, #8a9aaa 65%, #d4dfe8 80%, #8a9aaa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: metalShine 6s linear infinite;
          font-weight: 600;
        }
      `}</style>
      {/* Decorative background elements */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(196,153,60,0.06), transparent 70%)' }} />
      <div className="absolute bottom-[15%] left-[8%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(54,144,120,0.05), transparent 70%)' }} />

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[#c4993c] font-semibold tracking-[0.2em] uppercase text-xs sm:text-sm mb-4 block"
          >
            The DentaSource Difference
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-[1.15]"
          >
            Your Growth Partner in{' '}
            <span className="relative inline-block">
              Dentistry
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-[#c4993c]"
                initial={{ width: 0 }}
                animate={isInView ? { width: '100%' } : {}}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>
            .
          </motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {items.map((item, i) => (
            <AnimatedCard key={item.num} item={item} index={i} />
          ))}
        </div>

        {/* Bottom accent line */}
        <motion.div
          className="mt-16 sm:mt-20 mx-auto h-[1px] rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(196,153,60,0.3), rgba(54,144,120,0.3), transparent)' }}
          initial={{ width: 0 }}
          animate={{ width: '80%' }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
      </div>
    </section>
  );
}
