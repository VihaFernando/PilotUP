import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { submitToWaitlist } from '../lib/loops';
import WaitlistSuccessModal from './WaitlistSuccessModal';

/**
 * Reusable CTA section with waitlist email form.
 * Styled to match the existing Join section in App.jsx.
 *
 * Props:
 *   heading   – main heading text (default: "Hire your first AI Employee.")
 *   subtitle  – line below heading
 *   dark      – if true, renders on dark bg
 */
const WaitlistCTA = ({
    heading = 'Hire your first AI Employee.',
    subtitle = 'Founders are already preparing to scale smarter. Join the waiting list and be next.',
    dark = false,
}) => {
    const posthog = usePostHog();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

    const handleJoinWaitlist = async () => {
        setError(null);
        if (!isValidEmail(email)) {
            posthog?.capture('waitlist_validation_failed', { email });
            setError('Enter a valid email');
            return;
        }
        setLoading(true);
        try {
            if (posthog) {
                posthog.identify(email, { email, source: 'waitlist' });
                posthog.capture('joined_waitlist', { email, location: 'cta_section' });
            }
            const sourceFromUrl = searchParams.get('source');
            const { ok, error: apiError } = await submitToWaitlist(email, sourceFromUrl);
            if (!ok) { setError(apiError || 'Something went wrong. Try again.'); return; }
            setEmail('');
            setShowSuccessModal(true);
        } catch {
            setError('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`relative py-16 sm:py-24 px-6 w-full overflow-hidden ${dark ? 'bg-[#0A0A0A]' : 'bg-[#fdfffc]'}`}>
            <WaitlistSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[80px] sm:blur-[120px] -z-10 opacity-40" />

            <div className="max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffe5e7] text-[#E21339] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6"
                >
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E21339] animate-pulse" />
                    Exclusive Early Access
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-[1.1] ${dark ? 'text-white' : 'text-gray-900'}`}
                >
                    {heading}
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className={`text-sm sm:text-lg leading-relaxed max-w-md mx-auto mb-8 sm:mb-10 ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                >
                    {subtitle}
                </motion.p>

                {/* Email Input */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="relative flex items-center w-full max-w-md mx-auto p-1 rounded-full backdrop-blur-2xl backdrop-saturate-150 border border-gray-200/60 bg-gradient-to-b from-gray-200/90 to-gray-300/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.06)] focus-within:shadow-[0_8px_30px_rgba(226,19,57,0.15)] transition-all duration-300"
                >
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinWaitlist()}
                        placeholder="Enter your email..."
                        className="flex-grow px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-full min-w-0"
                    />
                    <button
                        className={`group flex items-center justify-center w-10 h-10 sm:w-auto sm:px-6 sm:h-12 bg-gray-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:scale-105 active:scale-95 shrink-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleJoinWaitlist}
                        disabled={loading}
                    >
                        <span className="hidden sm:block font-semibold mr-2 text-sm">{loading ? 'Joining...' : 'Join Waitlist'}</span>
                        {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
                    </button>
                </motion.div>

                {error && (
                    <p className="mt-4 text-xs text-red-500 flex items-center justify-center gap-1">{error}</p>
                )}

                <p className="mt-4 text-[10px] sm:text-xs text-gray-400 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    No credit card required
                </p>

                <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
                    <Link to="/pricing" className="hover:text-gray-600 transition-colors underline underline-offset-2">View pricing</Link>
                    <Link to="/how-it-works" className="hover:text-gray-600 transition-colors underline underline-offset-2">How it works</Link>
                </div>
            </div>
        </section>
    );
};

export default WaitlistCTA;
