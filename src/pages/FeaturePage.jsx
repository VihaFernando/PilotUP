import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight, Lightbulb, ChevronRight } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FEATURES, getIconComponent } from '../data/pageData';

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
            <div className="relative bg-[#fdfffc] min-h-screen overflow-hidden">

                {/* HERO */}
                <section className="relative pt-20 sm:pt-28 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

                        {/* Breadcrumb */}
                        <motion.nav
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-1.5 mb-8 text-xs font-medium text-gray-400"
                        >
                            <Link to="/features" className="hover:text-gray-700 transition-colors">Features</Link>
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span className="text-gray-700">{feature.shortTitle}</span>
                        </motion.nav>

                        {/* Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className={`w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-2xl ${feature.lightColor} flex items-center justify-center mb-7 shadow-sm border border-black/[0.05]`}
                        >
                            {getIconComponent(feature.icon)}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
                            className="text-[2.2rem] sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-5"
                        >
                            {feature.title}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
                            className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-xl mb-9 font-medium"
                        >
                            {feature.heroSubtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto"
                        >
                            <Link
                                to="/waitlist"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gray-900 text-white text-[15px] font-semibold hover:bg-black transition-all shadow-[0_6px_20px_-6px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 active:scale-95"
                            >
                                Get Early Access <ArrowRight className="w-4 h-4 opacity-70" />
                            </Link>
                            <Link
                                to="/features"
                                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 text-[15px] font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                All Features
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Deep Explanation */}
                <section className="relative px-4 sm:px-6 pb-16 sm:pb-20 max-w-[1100px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="rounded-[2rem] bg-white border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] p-8 sm:p-12"
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">How it works</h2>
                        <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed">{feature.explanation}</p>
                    </motion.div>
                </section>

                {/* Use Cases */}
                <section className="relative px-4 sm:px-6 pb-16 sm:pb-20 max-w-[1100px] mx-auto">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-10"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Real-world use cases</h2>
                            <p className="text-base text-gray-500 font-medium">How this feature solves real problems.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            {feature.useCases.map((uc, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className="p-6 sm:p-7 rounded-[1.75rem] bg-white border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all"
                                >
                                    <div className={`w-10 h-10 rounded-lg ${feature.lightColor} flex items-center justify-center mb-4 shadow-sm border border-black/[0.04]`}>
                                        <Lightbulb className={`w-5 h-5 ${feature.textColor}`} strokeWidth={2} />
                                    </div>
                                    <h3 className="text-base font-bold text-gray-900 mb-2">{uc.title}</h3>
                                    <p className="text-[14px] text-gray-600 leading-relaxed">{uc.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* More Features */}
                <section className="relative px-4 sm:px-6 pb-20 max-w-[1100px] mx-auto">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                            className="mb-10"
                        >
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">More features</h2>
                            <p className="text-base text-gray-500 font-medium">Explore other capabilities that power PilotUP.</p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
                            {otherFeatures.map((f, i) => (
                                <motion.div
                                    key={f.slug}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                >
                                    <Link to={`/features/${f.slug}`} className="group block h-full">
                                        <div className="p-6 sm:p-7 rounded-[1.75rem] bg-white border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#E21339]/30 transition-all h-full flex flex-col">
                                            <div className={`w-10 h-10 rounded-lg ${f.lightColor} flex items-center justify-center mb-4 shadow-sm border border-black/[0.04] group-hover:shadow-md transition-all`}>
                                                {getIconComponent(f.icon)}
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[#E21339] transition-colors">{f.shortTitle}</h3>
                                            <p className="text-[14px] text-gray-600 leading-relaxed flex-1">{f.description}</p>
                                            <div className="flex items-center gap-1.5 mt-4 text-[13px] font-bold text-[#E21339] opacity-0 group-hover:opacity-100 transition-opacity">
                                                Explore <ArrowRight className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center">
                            <Link to="/features" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#E21339] hover:opacity-70 transition-opacity">
                                View all features <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            {/* CTA */}
            <WaitlistCTA heading={`Experience ${feature.shortTitle}`} subtitle="Join the waitlist and be among the first to use this feature." />
        </PageLayout>
    );
};

export default FeaturePage;
