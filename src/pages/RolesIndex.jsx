import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Search, Settings } from 'lucide-react';
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
            <div className="relative bg-[#fdfffc] min-h-screen overflow-hidden">

                {/* Hero Section */}
                <section className="relative z-10 pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-sm mb-8"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E21339] shadow-[0_0_8px_rgba(226,19,57,0.6)]" />
                            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Roles</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-4xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.05]"
                        >
                            Build the team you need — <br className="hidden sm:block" />
                            <span className="text-[#E21339]">one role at a time</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.6 }}
                            className="text-[17px] sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
                        >
                            Each PilotUP AI employee is built for a specific role with deep domain expertise. Choose a role, customize it, and watch them deliver.
                        </motion.p>
                    </div>
                </section>

                {/* Available Roles Grid */}
                <section className="relative z-10 pb-16 px-4 sm:px-6">
                    <div className="max-w-[1200px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 tracking-tight">Available Roles</h2>
                            <p className="text-gray-500 text-[15px] font-medium">Build and deploy these AI employees today.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                            {ROLES.map((role, i) => (
                                <motion.div
                                    key={role.slug}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                                    className="h-full"
                                >
                                    <Link to={`/roles/${role.slug}`} className="group block h-full outline-none">
                                        <div className="relative overflow-hidden flex flex-col rounded-[1.5rem] sm:rounded-[2.5rem] bg-white/95 backdrop-blur-2xl border border-gray-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] transition-all duration-500 p-6 sm:p-8 lg:p-12 h-full">

                                            {/* Icon Wrapper */}
                                            <div className="mb-8 group-hover:scale-105 transition-transform duration-500 origin-bottom-left">
                                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${role.iconBg} flex items-center justify-center shadow-sm border border-black/[0.04]`}>
                                                    {role.slug === 'growth-content-lead' ? (
                                                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                                    ) : role.slug === 'support-research-lead' ? (
                                                        <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                                    ) : (
                                                        <Settings className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                                                {role.shortTitle}
                                            </h3>

                                            <p className="text-[15px] sm:text-[17px] text-gray-600 leading-relaxed mb-6 sm:mb-8 flex-1">
                                                {role.description}
                                            </p>

                                            <Link
                                                to={`/roles/${role.slug}`}
                                                className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-900 text-white rounded-full text-[13px] sm:text-[14px] font-semibold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95"
                                            >
                                                Learn more
                                                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            {/* Optional Subtle Background Decoration based on role color */}
                                            <div className={`absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 ${role.color} rounded-full blur-[80px] sm:blur-[100px] opacity-40 pointer-events-none`} />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Planned Roles Section */}
                <section className="relative z-10 pb-20 sm:pb-24 px-4 sm:px-6">
                    <div className="max-w-[1200px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center sm:text-left pt-8 border-t border-gray-200/60">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-2 tracking-tight">Coming Soon</h2>
                            <p className="text-gray-400 text-[15px] font-medium">These roles are in development and will be available soon.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {PLANNED_ROLES.map((role, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.05, duration: 0.5 }}
                                    className="p-6 sm:p-8 rounded-[2rem] bg-white border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-all flex flex-col h-full opacity-60"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} opacity-30 flex items-center justify-center mb-5 text-gray-800 shadow-sm border border-white/50`}>
                                        <Sparkles className="w-5 h-5 opacity-70" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700 mb-2">{role.shortTitle}</h3>
                                    <p className="text-[14px] text-gray-400 leading-relaxed flex-1">{role.description}</p>

                                    <div className="mt-6">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200/50 text-[11px] font-bold text-gray-500 uppercase tracking-widest shadow-sm">
                                            In Development
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Cross-links */}
                <section className="relative z-10 pb-24 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <Link to="/functions" className="group px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-sm text-[14px] font-semibold text-gray-600 hover:text-[#E21339] hover:bg-white hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 transition-all">
                            Explore by function <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                        </Link>
                        <Link to="/features" className="group px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-sm text-[14px] font-semibold text-gray-600 hover:text-[#E21339] hover:bg-white hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 transition-all">
                            View all features <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                        </Link>
                        <Link to="/pricing" className="group px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-sm text-[14px] font-semibold text-gray-600 hover:text-[#E21339] hover:bg-white hover:shadow-md hover:-translate-y-0.5 flex items-center gap-1.5 transition-all">
                            See pricing <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                        </Link>
                    </div>
                </section>
            </div>

            <WaitlistCTA heading="Build the perfect team" subtitle="Hire AI employees for every role. Join the waitlist and start scaling." />
        </PageLayout>
    );
};

export default RolesIndex;