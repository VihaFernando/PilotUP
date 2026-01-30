import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ENABLE_NAVBAR_SCROLL_HIDE = false;

const Navbar = ({ showAnnouncement, scrolled, setScrolled }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Effect to handle navbar visibility based on scroll direction
    useEffect(() => {
        const simpleHandler = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);
            setIsVisible(true);
        };

        const complexHandler = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);

            if (currentScrollY < 100) {
                setIsVisible(true);
            } else {
                const scrollDifference = Math.abs(currentScrollY - lastScrollY);
                if (scrollDifference > 10) {
                    if (currentScrollY > lastScrollY + 10) {
                        setIsVisible(false);
                    } else if (currentScrollY < lastScrollY - 10) {
                        setIsVisible(true);
                    }
                }
            }
            setLastScrollY(currentScrollY);
        };

        const handler = ENABLE_NAVBAR_SCROLL_HIDE ? complexHandler : simpleHandler;
        window.addEventListener("scroll", handler, { passive: true });
        handler();
        return () => window.removeEventListener("scroll", handler);
    }, [lastScrollY, setScrolled, ENABLE_NAVBAR_SCROLL_HIDE]);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSectionClick = (sectionId) => {
        if (window.location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/', { replace: true });
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleLogoClick = () => {
        if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/', { replace: true });
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <>
            <div
                className={`
          fixed left-0 right-0 z-50
          flex justify-center px-4 pointer-events-none
          transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${scrolled || !showAnnouncement ? "top-6" : "top-[72px]"}
          ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"}
        `}
            >
                {/* --- DESKTOP NAV (LIQUID GLASS) --- */}
                <motion.nav
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`
            pointer-events-auto
            relative
            flex items-center justify-between
            w-full max-w-[680px] md:max-w-3xl
            px-3 py-2 sm:px-4 sm:py-2.5
            rounded-full
            
            /* --- LIQUID GLASS STYLES --- */
            /* 1. Blur & Saturation */
            backdrop-blur-2xl backdrop-saturate-150
            
            /* 2. Border (Slightly stronger for contrast on black) */
            border border-white/30
            
            /* 3. Background Gradient 
               Increased opacity (from-white/60 to-white/20) to ensure 
               grey text is readable even if the page background is black */
            bg-gradient-to-b from-white/60 to-white/20
            
            /* 4. Shadows (Reflection & Depth) */
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_-1px_0_0_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.05)]
            
            transition-all duration-300
          `}
                >
                    {/* --- LOGO --- */}
                    <div onClick={handleLogoClick} className="flex items-center gap-2.5 cursor-pointer group">
                        <img src="/Logo-full-black.png" alt="PilotUP Logo" className="block md:hidden h-6 object-contain" />
                        <div className="relative w-8 h-8 rounded-xl bg-black flex items-center justify-center overflow-hidden hidden md:flex">
                            <img src="/Logo-white.png" alt="PilotUP Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-[15px] font-bold text-gray-900 tracking-tight hidden xs:block">
                            PilotUP
                        </span>
                    </div>

                    {/* --- DESKTOP LINKS --- */}
                    <div className="hidden md:flex items-center gap-7">
                        <button
                            onClick={() => handleSectionClick('features')}
                            className="text-[13px] font-medium text-[var(--navbar-text-color)] hover:text-black hover:scale-105 transition-all duration-200"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => handleSectionClick('pricing')}
                            className="text-[13px] font-medium text-[var(--navbar-text-color)] hover:text-black hover:scale-105 transition-all duration-200"
                        >
                            Pricing
                        </button>
                        <button
                            onClick={() => handleSectionClick('reviews')}
                            className="text-[13px] font-medium text-[var(--navbar-text-color)] hover:text-black hover:scale-105 transition-all duration-200"
                        >
                            Reviews
                        </button>
                        <Link
                            to="/blog"
                            className="text-[13px] font-medium text-[var(--navbar-text-color)] hover:text-black hover:scale-105 transition-all duration-200"
                        >
                            Blog
                        </Link>
                    </div>

                    {/* --- ACTIONS --- */}
                    <div className="flex items-center gap-1.5">
                        {user ? (
                            <>
                                <Link
                                    to="/blog/admin"
                                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200/20 bg-white/20 text-[13px] font-semibold text-gray-700 hover:text-black hover:bg-white/50 transition-all shadow-sm"
                                >
                                    <UserCircle className="w-4 h-4" />
                                    Admin
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200/20 bg-white/20 text-[13px] font-semibold text-gray-700 hover:text-black hover:bg-white/50 transition-all shadow-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
                                className="
                  hidden md:flex items-center gap-2
                  bg-gray-900 text-white
                  px-4 py-2
                  rounded-full
                  text-[13px] font-semibold
                  shadow-[0_4px_14px_0_rgba(0,0,0,0.39)]
                  hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)]
                  transition-all duration-300
                "
                            >
                                Early Access
                                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                            </button>
                        )}
                        <button onClick={() => setOpenMenu(!openMenu)} className="block md:hidden p-2 rounded-full hover:bg-white/20 text-gray-600 transition-colors">
                            {openMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </motion.nav>
            </div>

            {/* --- MOBILE MENU (LIQUID GLASS) --- */}
            <AnimatePresence>
                {openMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="
              fixed top-24 left-4 right-4 z-40
              
              /* Mobile Glass Config */
              bg-gradient-to-b from-white/70 to-white/30
              backdrop-blur-3xl backdrop-saturate-150
              border border-white/30
              shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),0_20px_40px_-10px_rgba(0,0,0,0.1)]
              
              rounded-3xl
              p-2
              md:hidden
            "
                    >
                        <div className="flex flex-col gap-1">
                            <button onClick={() => { handleSectionClick('features'); setOpenMenu(false); }} className="px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors text-center">
                                Features
                            </button>
                            <button onClick={() => { handleSectionClick('pricing'); setOpenMenu(false); }} className="px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors text-center">
                                Pricing
                            </button>
                            <button onClick={() => { handleSectionClick('reviews'); setOpenMenu(false); }} className="px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors text-center">
                                Reviews
                            </button>
                            <Link to="/blog" onClick={() => setOpenMenu(false)} className="px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors text-center">
                                Blog
                            </Link>
                            <div className="h-px bg-gray-400/20 my-1 mx-4" />
                            {user ? (
                                <>
                                    <Link to="/blog/admin" onClick={() => setOpenMenu(false)} className="w-full px-5 py-3.5 text-[15px] font-semibold text-gray-900 hover:bg-white/30 rounded-2xl transition-colors text-center">
                                        Admin Dashboard
                                    </Link>
                                    <button onClick={() => { handleLogout(); setOpenMenu(false); }} className="w-full px-5 py-3.5 text-[15px] font-semibold text-red-600 hover:bg-red-50/50 rounded-2xl transition-colors">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => { navigate('/'); setOpenMenu(false); }} className="w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[15px] font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] active:scale-95 transition-transform">
                                    Get Early Access
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;