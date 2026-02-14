import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight, Lightbulb } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FEATURES } from '../data/pageData';

const FeaturePage = () => {
    const { slug } = useParams();
    const feature = FEATURES.find(f => f.slug === slug);

    if (!feature) return <Navigate to="/features" replace />;

    // Get other features for "More Features" section
    const otherFeatures = FEATURES.filter(f => f.slug !== slug).slice(0, 3);

    return (
        <PageLayout seo={{
            title: feature.title,
            description: feature.heroSubtitle,
            canonical: `/features/${feature.slug}`,
            keywords: [feature.shortTitle, 'PilotUP feature', 'AI employees', feature.shortTitle.toLowerCase() + ' AI'],
            schema: [{
                '@type': 'WebPage',
                name: feature.title,
                description: feature.heroSubtitle,
                url: `https://pilotup.io/features/${feature.slug}`,
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pilotup.io/' },
                        { '@type': 'ListItem', position: 2, name: 'Features', item: 'https://pilotup.io/features' },
                        { '@type': 'ListItem', position: 3, name: feature.shortTitle, item: `https://pilotup.io/features/${feature.slug}` },
                    ]
                }
            }],
        }}>
            {/* Hero */}
            <section className="relative py-16 sm:py-24 px-6 bg-[#fdfffc]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[120px] -z-10 opacity-30" />
                <div className="max-w-4xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
                        <Link to="/features" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Features</Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-xs text-gray-600 font-medium">{feature.shortTitle}</span>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300 }} className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl shadow-lg mb-6`}>
                        {feature.icon}
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
                        {feature.title}
                    </motion.h1>

                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-gray-500 max-w-2xl leading-relaxed mb-8">
                        {feature.heroSubtitle}
                    </motion.p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-3">
                        <Link to="/waitlist" className="px-6 py-3 rounded-full bg-gray-900 text-white font-bold hover:bg-black transition-all shadow-lg flex items-center gap-2 text-sm">
                            Get Early Access <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link to="/features" className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm">
                            All Features
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Deep Explanation */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">How it works</h2>
                    <p className="text-gray-600 text-base sm:text-lg leading-relaxed">{feature.explanation}</p>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-12 sm:py-16 px-6 bg-[#F5F5F7]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Real-world use cases</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {feature.useCases.map((uc, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className={`w-10 h-10 rounded-xl ${feature.lightColor} flex items-center justify-center mb-4`}>
                                    <Lightbulb className={`w-5 h-5 ${feature.textColor}`} />
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-2">{uc.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{uc.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* More Features */}
            <section className="py-12 sm:py-16 px-6 bg-[#fdfffc]">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">More features</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {otherFeatures.map((f, i) => (
                            <Link key={f.slug} to={`/features/${f.slug}`} className="group p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 text-lg`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-[#E21339] transition-colors">{f.shortTitle}</h3>
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{f.description}</p>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <Link to="/features" className="text-sm font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1 justify-center transition-colors">
                            View all features <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <WaitlistCTA heading={`Experience ${feature.shortTitle}`} subtitle="Join the waitlist and be among the first to use this feature." />
        </PageLayout>
    );
};

export default FeaturePage;
