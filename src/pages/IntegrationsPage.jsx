import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { INTEGRATIONS } from '../data/pageData';

const IntegrationsPage = () => {
    const available = INTEGRATIONS.filter(i => i.status === 'available');
    const planned = INTEGRATIONS.filter(i => i.status === 'planned');

    return (
        <PageLayout seo={{
            title: 'Integrations',
            description: 'Invite your AI employees into the tools you already use. PilotUP integrates with Slack, Gmail, WhatsApp, ClickUp, Notion, Google Drive, and more.',
            canonical: '/integrations',
            keywords: ['PilotUP integrations', 'AI employee tools', 'Slack AI', 'ClickUp automation', 'business tool integration'],
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
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Integrations</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
                    >
                        Invite your AI employees into{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">your existing tools</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        No new platform to learn. Your AI employees work inside the apps your team already uses — Slack, Email, ClickUp, Notion, and more.
                    </motion.p>
                </div>
            </section>

            {/* ── AVAILABLE INTEGRATIONS ── */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Available Now</h2>
                    <p className="text-gray-500 text-sm mb-10">Your AI employees can connect to these tools today.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {available.map((integration, i) => (
                            <motion.div
                                key={integration.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative p-6 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5">
                                        <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-900">{integration.name}</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">Available</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed">{integration.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PLANNED INTEGRATIONS ── */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                    <p className="text-gray-500 text-sm mb-10">These integrations are on our roadmap and will be available soon.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {planned.map((integration, i) => (
                            <motion.div
                                key={integration.slug}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative p-6 rounded-2xl bg-gray-50 border border-gray-200 border-dashed"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden p-1.5 opacity-60">
                                        <img src={integration.logo} alt={integration.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-bold text-gray-700">{integration.name}</h3>
                                            <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Planned</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">{integration.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS SECTION ── */}
            <section className="py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[2.5rem] bg-[#F5F5F7] border border-gray-200 p-10 sm:p-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                            Your AI employee gets their own access
                        </h2>
                        <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                            Each AI employee gets their own credentials for your connected tools. They log in, do the work, and communicate results back to you — via Slack, email, or however you prefer. No shared logins, no manual handoffs.
                        </p>

                        <div className="grid sm:grid-cols-3 gap-6">
                            {[
                                { title: 'Dedicated Access', desc: 'Each AI employee gets unique credentials for your tools' },
                                { title: 'Work In-Place', desc: 'Tasks are completed directly inside your apps — no copy-pasting' },
                                { title: 'Results Reported', desc: 'Get summaries and updates via Slack, email, or your preferred channel' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/how-it-works" className="text-sm font-semibold text-[#E21339] hover:underline flex items-center gap-1">
                                See how it works <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <span className="text-gray-300 mx-2">·</span>
                            <Link to="/roles" className="text-sm font-semibold text-gray-600 hover:underline flex items-center gap-1">
                                Explore roles <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── CTA ── */}
            <WaitlistCTA heading="Connect your tools. Start delegating." subtitle="Your AI employees are ready to work inside your existing stack. Join the waitlist." />
        </PageLayout>
    );
};

export default IntegrationsPage;
