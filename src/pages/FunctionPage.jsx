import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ArrowUpRight, Clock, ChevronRight, Zap, Target, Wrench } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import WaitlistCTA from '../components/WaitlistCTA';
import { FUNCTIONS, INTEGRATIONS, getIconComponent } from '../data/pageData';

const FunctionPage = () => {
    const { slug } = useParams();
    const fn = FUNCTIONS.find(f => f.slug === slug);

    if (!fn) return <Navigate to="/functions" replace />;

    // Reusable Bento Card component for ultra-clean Apple glass styling
    const BentoCard = ({ children, delay = 0, className = "" }) => (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
            className={`
                relative overflow-hidden flex flex-col
                rounded-[1.75rem] sm:rounded-[2.5rem]
                bg-white/70 backdrop-blur-3xl backdrop-saturate-150
                border border-white/80
                shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_10px_40px_-10px_rgba(0,0,0,0.05)]
                p-6 sm:p-8 lg:p-10
                transition-shadow duration-500 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_20px_50px_-15px_rgba(0,0,0,0.1)]
                ${className}
            `}
        >
            {children}
        </motion.div>
    );

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
            <div className="relative bg-[#fafafa] min-h-screen overflow-hidden selection:bg-gray-200">

                {/* Ambient Apple-style Glows */}
                <div className="absolute top-0 inset-x-0 h-[800px] pointer-events-none overflow-hidden flex justify-center">
                    <div className={`absolute -top-[20%] w-[800px] h-[600px] ${fn.color} opacity-[0.35] rounded-full blur-[120px] mix-blend-multiply`} />
                    <div className="absolute top-[10%] w-[600px] h-[400px] bg-white opacity-60 rounded-full blur-[80px]" />
                </div>

                {/* HERO SECTION */}
                <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 z-10">
                    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

                        {/* Breadcrumb */}
                        <motion.nav
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                            className="flex items-center gap-2 mb-10 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-gray-200/60 shadow-sm text-xs font-semibold text-gray-500"
                        >
                            <Link to="/functions" className="hover:text-gray-900 transition-colors">Functions</Link>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-gray-900">{fn.shortTitle}</span>
                        </motion.nav>

                        {/* App-like Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className={`
                                w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] mb-8
                                ${fn.iconBg} flex items-center justify-center 
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_10px_30px_rgba(0,0,0,0.08)] 
                                border border-black/[0.04]
                            `}
                        >
                            {React.cloneElement(getIconComponent(fn.icon), { className: "w-10 h-10 sm:w-12 sm:h-12" })}
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-6"
                        >
                            {fn.title}
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}
                            className="text-[17px] sm:text-xl text-gray-500 leading-relaxed max-w-2xl mb-10 font-medium"
                        >
                            {fn.heroSubtitle}
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
                        >
                            <Link
                                to="/waitlist"
                                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white text-[15px] font-semibold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 active:scale-95"
                            >
                                Build this Employee <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/roles"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 text-[15px] font-semibold hover:border-gray-300 hover:bg-white transition-all shadow-sm active:scale-95"
                            >
                                Explore Roles
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* BENTO GRID */}
                <section className="relative px-4 sm:px-6 pb-32 max-w-[1200px] mx-auto z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">

                        {/* 1. What You Can Offload (Full Length) */}
                        <BentoCard delay={0.1} className="lg:col-span-12">
                            <div className="mb-8">
                                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> What you can offload
                                </h3>
                                <p className="text-[14px] text-gray-500 font-medium mt-1">Automate these processes completely.</p>
                            </div>
                            {/* Adjusted to 3 columns on desktop since it takes full width */}
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-auto">
                                {fn.whatYouCanOffload.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] hover:bg-white transition-all">
                                        <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full ${fn.iconBg} flex items-center justify-center`}>
                                            <CheckCircle2 className={`w-3.5 h-3.5 ${fn.textColor}`} strokeWidth={3} />
                                        </div>
                                        <span className="text-[14px] sm:text-[15px] text-gray-800 font-medium leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* 2. Day-to-Day Timeline (Side by side with Outputs) */}
                        <BentoCard delay={0.15} className="lg:col-span-7">
                            <div className="mb-8">
                                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> Day-to-day Operations
                                </h3>
                                <p className="text-[14px] text-gray-500 font-medium mt-1">How this agent runs on a typical day.</p>
                            </div>
                            <div className="flex flex-col mt-2">
                                {fn.dayToDay.map((slot, i) => (
                                    <div key={i} className="flex gap-5 sm:gap-6 group">
                                        <div className="flex flex-col items-center">
                                            {/* Pulse Ring effect on hover */}
                                            <div className="relative flex items-center justify-center">
                                                <div className={`absolute inset-0 rounded-full ${fn.iconBg} opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />
                                                <div className={`relative w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-gray-200 z-10`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full ${fn.iconBg.split(' ')[0]} ${fn.iconBg.includes('text') ? fn.iconBg.split(' ')[1].replace('text', 'bg') : ''}`} />
                                                </div>
                                            </div>
                                            {i < fn.dayToDay.length - 1 && (
                                                <div className="w-[1.5px] flex-1 bg-gradient-to-b from-gray-200 to-gray-100 my-2" />
                                            )}
                                        </div>
                                        <div className={`${i < fn.dayToDay.length - 1 ? 'pb-8' : 'pb-0'} pt-0.5`}>
                                            <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100/80 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2.5 border border-gray-200/50">
                                                {slot.time}
                                            </span>
                                            <p className="text-[15px] sm:text-[16px] text-gray-800 font-medium leading-relaxed max-w-lg">{slot.activity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* 3. Outputs (Side by side with Day-to-Day) */}
                        <BentoCard delay={0.2} className="lg:col-span-5">
                            <div className="mb-8">
                                <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Outputs you get
                                </h3>
                                <p className="text-[14px] text-gray-500 font-medium mt-1">Tangible deliverables, continuously.</p>
                            </div>
                            <div className="flex flex-col gap-2 mt-auto">
                                {fn.outputsYouGet.map((output, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white/80 transition-colors border border-transparent hover:border-gray-100">
                                        <div className={`w-8 h-8 rounded-full bg-gray-100 border border-gray-200/60 flex items-center justify-center shrink-0 shadow-sm`}>
                                            <span className={`text-[12px] font-bold text-gray-500`}>{i + 1}</span>
                                        </div>
                                        <span className="text-[14px] sm:text-[15px] text-gray-800 font-medium">{output}</span>
                                    </div>
                                ))}
                            </div>
                        </BentoCard>

                        {/* 4. Tools & Integrations (Full Length Bottom) */}
                        <BentoCard delay={0.25} className="lg:col-span-12 flex flex-col justify-between">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                                <div className="lg:max-w-xs">
                                    <h3 className="text-[12px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Wrench className="w-4 h-4" /> Tools they work in
                                    </h3>
                                    <p className="text-[14px] text-gray-500 font-medium mt-1">Plugs natively into your existing stack.</p>

                                    <Link
                                        to="/integrations"
                                        className={`hidden lg:inline-flex items-center gap-1.5 mt-6 text-[14px] font-bold ${fn.textColor} hover:opacity-70 transition-opacity w-max`}
                                    >
                                        View all integrations <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="flex flex-wrap gap-2.5 sm:gap-3 flex-1 lg:justify-end">
                                    {fn.toolsTheyWorkIn.map((toolName, i) => {
                                        const integration = INTEGRATIONS.find(ig => ig.name === toolName);
                                        return (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white/80 border border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default"
                                            >
                                                {integration ? (
                                                    <img src={integration.logo} alt={toolName} className="w-5 h-5 object-contain" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full bg-gray-100" />
                                                )}
                                                <span className="text-[14px] font-semibold text-gray-700">{toolName}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Mobile View all integrations link */}
                            <Link
                                to="/integrations"
                                className={`lg:hidden inline-flex items-center gap-1.5 mt-8 text-[14px] font-bold ${fn.textColor} hover:opacity-70 transition-opacity w-max`}
                            >
                                View all integrations <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </BentoCard>

                    </div>
                </section>
            </div>

            {/* DO NOT CHANGE THIS PART */}
            <WaitlistCTA heading={`Scale your ${fn.shortTitle.toLowerCase()} with AI`} subtitle={`Build an AI employee for ${fn.shortTitle.toLowerCase()} and start seeing results this week.`} />
        </PageLayout>
    );
};

export default FunctionPage;