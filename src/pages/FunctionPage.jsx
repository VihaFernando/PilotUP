import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight, Clock } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FUNCTIONS, INTEGRATIONS } from '../data/pageData';

const FunctionPage = () => {
    const { slug } = useParams();
    const fn = FUNCTIONS.find(f => f.slug === slug);

    if (!fn) return <Navigate to="/functions" replace />;

    return (
        <PageLayout seo={{
            title: fn.title,
            description: fn.heroSubtitle,
            canonical: `/functions/${fn.slug}`,
            keywords: [fn.shortTitle, 'AI employee', 'PilotUP', 'AI ' + fn.shortTitle.toLowerCase(), fn.shortTitle.toLowerCase() + ' automation'],
            schema: [{
                '@type': 'WebPage',
                name: fn.title,
                description: fn.heroSubtitle,
                url: `https://pilotup.io/functions/${fn.slug}`,
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pilotup.io/' },
                        { '@type': 'ListItem', position: 2, name: 'Functions', item: 'https://pilotup.io/functions' },
                        { '@type': 'ListItem', position: 3, name: fn.shortTitle, item: `https://pilotup.io/functions/${fn.slug}` },
                    ]
                }
            }],
        }}>
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[120px] -z-10 opacity-30" />
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
                        <Link to="/functions" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Functions</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-xs text-gray-600 font-medium">{fn.shortTitle}</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${fn.color} flex items-center justify-center text-2xl shadow-lg mb-6`}>
                        {fn.icon}
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
                        {fn.title}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
                        {fn.heroSubtitle}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
                        <Link to="/waitlist" className="px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm">
                            Build this Employee <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/roles" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm">
                            Explore Roles
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* What You Can Offload */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">What you can offload</h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {fn.whatYouCanOffload.map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Outputs You Get */}
            <section className="py-12 sm:py-16 px-6 bg-[#F5F5F7]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Outputs you get</h2>
                    <p className="text-gray-500 text-sm mb-8">Tangible deliverables from your AI {fn.shortTitle} employee.</p>
                    <div className="space-y-3">
                        {fn.outputsYouGet.map((output, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                                <div className={`w-8 h-8 rounded-lg ${fn.lightColor} flex items-center justify-center shrink-0`}>
                                    <span className={`text-sm font-bold ${fn.textColor}`}>{i + 1}</span>
                                </div>
                                <span className="text-sm text-gray-700">{output}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools They Work In */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Tools they work in</h2>
                    <p className="text-gray-500 text-sm mb-8">Your AI {fn.shortTitle} employee connects to these platforms.</p>
                    <div className="flex flex-wrap gap-3">
                        {fn.toolsTheyWorkIn.map((toolName, i) => {
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

            {/* Day-to-Day */}
            <section className="py-12 sm:py-16 px-6 bg-[#F5F5F7]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">How it would run day-to-day</h2>
                    <p className="text-gray-500 text-sm mb-8">A typical day in the life of your AI {fn.shortTitle} employee.</p>
                    <div className="space-y-4">
                        {fn.dayToDay.map((slot, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex gap-4 sm:gap-6 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-2 shrink-0 w-28">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-bold text-gray-700">{slot.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">{slot.activity}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <WaitlistCTA heading={`Scale your ${fn.shortTitle.toLowerCase()} with AI`} subtitle={`Build an AI employee for ${fn.shortTitle.toLowerCase()} and start seeing results this week.`} />
        </PageLayout>
    );
};

export default FunctionPage;
