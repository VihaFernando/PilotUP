import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { ROLES, INTEGRATIONS } from '../data/pageData';

const RolePage = () => {
    const { slug } = useParams();
    const role = ROLES.find(r => r.slug === slug);

    if (!role) return <Navigate to="/roles" replace />;

    const roleIcon = role.slug === 'growth-content-lead' ? '📝' : role.slug === 'support-research-lead' ? '🔍' : '⚙️';

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
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[120px] -z-10 opacity-30" />
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
                        <Link to="/roles" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Roles</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-xs text-gray-600 font-medium">{role.shortTitle}</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center text-2xl text-white shadow-lg mb-6`}>
                        {roleIcon}
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
                        {role.title}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
                        {role.heroSubtitle}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
                        <Link to="/waitlist" className="px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm">
                            Build this Employee <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/how-it-works" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm">
                            How it works
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* What They Do */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">What they do</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {role.whatTheyDo.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Weekly Outputs */}
            <section className="py-12 sm:py-16 px-6 bg-[#F5F5F7]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Typical weekly outputs</h2>
                    <p className="text-gray-500 text-sm mb-8">Here's what to expect from your {role.shortTitle} each week.</p>
                    <div className="space-y-3">
                        {role.weeklyOutputs.map((output, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <div className={`w-8 h-8 rounded-lg ${role.lightColor} flex items-center justify-center shrink-0`}>
                                    <span className={`text-sm font-bold ${role.textColor}`}>{i + 1}</span>
                                </div>
                                <span className="text-sm text-gray-700">{output}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Where They Work */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Where they work</h2>
                    <p className="text-gray-500 text-sm mb-8">Your {role.shortTitle} connects to these tools.</p>
                    <div className="flex flex-wrap gap-3">
                        {role.whereTheyWork.map((toolName, i) => {
                            const integration = INTEGRATIONS.find(ig => ig.name === toolName);
                            return (
                                <div key={i} className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white border border-gray-200 shadow-sm">
                                    {integration && <img src={integration.logo} alt={toolName} className="w-5 h-5 object-contain" />}
                                    <span className="text-sm font-medium text-gray-700">{toolName}</span>
                                </div>
                            );
                        })}
                    </div>
                    <Link to="/integrations" className="inline-flex items-center gap-1 mt-6 text-sm font-semibold text-[#E21339] hover:underline">
                        See all integrations <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </section>

            {/* How You Manage */}
            <section className="py-12 sm:py-16 px-6 bg-[#F5F5F7]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">How you manage them</h2>
                    <p className="text-gray-600 text-base leading-relaxed max-w-2xl">{role.howYouManage}</p>
                </div>
            </section>

            {/* Example Tasks */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Example tasks</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {role.exampleTasks.map((task, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <span className={`inline-block px-2 py-0.5 rounded-full ${role.lightColor} ${role.textColor} text-[10px] font-bold uppercase tracking-wider mb-3`}>{task.tag}</span>
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">{task.title}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <WaitlistCTA heading={`Build your ${role.shortTitle} today`} subtitle={`Join the waitlist and be among the first to deploy a ${role.shortTitle}.`} />
        </PageLayout>
    );
};

export default RolePage;
