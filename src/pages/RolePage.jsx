import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight, Sparkles, Search, Settings, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { ROLES, INTEGRATIONS } from '../data/pageData';

const RolePage = () => {
    const { slug } = useParams();
    const role = ROLES.find(r => r.slug === slug);

    if (!role) return <Navigate to="/roles" replace />;

    // Define the brand red for easy reference in inline styles/classes if needed
    const brandRed = "text-[#E21339]";

    return (
        <PageLayout seo={{
            title: role.title,
            description: role.heroSubtitle,
            canonical: `/roles/${role.slug}`,
            keywords: [role.shortTitle, 'AI employee', 'PilotUP role', 'AI ' + role.shortTitle.toLowerCase()],
            schema: [{
                '@type': 'WebPage',
                name: role.title,
                description: role.heroSubtitle,
                url: `https://pilotup.io/roles/${role.slug}`,
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pilotup.io/' },
                        { '@type': 'ListItem', position: 2, name: 'Roles', item: 'https://pilotup.io/roles' },
                        { '@type': 'ListItem', position: 3, name: role.shortTitle, item: `https://pilotup.io/roles/${role.slug}` },
                    ]
                }
            }],
        }}>
            {/* Flat, matte background - no gradients or blurs */}
            <div className="relative bg-[#FAFAFA] min-h-screen">

                {/* HERO */}
                <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 border-b border-gray-200 bg-white">
                    <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

                        {/* Breadcrumb */}
                        <motion.nav
                            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 mb-8 text-[13px] font-medium text-gray-400"
                        >
                            <Link to="/roles" className="hover:text-gray-900 transition-colors">Roles</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                            <span className="text-gray-900">{role.shortTitle}</span>
                        </motion.nav>

                        {/* Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border-2 border-gray-100 flex items-center justify-center mb-8 text-[#E21339]"
                        >
                            {role.slug === 'growth-content-lead' ? (
                                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                            ) : role.slug === 'support-research-lead' ? (
                                <Search className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                            ) : (
                                <Settings className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                            )}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                            className="text-[2.2rem] sm:text-5xl lg:text-6xl font-bold text-gray-950 tracking-tight leading-[1.1] mb-5"
                        >
                            {role.title}<span className="text-[#E21339]">.</span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-10 font-medium"
                        >
                            {role.heroSubtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
                        >
                            <Link
                                to="/waitlist"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-[#E21339] text-white text-[15px] font-semibold hover:bg-[#c91030] transition-colors"
                            >
                                Build this Employee <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/roles"
                                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-[15px] font-semibold hover:border-gray-900 hover:text-gray-900 transition-colors"
                            >
                                Explore all Roles
                            </Link>
                        </motion.div>
                    </div>
                </section>

                <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-20 space-y-24">

                    {/* What They Do */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2 tracking-tight">What they do</h2>
                            <p className="text-gray-500 font-medium">Core responsibilities and capabilities.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {role.whatTheyDo.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="group flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-200 hover:border-[#E21339] transition-colors"
                                >
                                    <CheckCircle2 className="w-5 h-5 text-[#E21339] shrink-0 mt-0.5" strokeWidth={2.5} />
                                    <span className="text-[15px] text-gray-700 font-medium leading-relaxed">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Weekly Outputs */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2 tracking-tight">Typical weekly outputs</h2>
                            <p className="text-gray-500 font-medium">What to expect from your {role.shortTitle}.</p>
                        </motion.div>

                        <div className="space-y-3">
                            {role.weeklyOutputs.map((output, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="group flex items-center gap-5 p-5 rounded-xl bg-white border border-gray-200 hover:border-[#E21339] transition-colors cursor-default"
                                >
                                    {/* UPDATED: Red text/border normally -> Dark Matte Gray on hover */}
                                    <div className="w-10 h-10 rounded-lg bg-[#E21339]/10 border border-[#E21339]/20 flex items-center justify-center shrink-0 text-[15px] font-bold text-[#E21339] group-hover:bg-[#E21339]/30 transition-all duration-300">
                                        {i + 1}
                                    </div>
                                    <span className="text-[15px] text-gray-800 font-medium group-hover:text-gray-950 transition-colors">{output}</span>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Where They Work */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2 tracking-tight">Where they work</h2>
                            <p className="text-gray-500 font-medium">Integrations and tools they connect to.</p>
                        </motion.div>

                        <div className="flex flex-wrap gap-3 mb-8">
                            {role.whereTheyWork.map((toolName, i) => {
                                const integration = INTEGRATIONS.find(ig => ig.name === toolName);
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 5 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.03 }}
                                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white border border-gray-200 hover:border-[#E21339] cursor-default transition-colors shadow-sm hover:shadow-md"
                                    >
                                        {/* UPDATED: Removed grayscale and opacity-80, increased size slightly */}
                                        {integration && <img src={integration.logo} alt={toolName} className="w-5 h-5 object-contain" />}
                                        <span className="text-[14px] font-semibold text-gray-800">{toolName}</span>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <Link to="/integrations" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-gray-900 hover:text-[#E21339] transition-colors">
                            View all integrations <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </section>

                    {/* How You Manage */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 sm:p-12"
                        >
                            {/* Matte Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-[#E21339]" />

                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-4 tracking-tight">How you manage them</h2>
                            <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed max-w-2xl">{role.howYouManage}</p>
                        </motion.div>
                    </section>

                    {/* Example Tasks */}
                    <section>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-8"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 mb-2 tracking-tight">Example tasks</h2>
                            <p className="text-gray-500 font-medium">Day-to-day responsibilities and workflows.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {role.exampleTasks.map((task, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.05, duration: 0.4 }}
                                    className="p-6 rounded-xl bg-white border border-gray-200 hover:border-[#E21339] transition-colors flex flex-col"
                                >
                                    <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-md bg-gray-50 border border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-4">
                                        {task.tag}
                                    </span>
                                    <p className="text-[15px] text-gray-900 font-medium leading-relaxed">{task.title}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            <WaitlistCTA heading={`Build your ${role.shortTitle} today`} subtitle={`Join the waitlist and be among the first to deploy your AI employee.`} />
        </PageLayout>
    );
};

export default RolePage;