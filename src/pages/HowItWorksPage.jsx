import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { HowItWorks } from '../App';

const HowItWorksPage = () => {
    return (
        <PageLayout seo={{
            title: 'How It Works',
            description: 'Get started with PilotUP in 5 simple steps. Create an account, build your first AI employee, connect your tools, and start delegating tasks today.',
            canonical: '/how-it-works',
            keywords: ['how PilotUP works', 'AI employee setup', 'getting started', 'AI automation steps'],
        }}>
            {/* ── HERO ── */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">How It Works</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        From sign-up to{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">scaled team</span>{' '}
                        in minutes
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        No complex setup. No onboarding period.
                        Build your first AI employee and watch them start delivering results immediately.
                    </motion.p>
                </div>
            </section>

            {/* ── REUSE THE SAME HOW-IT-WORKS COMPONENT FROM APP.JSX ── */}
            <HowItWorks />

            {/* ── BOTTOM CTA ── */}
            <section className="relative py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/10 p-10 sm:p-16 text-center"
                    >
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E21339]/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                                Ready to build your first AI employee?
                            </h2>
                            <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-lg mx-auto">
                                Join the waitlist and get early access. No credit card required. Start building in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/waitlist" className="px-8 py-3.5 rounded-full bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2">
                                    Join the Waitlist <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/roles" className="px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/5 transition-all">
                                    Explore Roles
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </PageLayout>
    );
};

export default HowItWorksPage;
