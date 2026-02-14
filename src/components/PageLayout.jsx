import React from 'react';
import { useAnnouncement } from '../contexts/AnnouncementContext';
import Navbar from './Navbar';
import Seo, { SITE_URL } from './SEO';

import { Link } from 'react-router-dom';
import {
    Instagram, Linkedin, Youtube, ArrowUpRight, ChevronUp
} from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── BackToTop (same as App.jsx) ───
const BackToTop = () => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 320);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    if (!visible) return null;
    return (
        <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed z-50 right-4 bottom-6 sm:right-6 sm:bottom-8 p-3 sm:p-3.5 rounded-full bg-white/95 border border-gray-200 shadow-lg hover:scale-105 transition-transform duration-200"
        >
            <ChevronUp className="w-4 h-4 text-gray-900" />
        </button>
    );
};

// ─── Footer (same design as App.jsx) ───
const PageFooter = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-white/5">
            <div className="max-w-[1280px] mx-auto px-6 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">

                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2.5 mb-6 cursor-pointer group w-fit">
                            <img src="/Logo-full-white.png" alt="PilotUP Logo" className="h-8 w-auto object-contain" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
                            Build teams of AI Employees to scale your business. PilotUP automates complex tasks with autonomous AI agents that work 24/7.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: Instagram, href: 'https://www.instagram.com/thepilotup', label: 'Instagram' },
                                { Icon: Linkedin, href: 'https://www.linkedin.com/company/pilotup/', label: 'LinkedIn' },
                                { Icon: Youtube, href: 'https://www.youtube.com/@thepilotup', label: 'Youtube' },
                            ].map((s, i) => (
                                <a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200">
                                    <s.Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link></li>
                            <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link to="/roles" className="hover:text-white transition-colors">Roles</Link></li>
                        </ul>
                    </div>

                    {/* AI Employees */}
                    <div>
                        <h4 className="font-bold text-white mb-6">AI Employees</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/functions/sales" className="hover:text-white transition-colors">Sales</Link></li>
                            <li><Link to="/functions/marketing" className="hover:text-white transition-colors">Marketing</Link></li>
                            <li><Link to="/functions/support" className="hover:text-white transition-colors">Support</Link></li>
                            <li><Link to="/functions/research" className="hover:text-white transition-colors">Research</Link></li>
                            <li><Link to="/functions/operations" className="hover:text-white transition-colors">Operations</Link></li>
                            <li><Link to="/functions" className="hover:text-white transition-colors flex items-center gap-1">View All <ArrowUpRight className="w-3 h-3 opacity-50" /></Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link to="/waitlist" className="hover:text-white transition-colors">Join Waitlist</Link></li>
                            <li>
                                <a href="https://cal.com/nigeljacob/1-on-1" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    Talk to Founders <ArrowUpRight className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.youtube.com/watch?v=QnRtcMGw6d0" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                                    Watch Demo <ArrowUpRight className="w-3 h-3 opacity-50" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                            <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                            <li><a href="mailto:hello@pilotup.io" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-gray-500 text-xs">
                            © {currentYear} PilotUP Inc. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6 text-xs text-gray-500">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="mailto:hello@pilotup.io" className="hover:text-white transition-colors">hello@pilotup.io</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center select-none pointer-events-none py-2">
                <span className="font-semibold tracking-[-0.03em] leading-none inline-block bg-gradient-to-b from-[#ffffff66] via-[#ffffff33] to-transparent bg-clip-text text-transparent text-[12vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw]">
                    PilotUP.io
                </span>
            </div>
        </footer>
    );
};

// ─── NavbarWrapper (same as App.jsx) ───
const NavbarWrapper = ({ showAnnouncement = true }) => {
    const [scrolled, setScrolled] = useState(false);
    return <Navbar showAnnouncement={showAnnouncement} scrolled={scrolled} setScrolled={setScrolled} />;
};

/**
 * PageLayout — wraps every new page with Navbar + SEO + Footer + BackToTop.
 *
 * Usage:
 *   <PageLayout seo={{ title: "Pricing", description: "...", canonical: "/pricing" }}>
 *     <section>...</section>
 *   </PageLayout>
 */
const PageLayout = ({ seo = {}, children }) => {
    const { showAnnouncement } = useAnnouncement();

    return (
        <>
            <Seo
                title={seo.title}
                fullTitle={seo.fullTitle}
                description={seo.description}
                canonical={seo.canonical}
                type={seo.type || 'website'}
                schema={seo.schema || null}
                keywords={seo.keywords || null}
                twitterCard={seo.twitterCard || 'summary_large_image'}
                ogImage={seo.ogImage || `${SITE_URL}/pilotup-landing.png`}
                datePublished={seo.datePublished || '2025-12-01T00:00:00Z'}
                dateModified={seo.dateModified || new Date().toISOString()}
                robots={seo.robots}
            />
            <NavbarWrapper showAnnouncement={showAnnouncement} />
            <main className="pt-24 min-h-screen">
                {children}
            </main>
            <PageFooter />
            <BackToTop />
        </>
    );
};

export default PageLayout;
