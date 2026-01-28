import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";

// --- CONFIGURATION ---
const WAITLIST_LINK = "https://example.com/waitlist";
const WAITLIST_INITIAL_DELAY_MS = 5000;
const WAITLIST_VISIBLE_DURATION_MS = 50000;
const WAITLIST_HIDDEN_DURATION_MS = 90000;
const SESSION_KEY = "hq_waitlist_banner_dock_v1";

const WaitlistBanner = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef(null);

  const startBannerCycle = () => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        startBannerCycle();
      }, WAITLIST_VISIBLE_DURATION_MS);
    }, WAITLIST_HIDDEN_DURATION_MS);
  };

  const stopBannerCycle = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const initialTimer = setTimeout(() => {
      setVisible(true);
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
        startBannerCycle();
      }, WAITLIST_VISIBLE_DURATION_MS);
    }, WAITLIST_INITIAL_DELAY_MS);

    return () => {
      clearTimeout(initialTimer);
      stopBannerCycle();
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    stopBannerCycle();
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Join waitlist"
          // --- ANIMATION ---
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 30,
            mass: 1
          }}
          className="
            fixed bottom-1 left-0 right-0 z-[100]
            flex justify-center
            pointer-events-none
            overflow-visible
          "
        >
          {/* --- THE BANNER (SHEET) --- */}
          <div
            style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none', filter: 'none' }}
            className="
              pointer-events-auto
              relative
              w-full sm:w-[92%] max-w-4xl

              /* SHAPE: Smaller radius on mobile, larger on desktop */
              rounded-t-[16px] sm:rounded-t-[24px]

              /* MATERIAL */
              bg-white/95 dark:bg-[#121212]/95
              
              /* BORDERS */
              border-t border-l border-r border-black/5 dark:border-white/10

              /* SHADOW */
              shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]
              dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]

              /* LAYOUT */
              flex flex-col sm:flex-row items-center justify-between
              
              /* RESPONSIVE PADDING: Tight on mobile, spacious on desktop */
              px-4 py-4 sm:px-6 sm:py-5 
              gap-3 sm:gap-0
            "
          >
            
            {/* --- MOBILE ONLY: ABSOLUTE CLOSE ICON --- */}
            {/* Replaces "No thanks" text on small screens to save space */}
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-900 dark:hover:text-white sm:hidden"
            >
              <X className="w-5 h-5" />
            </button>

            {/* --- LEFT: Brand & Value Prop --- */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto pr-6 sm:pr-0">
              {/* Logo Box: Smaller on mobile */}
              <div className="relative shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center border border-black/5">
                <img src="/Logo-black.svg" alt="PilotUP" className="w-6 h-6 sm:w-10 sm:h-10 object-contain" />
              </div>

              {/* Text: Scaled down for mobile */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] sm:text-[16px] font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    Join the PilotUP Waitlist
                  </h3>
                  {/* Beta tag hidden on very small screens to save width, visible on sm+ */}
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" />
                    Beta
                  </span>
                </div>
                <p className="text-[12px] sm:text-[14px] text-gray-500 dark:text-gray-400 font-medium leading-tight sm:leading-snug mt-0.5 sm:mt-0 pr-2 sm:pr-0">
                  Join early and build AI teammates that scale your operaitons.
                </p>
              </div>
            </div>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end mt-1 sm:mt-0">
              
              {/* DESKTOP ONLY: "No thanks" Text Button */}
              <button
                onClick={handleClose}
                className="
                  hidden sm:block
                  px-4 py-2.5 rounded-xl
                  text-[14px] font-semibold text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-white/10
                  hover:text-gray-900 dark:hover:text-white
                  transition-colors
                "
              >
                No thanks
              </button>

              {/* CTA (Primary) */}
              <a
                href={WAITLIST_LINK}
                target="_blank"
                rel="noreferrer"
                onClick={handleClose}
                className="
                  group
                  relative overflow-hidden
                  flex items-center justify-center sm:justify-start gap-2
                  
                  /* Full width on mobile for easy tapping */
                  w-full sm:w-auto
                  
                  /* Compact padding on mobile */
                  px-4 py-2 sm:px-6 sm:py-2.5
                  rounded-xl
                  
                  /* BRAND COLOR #E21339 */
                  bg-[#E21339]
                  text-white
                  
                  text-[13px] sm:text-[14px] font-bold tracking-wide
                  shadow-lg shadow-red-600/20
                  hover:bg-[#c90f30]
                  hover:shadow-red-600/30
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                <span>Join Now</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
                
                {/* Shine Animation */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              </a>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WaitlistBanner;