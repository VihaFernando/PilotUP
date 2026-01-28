import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";

// --- CONFIGURATION ---
const WAITLIST_LINK = "https://example.com/waitlist";
const WAITLIST_INITIAL_DELAY_MS = 5000; // Initial delay before showing the banner
const WAITLIST_VISIBLE_DURATION_MS = 50000; // Duration the banner stays visible (50 seconds)
const WAITLIST_HIDDEN_DURATION_MS = 90000; // Duration the banner stays hidden (1.5 minutes)
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
          // --- ANIMATION: Slide up from bottom like a sheet ---
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 30, // Smooth, heavy damping feels premium
            mass: 1
          }}
          className="
            fixed bottom-1 left-0 right-0 z-[100]
            flex justify-center
            pointer-events-none
            overflow-visible /* Ensures it looks like it's rising from the bezel */
          "
        >
          {/* --- THE BANNER (SHEET) --- */}
          <div
            style={{ backdropFilter: 'none', WebkitBackdropFilter: 'none', filter: 'none' }}
            className="
              pointer-events-auto
              w-full sm:w-[92%] max-w-4xl

              /* SHAPE: Rounded Top Only, sits flush at bottom */
              rounded-t-[24px]

              /* MATERIAL: 'Apple Frost' - High opacity for readability; no blur so content stays crisp */
              bg-white/95 dark:bg-[#121212]/95

              /* BORDERS: Top and Sides only */
              border-t border-l border-r border-black/5 dark:border-white/10

              /* SHADOW: Casting upwards */
              shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]
              dark:shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.5)]

              /* LAYOUT */
              flex flex-col sm:flex-row items-center justify-between
              px-6 py-5 sm:py-4 gap-4 sm:gap-0
            "
          >
            
            {/* --- LEFT: Brand & Value Prop --- */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* Logo Box */}
              <div className="relative shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-black/5">
                <img src="/Logo-black.svg" alt="PilotUP" className="w-10 h-10 object-contain" />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-[16px] font-bold text-gray-900 dark:text-white tracking-tight">
                    Join the PilotUP Waitlist
                  </h3>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-wide">
                    <Sparkles className="w-2.5 h-2.5" />
                    Beta
                  </span>
                </div>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium leading-snug">
                  Join early and build AI teammates that scale your operations.
                </p>
              </div>
            </div>

            {/* --- RIGHT: Actions --- */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              
              {/* Close (Secondary) */}
              <button
                onClick={handleClose}
                className="
                  px-4 py-2.5 rounded-xl
                  text-[14px] font-semibold text-gray-500 dark:text-gray-400
                  hover:bg-gray-100 dark:hover:bg-white/10
                  hover:text-gray-900 dark:hover:text-white
                  transition-colors
                "
              >
                No thanks
              </button>

              {/* CTA (Primary) - Brand Color */}
              <a
                href={WAITLIST_LINK}
                target="_blank"
                rel="noreferrer"
                onClick={handleClose}
                className="
                  group
                  relative overflow-hidden
                  flex items-center gap-2
                  px-6 py-2.5
                  rounded-xl
                  
                  /* BRAND COLOR #E21339 */
                  bg-[#E21339]
                  text-white
                  
                  text-[14px] font-bold tracking-wide
                  shadow-lg shadow-red-600/20
                  hover:bg-[#c90f30]
                  hover:shadow-red-600/30
                  hover:-translate-y-0.5
                  transition-all duration-200
                "
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 opacity-80 group-hover:translate-x-1 transition-transform" />
                
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