import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FUNCTIONS } from '../data/pageData';

const FunctionsIndex = () => {
    return (
        <PageLayout seo={{
            title: 'AI Employees by Function',
            description: 'Build AI employees for Sales, Marketing, Support, Operations, and Research. PilotUP AI agents are designed for your specific business function.',
            canonical: '/functions',
            keywords: ['AI employee functions', 'AI sales', 'AI marketing', 'AI support', 'AI operations', 'business automation'],
        }}>
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Functions</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                        AI employees for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">every function</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Whether you need help with sales, marketing, support, operations, or research — PilotUP has AI employees purpose-built for each function.
                    </motion.p>
                </div>
            </section>

            {/* Function Cards */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FUNCTIONS.map((fn, i) => (
                        <motion.div key={fn.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                            <Link to={`/functions/${fn.slug}`} className="group block h-full">
                                <div className="relative h-full overflow-hidden rounded-[2rem] border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 p-8">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${fn.color} flex items-center justify-center mb-6 text-2xl shadow-md`}>
                                        {fn.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E21339] transition-colors">{fn.shortTitle}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed mb-6">{fn.description}</p>

                                    {/* Tool pills */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {fn.toolsTheyWorkIn.slice(0, 3).map((tool, j) => (
                                            <span key={j} className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-medium text-gray-500">{tool}</span>
                                        ))}
                                        {fn.toolsTheyWorkIn.length > 3 && (
                                            <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[11px] font-medium text-gray-400">+{fn.toolsTheyWorkIn.length - 3} more</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E21339]">
                                        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Cross-links */}
            <section className="py-12 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6">
                    <Link to="/roles" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">Explore by role <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">View features <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/integrations" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">See integrations <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                </div>
            </section>

            <WaitlistCTA heading="Build an AI employee for any function" subtitle="Start with one function. Scale to all of them." />
        </PageLayout>
    );
};

export default FunctionsIndex;
