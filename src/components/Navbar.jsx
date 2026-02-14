import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ENABLE_NAVBAR_SCROLL_HIDE = false;

// ── Dropdown data ──────────────────────
const NAV_ITEMS = [
    {
        label: 'Product',
        children: [
            { label: 'How It Works', to: '/how-it-works', desc: 'Get started in 5 steps' },
            { label: 'Integrations', to: '/integrations', desc: 'Slack, Gmail, ClickUp & more' },
            { label: 'View All Roles', to: '/roles', desc: 'Explore AI employee roles' },
        ],
    },
    {
        label: 'Features',
        to: '/features',
    },
    {
        label: 'Pricing',
        to: '/pricing',
    },
    {
        label: 'Blog',
        to: '/blog',
    },
];

// ── Desktop Dropdown Component ──────────
const DesktopDropdown = ({ item, openDropdown, setOpenDropdown }) => {
    const ref = useRef(null);
    const isOpen = openDropdown === item.label;
    const timeoutRef = useRef(null);

    const handleEnter = () => {
        clearTimeout(timeoutRef.current);
        setOpenDropdown(item.label);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
    };

    if (!item.children) {
        return (
            <Link
                to={item.to}
                className="text-[13px] font-medium text-gray-600 hover:text-black hover:scale-105 transition-all duration-200"
            >
                {item.label}
            </Link>
        );
    }

    return (
        <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
            <button
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                className="flex items-center gap-1 text-[13px] font-medium text-gray-600 hover:text-black transition-all duration-200"
            >
                {item.label}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="
                            absolute top-full left-1/2 -translate-x-1/2 mt-3
                            w-[280px] p-2
                            bg-gradient-to-b from-white/100 to-white/95
                            backdrop-blur-4xl backdrop-saturate-150
                            border border-white/40
                            rounded-2xl
                            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),inset_0_1px_0_0_rgba(255,255,255,0.6)]
                            z-50
                        "
                    >
                        {item.children.map((child, i) => (
                            <Link
                                key={i}
                                to={child.to}
                                onClick={() => setOpenDropdown(null)}
                                className="flex flex-col gap-0.5 px-4 py-3 rounded-xl hover:bg-white/60 transition-colors group"
                            >
                                <span className="text-[13px] font-semibold text-gray-900 group-hover:text-[#E21339] transition-colors">{child.label}</span>
                                {child.desc && <span className="text-[11px] text-gray-400">{child.desc}</span>}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Mobile Accordion Section ──────────
const MobileAccordion = ({ item, closeMenu }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!item.children) {
        return (
            <Link
                to={item.to}
                onClick={closeMenu}
                className="px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors text-center block"
            >
                {item.label}
            </Link>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-1 px-5 py-4 text-[15px] font-medium text-gray-600 hover:text-black hover:bg-white/30 rounded-2xl transition-colors"
            >
                {item.label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-2 space-y-1">
                            {item.children.map((child, i) => (
                                <Link
                                    key={i}
                                    to={child.to}
                                    onClick={closeMenu}
                                    className="block px-4 py-2.5 text-[14px] text-gray-500 hover:text-black hover:bg-white/30 rounded-xl transition-colors text-center"
                                >
                                    {child.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ── Main Navbar ──────────────────────
const Navbar = ({ showAnnouncement, scrolled, setScrolled }) => {
    const [openMenu, setOpenMenu] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

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

    return (
        <>
            <div
                className={`
          fixed left-0 right-0 z-50
          flex justify-center px-4 pointer-events-none
          transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${scrolled || !showAnnouncement ? "top-6" : "top-[72px] sm:top-[55px]"}
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
            backdrop-blur-2xl backdrop-saturate-150
            border border-white/30
            bg-gradient-to-b from-white/60 to-white/20
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6),inset_0_-1px_0_0_rgba(0,0,0,0.05),0_10px_40px_-10px_rgba(0,0,0,0.05)]
            
            transition-all duration-300
          `}
                >
                    {/* --- LOGO --- */}
                    <Link to="/" className="flex items-center gap-2.5 cursor-pointer group">
                        <img src="/Logo-full-black.png" alt="PilotUP Logo" className="block md:hidden h-6 object-contain" />
                        <div className="relative w-8 h-8 rounded-xl bg-black flex items-center justify-center overflow-hidden hidden md:flex">
                            <img src="/Logo-white.png" alt="PilotUP Logo" className="w-6 h-6 object-contain" />
                        </div>
                        <span className="text-[15px] font-bold text-gray-900 tracking-tight hidden xs:block">
                            PilotUP
                        </span>
                    </Link>

                    {/* --- DESKTOP LINKS --- */}
                    <div className="hidden md:flex items-center gap-6">
                        {NAV_ITEMS.map((item) => (
                            <DesktopDropdown
                                key={item.label}
                                item={item}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                            />
                        ))}
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
                            <Link
                                to="/waitlist"
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
                                Join Waitlist
                                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                            </Link>
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
                            {NAV_ITEMS.map((item) => (
                                <MobileAccordion
                                    key={item.label}
                                    item={item}
                                    closeMenu={() => setOpenMenu(false)}
                                />
                            ))}
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
                                <Link to="/waitlist" onClick={() => setOpenMenu(false)} className="w-full bg-gray-900 text-white py-3.5 rounded-2xl text-[15px] font-semibold shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] active:scale-95 transition-transform text-center block">
                                    Join Waitlist
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;