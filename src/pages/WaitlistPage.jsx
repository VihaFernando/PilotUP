import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Loader2, Shield, Star, Users, MessageSquare } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { submitToWaitlist } from '../lib/loops';
import WaitlistSuccessModal from '../components/WaitlistSuccessModal';
import PageLayout from '../components/PageLayout';

const WaitlistPage = () => {
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
                posthog.capture('joined_waitlist', { email, location: 'waitlist_page' });
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

    const trustBullets = [
        { icon: Shield, text: 'No spam, ever. We respect your inbox.' },
        { icon: Star, text: 'Early access to shape the product roadmap.' },
        { icon: Users, text: 'Join a community of forward-thinking founders.' },
        { icon: MessageSquare, text: 'Direct line to the founding team.' },
    ];

    return (
        <PageLayout seo={{
            title: 'Join the Waitlist',
            description: 'Get early access to PilotUP — build AI employees that work 24/7. No spam, no credit card required. Join the waitlist and start scaling smarter.',
            canonical: '/waitlist',
            keywords: ['PilotUP waitlist', 'AI employees early access', 'join waitlist', 'AI automation'],
        }}>
            <WaitlistSuccessModal open={showSuccessModal} onClose={() => setShowSuccessModal(false)} />

            <section className="relative min-h-[80vh] flex items-center justify-center px-6 py-20 bg-[#fdfffc]">
                {/* Background */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[120px] -z-10 opacity-50" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-t from-blue-50 to-transparent rounded-full blur-[100px] -z-10 opacity-40" />

                <div className="max-w-xl w-full text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffe5e7] text-[#E21339] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-[#E21339] animate-pulse" />
                        Limited Early Access
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]"
                    >
                        Get early access to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">PilotUP</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-gray-500 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed"
                    >
                        Be among the first founders to build AI employees that scale your business. No credit card required.
                    </motion.p>

                    {/* Email Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
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
                            aria-label="Email address"
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
                        <p className="mt-4 text-xs text-red-500">{error}</p>
                    )}

                    <p className="mt-4 text-[10px] sm:text-xs text-gray-400 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        No credit card required
                    </p>

                    {/* Trust Bullets */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left"
                    >
                        {trustBullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                    <b.icon className="w-4 h-4 text-gray-600" />
                                </div>
                                <span className="text-sm text-gray-600 leading-relaxed">{b.text}</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12 flex items-center justify-center gap-4"
                    >
                        <a href="https://www.instagram.com/thepilotup" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">Instagram</a>
                        <span className="text-gray-200">·</span>
                        <a href="https://www.linkedin.com/company/pilotup/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">LinkedIn</a>
                        <span className="text-gray-200">·</span>
                        <a href="https://www.youtube.com/@thepilotup" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2">YouTube</a>
                    </motion.div>
                </div>
            </section>
        </PageLayout>
    );
};

export default WaitlistPage;
