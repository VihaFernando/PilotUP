import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Sparkles, Plus, X, ArrowRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { PRICING_FAQS, PLAN_COMPARISON } from '../data/pageData';

const PRICING = {
    monthly: { growth: 149, exec: 499 },
};

const PricingPage = () => {
    const [isYearly, setIsYearly] = useState(true);
    const [openFaqIndex, setOpenFaqIndex] = useState(0);

    const growthMonthly = PRICING.monthly.growth;
    const execMonthly = PRICING.monthly.exec;
    const growthAnnualPerMonth = Math.round(growthMonthly * 0.8);
    const execAnnualPerMonth = Math.round(execMonthly * 0.8);

    return (
        <PageLayout seo={{
            title: 'Pricing',
            description: 'Simple, transparent pricing for PilotUP. Start free with 50,000 credits. Scale with Growth or Executive plans. No hidden fees.',
            canonical: '/pricing',
            keywords: ['PilotUP pricing', 'AI employee cost', 'AI automation pricing', 'business automation plans'],
        }}>
            {/* ── HERO ── */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-[1280px] mx-auto">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Pricing</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
                        >
                            Simple, transparent pricing
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            className="text-lg text-gray-500 max-w-lg mx-auto mb-10"
                        >
                            Start free. Scale when you're ready.{' '}
                            <span className="text-gray-900 font-medium">No hidden fees, no surprises.</span>
                        </motion.p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4">
                            <div className="relative flex bg-gray-200 p-2 rounded-full cursor-pointer w-[220px]">
                                <div
                                    className="absolute inset-y-1 left-1 w-[calc(50%-8px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                                    style={{ transform: isYearly ? 'translateX(0)' : 'translateX(100%) translateX(4px)' }}
                                />
                                <button onClick={() => setIsYearly(true)} className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                                    Yearly <span className="inline-block align-text-top text-[10px] text-emerald-600 ml-1 font-bold">-20%</span>
                                </button>
                                <button onClick={() => setIsYearly(false)} className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${!isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                                    Monthly
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── PRICING CARDS ── */}
                    <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-24">
                        {/* Starter */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative overflow-hidden flex flex-col p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-blue-50/10 border border-gray-200/60 hover:border-blue-200 transition-colors shadow-md hover:shadow-lg">
                            <div className="mb-6"><span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">Starter</span></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">The Freemium</h3>
                            <p className="text-gray-500 text-sm mb-6 h-10">Perfect for exploring the platform and building your first agent. <b>Forever free.</b></p>
                            <div className="text-4xl font-bold text-gray-900 mb-2">$0 <span className="text-lg font-medium text-gray-400">/mo</span></div>
                            <div className="text-xs text-gray-500 mb-6">FREE PLAN. FREE FOREVER.</div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {['50,000 credits (One-time)', '1 Company Profile', '3 Active Agents', 'Community Support'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={3} />{f}</li>
                                ))}
                            </ul>
                            <Link to="/waitlist" className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-center block">Get Early Access</Link>
                        </motion.div>

                        {/* Growth */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative flex flex-col p-8 rounded-[2.5rem] bg-[#090909] text-white shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"><span className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#E21339] text-white text-xs font-bold tracking-wider shadow-lg"><Sparkles className="w-3 h-3 fill-white" /> Recommended</span></div>
                            <div className="mb-6 mt-2"><span className="px-3 py-1 rounded-full bg-gray-800 text-white text-xs font-bold uppercase tracking-wider">Growth</span></div>
                            <h3 className="text-xl font-bold text-white mb-2">Growth Squad</h3>
                            <p className="text-gray-400 text-sm mb-6 h-10">For startups ready to automate serious execution.</p>
                            <div className="text-4xl font-bold text-white mb-2">${isYearly ? growthAnnualPerMonth : growthMonthly}<span className="text-lg font-medium text-gray-500">/mo</span></div>
                            {isYearly && <div className="text-xs text-gray-300 mb-4">Billed annually</div>}
                            <ul className="space-y-4 mb-8 flex-1">
                                {['250,000 credits / mo', '3 Company Profiles', '10 Active Agents', 'Priority Support', 'Credit Top-Up Bundles'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-300"><div className="w-5 h-5 rounded-full bg-[#E21339]/20 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-[#E21339]" strokeWidth={3} /></div>{f}</li>
                                ))}
                            </ul>
                            <Link to="/waitlist" className="w-full py-3.5 rounded-2xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg shadow-white/10 text-center block">Get Early Access</Link>
                        </motion.div>

                        {/* Executive */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col p-8 rounded-[2.5rem] bg-white border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="mb-6"><span className="px-3 py-1 rounded-full bg-[#ffe5e7] text-[#E21339] border border-[#E21339]/30 text-xs font-bold uppercase tracking-wider">Scale</span></div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Executive</h3>
                            <p className="text-gray-500 text-sm mb-6 h-10">Full autonomy for scaling companies with heavy execution needs.</p>
                            <div className="text-4xl font-bold text-gray-900 mb-2">${isYearly ? execAnnualPerMonth : execMonthly}<span className="text-lg font-medium text-gray-400">/mo</span></div>
                            {isYearly && <div className="text-xs text-gray-500 mb-4">Billed annually</div>}
                            <ul className="space-y-4 mb-8 flex-1">
                                {['1,000,000 credits / mo', 'Unlimited Companies', '25 Active Agents', 'Dedicated Account Manager', 'API Access'].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600"><Check className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={3} />{f}</li>
                                ))}
                            </ul>
                            <Link to="/waitlist" className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all text-center block">Get Early Access</Link>
                        </motion.div>
                    </div>

                    {/* ── COMPARISON TABLE ── */}
                    <div className="max-w-5xl mx-auto mb-24">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight">Compare plans in detail</h2>
                        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50">
                                        <th className="text-left py-4 px-6 font-semibold text-gray-600">Feature</th>
                                        <th className="text-center py-4 px-4 font-semibold text-gray-600">Starter</th>
                                        <th className="text-center py-4 px-4 font-semibold text-gray-900 bg-gray-100/50">Growth</th>
                                        <th className="text-center py-4 px-4 font-semibold text-gray-600">Executive</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {PLAN_COMPARISON.map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 px-6 font-medium text-gray-700">{row.feature}</td>
                                            <td className="py-3.5 px-4 text-center text-gray-500">{row.starter}</td>
                                            <td className="py-3.5 px-4 text-center text-gray-900 font-medium bg-gray-50/30">{row.growth}</td>
                                            <td className="py-3.5 px-4 text-center text-gray-500">{row.executive}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── FAQ ── */}
                    <div className="max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12 tracking-tight">Pricing FAQ</h2>
                        <div className="flex flex-col gap-4">
                            {PRICING_FAQS.map((faq, idx) => {
                                const isOpen = openFaqIndex === idx;
                                return (
                                    <motion.div key={idx} layout initial={false} onClick={() => setOpenFaqIndex(isOpen ? null : idx)} className={`relative overflow-hidden cursor-pointer group ${isOpen ? 'z-10' : 'z-0'}`}>
                                        <motion.div layout className={`relative z-20 flex justify-between items-center gap-6 p-6 sm:p-8 rounded-[2rem] transition-colors duration-300 ${isOpen ? 'bg-[#0A0A0A] shadow-2xl' : 'bg-white/50 hover:bg-gray-50 border border-gray-200 shadow-sm'}`}>
                                            <motion.h3 layout="position" className={`text-lg font-bold leading-snug flex-1 transition-colors duration-300 ${isOpen ? 'text-white' : 'text-gray-900'}`}>{faq.q}</motion.h3>
                                            <div className="shrink-0 relative w-6 h-6 flex items-center justify-center">
                                                <motion.div animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 0 : 1 }} className="absolute"><Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-900" /></motion.div>
                                                <motion.div animate={{ rotate: isOpen ? 0 : -45, opacity: isOpen ? 1 : 0 }} className="absolute"><X className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-[#E21339]'}`} /></motion.div>
                                            </div>
                                        </motion.div>
                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} className="relative z-10 overflow-hidden">
                                                    <div className="bg-[#F9FAFB] rounded-b-[2rem] -mt-6 pt-10 pb-8 px-6 sm:px-8 mx-2 border-x border-b border-gray-100/50">
                                                        <motion.p initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.3, delay: 0.1 }} className="text-gray-500 text-sm sm:text-base leading-relaxed">{faq.a}</motion.p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <WaitlistCTA heading="Start scaling for free" subtitle="Create your first AI employee today. No credit card required." />
        </PageLayout>
    );
};

export default PricingPage;
