import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { ROLES, PLANNED_ROLES } from '../data/pageData';

const RolesIndex = () => {
    return (
        <PageLayout seo={{
            title: 'AI Employee Roles',
            description: 'Explore the AI employee roles you can build with PilotUP. From Growth & Content Lead to Operations Manager — hire the team you need in minutes.',
            canonical: '/roles',
            keywords: ['AI employee roles', 'AI content lead', 'AI operations manager', 'AI support researcher', 'build AI team'],
        }}>
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Roles</span>
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]">
                        Build the team you need —{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E21339] to-[#F0284A]">one role at a time</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Each PilotUP AI employee is built for a specific role with deep domain expertise. Choose a role, customize it, and watch them deliver.
                    </motion.p>
                </div>
            </section>

            {/* Available Roles */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Available Roles</h2>
                    <p className="text-gray-500 text-sm mb-10">Build and deploy these AI employees today.</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {ROLES.map((role, i) => (
                            <motion.div key={role.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <Link to={`/roles/${role.slug}`} className="group block h-full">
                                    <div className={`relative h-full overflow-hidden rounded-[2rem] border ${role.borderColor} bg-white hover:shadow-lg transition-all duration-300 p-8`}>
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 text-white text-xl shadow-md`}>
                                            {role.slug === 'growth-content-lead' ? '📝' : role.slug === 'support-research-lead' ? '🔍' : '⚙️'}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#E21339] transition-colors">{role.shortTitle}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed mb-6">{role.description}</p>
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

            {/* Planned Roles */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Coming Soon</h2>
                    <p className="text-gray-500 text-sm mb-10">These roles are in development and will be available soon.</p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {PLANNED_ROLES.map((role, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-6 rounded-2xl bg-gray-50 border border-gray-200 border-dashed">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} opacity-50 flex items-center justify-center mb-4 text-white text-lg`}>
                                    ✦
                                </div>
                                <h3 className="text-base font-bold text-gray-700 mb-1">{role.shortTitle}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{role.description}</p>
                                <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold uppercase">Coming soon</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Links */}
            <section className="py-12 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-6">
                    <Link to="/functions" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">Explore by function <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">View all features <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                    <Link to="/pricing" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors">See pricing <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                </div>
            </section>

            <WaitlistCTA heading="Build the perfect team" subtitle="Hire AI employees for every role. Join the waitlist and start scaling." />
        </PageLayout>
    );
};

export default RolesIndex;
