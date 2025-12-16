/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Ensures your imported fonts are prioritized
        sans: ['Poppins', '"Plus Jakarta Sans"', '"Google Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        // The organic moving background blobs
        blob: "blob 7s infinite",
        // The shimmering text gradient for the badge
        "glow-text-slow": "glow-text-slow 7s ease-in-out infinite",
        // (Optional) Keeps your marquee animation available if you need it
        "infinite-scroll": "infinite-scroll 20s linear infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "glow-text-slow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "-200% 50%" },
        },
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" }, // MUST be -100%
        },
      },
    },
  },
  plugins: [
    // This plugin adds the delay classes used by the blobs
    function ({ addUtilities }) {
      addUtilities({
        ".animation-delay-2000": {
          "animation-delay": "2s",
        },
        ".animation-delay-4000": {
          "animation-delay": "4s",
        },
      });
    },
  ],
};