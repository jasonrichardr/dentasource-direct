'use client';
import { motion } from 'framer-motion';

const values = [
  {
    icon: '🤝',
    title: 'Closer to the Dentist',
    desc: 'We understand startup clinics, expanding practices, and multi-branch realities. Decisions are fast, human, and grounded in local reality.',
  },
  {
    icon: '🎓',
    title: 'Education Built In',
    desc: 'We don’t just sell products; we build capability. Every installation includes hands-on training, product mastery, and workflow optimization.',
  },
  {
    icon: '🇵🇭',
    title: 'Built for the Philippines',
    desc: 'We understand local clinic economics, space constraints, and staffing realities. Our support is culturally aligned and highly responsive.',
  },
  {
    icon: '💎',
    title: 'Long-Term Trust',
    desc: 'We offer honest recommendations—even if it means selling less. We optimize for your clinic’s reality, not our short-term margin.',
  }
];

export default function ValuesGrid() {
  return (
    <section className="py-24 bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
            Our Operational Pillars
          </h2>
          <p className="text-[#86868B] text-lg">
            The principles that guide every installation, consultation, and service call.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-6 bg-[#F5F5F7] w-16 h-16 flex items-center justify-center rounded-2xl">
                {value.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-4">{value.title}</h3>
              <p className="text-[#86868B] leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
