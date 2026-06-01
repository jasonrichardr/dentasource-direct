'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitLead } from '@/actions/lead';
import { trackLead } from '@/lib/analytics';

function BookingFormContent() {
  const searchParams = useSearchParams();
  const [interest, setInterest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const productInterest = searchParams.get('interest');
    if (productInterest) {
      setInterest(productInterest);
    }
  }, [searchParams]);

  const handleAction = async (formData) => {
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Append the controlled select value to the formData
    formData.append('interest', interest);

    const result = await submitLead(formData);

    if (result.error) {
      setErrorMessage(result.error);
      setIsSubmitting(false);
    } else {
      trackLead({ content_name: interest || 'general' });
      setIsSuccess(true);
    }
  };

  return (
    <div className="w-full h-full bg-white p-10 lg:p-20 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full max-w-xl"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-semibold text-[#1D1D1F] mb-3">Have a question? We&apos;ll answer.</h2>
                <p className="text-[#86868B]">
                  Ask about pricing, trade-in, or a specific product — we usually reply the same day.
                  Or just walk into our Pasig showroom any day, 9 AM – 8 PM.
                </p>
              </div>

              <form action={handleAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" name="firstName" aria-label="First Name" required className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors" placeholder="First Name" />
                  <input type="text" name="lastName" aria-label="Last Name" required className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors" placeholder="Last Name" />
                </div>

                <input type="text" name="clinicName" aria-label="Clinic Name" className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors" placeholder="Clinic Name (Optional)" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="email" name="email" aria-label="Email Address" required className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors" placeholder="Email Address" />
                  <input type="tel" name="phone" aria-label="Phone Number" required className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors" placeholder="Phone Number" />
                </div>

                <div className="relative group pt-2">
                  <select 
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    required
                    aria-label="Primary Area of Interest"
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors text-[#1D1D1F] appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Primary Area of Interest</option>
                    <option value="dental-chairs">Roson Dental Chairs</option>
                    <option value="imaging">X-Rays & Imaging</option>
                    <option value="endo">Endodontics</option>
                    <option value="microscopes">Microscopes</option>
                    <option value="trade-in">Trade-In Program</option>
                    <option value="general">General Showroom Visit</option>
                  </select>
                  <div className="absolute right-0 top-5 pointer-events-none text-[#86868B]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                <textarea name="message" aria-label="Tell us about your clinic" rows="3" required className="w-full px-0 py-3 bg-transparent border-b-2 border-black/10 focus:border-[#10b981] outline-none transition-colors resize-none" placeholder="Tell us about your clinic — size, specialty, and what you're looking for."></textarea>

                {errorMessage && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-8 px-8 py-4 bg-[#1a3c34] text-white rounded-full font-medium hover:bg-[#234e44] transition-all disabled:bg-[#1a3c34]/50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending…' : 'Send My Inquiry'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl text-[#10b981]">✓</span>
              </div>
              <h3 className="text-3xl font-semibold text-[#1D1D1F] mb-4">Message received.</h3>
              <p className="text-[#86868B] text-lg max-w-md mx-auto">
                Thank you. A DentaSource Direct specialist will reply shortly.
                Feel free to walk into our Pasig showroom any day — Monday through Sunday, 9 AM to 8 PM.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="w-full h-full bg-white p-10 lg:p-20 flex items-center justify-center">Loading...</div>}>
      <BookingFormContent />
    </Suspense>
  )
}
