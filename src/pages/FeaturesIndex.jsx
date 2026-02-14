import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FEATURES } from '../data/pageData';

const FeaturesIndex = () => {
    return (
        <PageLayout seo={{
            title: 'Features',
            description: 'Explore the features that make PilotUP AI employees different. One-click setup, no onboarding, multi-channel communication, and human-in-the-loop guardrails.',
            canonical: '/features',
            keywords: ['PilotUP features', 'AI employee features', 'one-click AI', 'human guardrails', 'AI automation features'],
        }}>
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Features</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                        Everything that makes PilotUP{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">different</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Not another chatbot. PilotUP AI employees are autonomous workers that operate inside your real tools, collaborate with your team, and deliver real output.
                    </motion.p>
                </div>
            </section>

            {/* Feature Grid */}
            <section className="py-12 sm:py-20 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {FEATURES.map((feature, i) => (
                            <motion.div key={feature.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                <Link to={`/features/${feature.slug}`} className="group block h-full">
                                    <div className="relative h-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 p-8">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-2xl shadow-md`}>
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#E21339] transition-colors">{feature.shortTitle}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{feature.description}</p>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#E21339]">
                                            Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cross-links */}
            <section className="py-12 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6">
                    <Link to="/roles" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">Explore roles <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/functions" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">View functions <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/integrations" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">See integrations <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                </div>
            </section>

            <WaitlistCTA heading="Experience the future of work" subtitle="Build AI employees with features that actually matter. Start with the waitlist." />
        </PageLayout>
    );
};

export default FeaturesIndex;
