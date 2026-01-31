import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Check, ChevronDown, Users, Zap, LayoutDashboard, Briefcase, Shield,
  Star, Quote, BadgeCheck, X, Plus, Minus, MessageCircle, CheckCircle2, BarChart3, Mail,
  ArrowRight, ArrowLeft, PlayCircle, ShieldCheck, Clock, BrainCircuit, Frown, Smile,
  Globe2, Sparkles, MessageSquare, TrendingUp, Instagram, Linkedin, Github, Globe, ArrowUpRight, ChevronUp, Fingerprint, Mic, LogOut, UserCircle,
  Loader2,
  Youtube
} from 'lucide-react';

import Lottie from "lottie-react";
import GreenRobot from "./assets/GreenRobot.json";

// Auth & Blog Imports
import { AuthProvider } from './contexts/AuthContext';
import { AnnouncementProvider, useAnnouncement } from './contexts/AnnouncementContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import WaitlistBanner from './components/WaitlistBanner';
import WaitlistSuccessModal from './components/WaitlistSuccessModal';
import SEO, { SITE_URL } from './components/SEO';
import { submitToWaitlist } from './lib/loops';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BlogFeed from './pages/BlogFeed';
import BlogDetail from './pages/BlogDetail';
import BlogAdmin from './pages/BlogAdmin';
import AdminInvites from './pages/AdminInvites';
import AnnouncementAdmin from './pages/AnnouncementAdmin';
import CountdownPage from './pages/CountdownPage';
import { usePostHog } from 'posthog-js/react';
import { pageview as gtagPageview } from './gtag.js';

// Site gate: show only countdown until this date (31 Jan 2026, 3:00 PM IST = 9:30 AM UTC)
const COUNTDOWN_TARGET_DATE = new Date('2026-01-31T09:30:00.000Z');

// --- DATA CONSTANTS ---

const LOGOS = [
  { name: "Slack", src: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
  { name: "Gmail", src: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { name: "GitHub", src: "https://img.icons8.com/?size=100&id=12599&format=png&color=000000" },
  { name: "ClickUp", src: "https://img.icons8.com/?size=100&id=znqq179L1K9g&format=png&color=000000" },
  { name: "Google Meet", src: "https://img.icons8.com/?size=100&id=pE97I4t7Il9M&format=png&color=000000" },
  { name: "VS Code", src: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" },
  { name: "Notion", src: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" },
  { name: "Figma", src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
];

const CORE_VALUES = [
  {
    icon: "/turbocharge-1.png",
    image: "/woman.png",
    title: "AI Employees That Work Like Humans",
    subtitle: "",
    description: "Why hire when you can create the perfect employee? Your AI agent becomes a real member of your team, working, reporting, and delivering like a star performer at a fraction of the cost.",
    colSpan: "md:col-span-2",
    cardBg: "bg-[#E9FBFD]",
    transform: "translate-x-16",
    imageSize: "w-auto h-full",
  },
  {
    icon: "/lightning.png",
    title: "10x Output",
    subtitle: "Zero Downtime",
    description: "Replace inconsistent execution with 24/7 autonomy. No coffee breaks, just results.",
    colSpan: "md:col-span-1",
    cardBg: "bg-[#D0F4DB]",
    transform: "translate-x-0",
  },
  {
    icon: "/self.png",
    image: "/self-managing.png",
    title: "Self Managing",
    subtitle: "Autonomous Responsibility",
    description: "Agents don't just wait for commands. They plan, research, and execute workflows based on your goals.",
    colSpan: "md:col-span-3",
    cardBg: "bg-[#FFEEF2]",
    transform: "translate-x-0 -translate-y-16",
    imageSize: "w-50 h-auto",
  }
];

const FEATURES_GRID = [
  { icon: <Clock className="w-5 h-5" />, title: "24/7 Availability", desc: "Your workforce never sleeps, ensuring tasks move forward while you rest." },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Enterprise Secure", desc: "Bank-grade encryption for all data processed by your AI agents." },
  { icon: <BrainCircuit className="w-5 h-5" />, title: "Self-Learning", desc: "Agents remember feedback and get smarter with every task completed." },
  { icon: <Globe2 className="w-5 h-5" />, title: "Multilingual", desc: "Instantly translate and communicate in over 90+ languages." },
  { icon: <MessageSquare className="w-5 h-5" />, title: "Slack Integration", desc: "Chat with your agents directly where your team already works." },
  { icon: <Sparkles className="w-5 h-5" />, title: "Creative Writing", desc: "Draft blogs, emails, and social posts with human-like nuance." },
];

const FAQS = [
  {
    q: "What exactly is an AI Employee?",
    a: "An AI Employee is a fully autonomous digital worker with a name, email, Slack ID, working hours, and a defined job role. Unlike a chatbot, it proactively performs tasks, attends meetings, and delivers output without waiting for a prompt."
  },
  {
    q: "Can I talk to them like a real person?",
    a: "Yes. They communicate via Slack, email, or voice chat just like a human colleague. They understand context, nuance, and can even ask clarifying questions if a task isn't clear."
  },
  {
    q: "Can the AI employee join virtual meetings?",
    a: "Absolutely. They can join Zoom, Google Meet, or Teams calls. They listen, transcribe, take structured notes, and can even output a list of action items immediately after the call ends."
  },
  {
    q: "How much oversight do I need to provide?",
    a: "Minimal. You set the high-level goals and permissions (e.g., 'Draft tweets but don't post without approval'). The AI handles the execution. You can check their work log at any time."
  },
  {
    q: "Is my proprietary data secure?",
    a: "Yes. We use enterprise-grade encryption (SOC 2 compliant) and strictly isolate your data. We do not train our public models on your company's proprietary information."
  },
];

const TESTIMONIALS = [
  {
    type: "review",
    name: "Anonymous",
    role: "",
    text: "I know what I want to build, I just don’t know how to build every part of it.",
    initial: "",
    color: "bg-blue-100 text-blue-600"
  },
  {
    type: "review",
    name: "Anonymous",
    role: "",
    text: "Hiring help isn’t an option when you’re still validating the idea",
    initial: "S",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    type: "review",
    name: "Anonymous",
    role: "",
    text: "I’m constantly switching roles — developer, marketer, ops — and I’m mediocre at half of them.",
    initial: "",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    type: "review",
    name: "Anonymous",
    role: "",
    text: "Most tools assume you already know what you’re doing.",
    initial: "",
    color: "bg-purple-100 text-purple-600"
  },
  {
    type: "review",
    name: "Anonymous",
    role: "",
    text: "Automation sounds simple until you try setting it up yourself.",
    initial: "",
    color: "bg-amber-100 text-amber-600"
  }
];

const REVIEW_SCROLL_INTERVAL = 3600;

// --- HELPER COMPONENTS (GRID) ---

const Background = () => (
  <div className="absolute inset-0 z-0 overflow-hidden bg-[#Fdfdfd]">
    {/* 1. Subtle Mesh Gradients */}
    <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob" />
    <div className="absolute top-[10%] right-[-20%] w-[60vw] h-[70vw] bg-purple-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000" />
    <div className="absolute -bottom-20 left-[30%] w-[60vw] h-[60vw] bg-indigo-100/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 animate-blob animation-delay-4000" />

    {/* 2. Refined Dot Matrix Grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.4) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)'
      }}
    />
  </div>
);

const FloatingBadge = ({ icon: Icon, text, subtext, delay, x, y, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={`absolute z-30 flex items-center gap-3 p-2.5 pl-3 pr-5 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-xl cursor-default hover:scale-105 transition-transform duration-300 ${className}`}
    style={{ top: y, left: x }}
  >
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-white to-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50">
      <Icon className="w-4 h-4 text-gray-700" />
    </div>
    <div className="flex flex-col">
      <span className="text-[12px] font-bold text-gray-800 leading-tight">{text}</span>
      {subtext && <span className="text-[9px] font-medium text-gray-500">{subtext}</span>}
    </div>
  </motion.div>
);

// --- CORE COMPONENTS ---

const NavbarWrapper = ({ showAnnouncement = true }) => {
  const [scrolled, setScrolled] = useState(false);

  return (
    <Navbar
      showAnnouncement={showAnnouncement}
      scrolled={scrolled}
      setScrolled={setScrolled}
    />
  );
};



// Demo video – replace with your YouTube embed URL later (use /embed/ form)
const HERO_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized position (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Video modal – YouTube embed */}
      {showVideoModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="How it works video"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowVideoModal(false)}
          />
          <div className="relative z-10 w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
            <button
              type="button"
              onClick={() => setShowVideoModal(false)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={HERO_VIDEO_EMBED_URL}
              title="How it works"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 🔴 TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar />

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[calc(100dvh-40px)] flex items-center justify-center overflow-hidden pt-28 pb-20 bg-[#fdfdfd]"
      >
        <Background />

        {/* MAIN CONTAINER */}
        <div className="relative z-10 w-full max-w-[1280px] px-6 md:px-10 grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-red-600 tracking-wide">
                Introducing PilotUP 1.0
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-[2.2rem] sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] tracking-tight text-gray-900">
              Build your own, <br />
              <span className="text-gray-800">AI employees to scale your business.</span>
            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-500 text-base lg:text-lg max-w-[520px] leading-relaxed">
              Meet <span className="font-semibold text-gray-900">PilotUP. Your AI team member </span>
              that plans, executes, and reports on complex workflows — so you can focus
              on strategy, not busywork.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              {/* PRIMARY */}
              <button
                type="button"
                onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-md hover:bg-red-700 transition"
              >
                Start with PilotUP
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECONDARY – opens video modal */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
              >
                <PlayCircle className="w-4 h-4" />
                See How It Works
              </button>


            </div>
            {/* SUPPORTED APP INTEGRATIONS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-6 sm:pt-8 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]"
            >
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 text-center lg:text-left pl-1">
                Supported App Integrations
              </p>

              {/* THE FIX:
      1. 'flex' container lets children sit side-by-side.
      2. 'mask-linear-fade' (optional class) or the divs below handle the fade.
  */}
              <div className="relative w-full overflow-hidden flex select-none">

                {/* Fade Edges */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-5 bg-gradient-to-r from-[#Fdfdfd] to-transparent z-10" />
                <div className="pointer-events-none absolute top-0 right-0 h-full w-5 bg-gradient-to-l from-[#Fdfdfd] to-transparent z-10" />

                {/* SCROLL CONTAINER 1
        - shrink-0: Prevents squishing
        - w-max: width is exactly the content width (prevents gaps)
        - gap-8 / pr-8: Crucial! The padding-right MUST match the gap to join smoothly with the next set.
    */}
                <div className="flex animate-infinite-scroll shrink-0 w-max items-center gap-8 pr-8 sm:gap-10 sm:pr-10">
                  {LOGOS.map((logo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center h-5 sm:h-6 w-auto"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-full w-auto object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

                {/* SCROLL CONTAINER 2 (Duplicate)
        - Immediately follows Container 1
        - aria-hidden="true" creates a duplicate for visual continuity only
    */}
                <div
                  className="flex animate-infinite-scroll shrink-0 w-max items-center gap-8 pr-8 sm:gap-10 sm:pr-10"
                  aria-hidden="true"
                >
                  {LOGOS.map((logo, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center h-5 sm:h-6 w-auto"
                    >
                      <img
                        src={logo.src}
                        alt={logo.name}
                        className="h-full w-auto object-contain hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>


          </div>

          {/* RIGHT COLUMN: Visuals */}

          <div className="relative h-[380px] sm:h-[450px] lg:h-[600px] w-full flex items-center justify-center lg:justify-end order-2">

            {/* Main Glass Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full max-w-[300px] sm:max-w-[360px] h-[380px] sm:h-[460px] bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white/60 z-10 pb-8"
              style={{ transformStyle: 'preserve-3d' }}
            >

              {/* Inner Gradient Background for Card */}
              <div className="absolute inset-2 sm:inset-3 bg-gradient-to-b from-white/80 to-white/40 rounded-[1.5rem] overflow-hidden border border-white/50 flex flex-col items-center shadow-inner">

                {/* Hero Video with Mouse Tracking – bounded so it never touches text */}
                {/* HERO VIDEO – full width bounded frame */}
                {/* HERO VIDEO – no crop, no cut, full frame */}
                <motion.div
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full h-[310px] sm:h-[365px] overflow-hidden rounded-[1.5rem] bg-white px-1 py-3 flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 to-purple-100/40 blur-[60px]" />

                  {/* Main video – centered so top/bottom stay visible, more zoom */}
                  <video
                    src="/hero-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="relative z-10 w-full h-full object-contain object-center scale-125"
                  />

                  {/* Soft vignette for contrast */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/70" />

                  {/* Bottom fade to blend with background */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
                </motion.div>



                {/* Minimal Text inside card */}
                <div className="pt-1 sm:pt-1 mt-1 pb-3 sm:pb-5 text-center px-4 relative z-20">
                  <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">
                    Hi, I'm Jack Doe
                  </h3>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black border border-white/60 shadow-sm backdrop-blur-md">
                    <span className="text-[9px] sm:text-[10px] text-white uppercase tracking-wide">
                      A Software Engineer
                    </span>
                  </div>
                </div>


                {/* Scanning Line */}
                <motion.div
                  animate={{ top: ["5%", "95%", "5%"] }}
                  transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent w-full z-10"
                />
              </div>

              {/* --- FLOATING UI ELEMENTS --- */}
              <FloatingBadge icon={CheckCircle2} text="Task Done" subtext="Research Complete" delay={1.2} x="-8%" y="25%" className="hidden sm:flex" />
              <FloatingBadge icon={BarChart3} text="Growth" subtext="+124% Efficiency" delay={1.4} x="72%" y="30%" />
              <FloatingBadge icon={Zap} text="Action" subtext="Executing Workflow" delay={1.6} x="-5%" y="65%" />

              {/* Decorative Sphere behind */}
              <div className="absolute -z-10 top-20 -right-12 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse" />
            </motion.div>
          </div>
        </div>

      </section>
    </>
  );
};

const ValueProps = () => {
  const logoRows = [LOGOS.slice(0, 4), LOGOS.slice(4, 8)];

  return (
    <section className="relative py-10 px-6 w-full max-w-[1280px] mx-auto overflow-hidden bg-[#fdfffc]">
      <div className="relative z-10">

        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              The New Standard
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            How PilotUP
            <br className="hidden sm:block" />
            <span className="relative inline-block mx-2 sm:mx-3 z-10">
              <span
                className="relative z-10 text-5xl sm:text-6xl lg:text-7xl font-black"
                style={{
                  color: "#E21339",
                  fontFamily: "Caveat, cursive",
                  letterSpacing: "0.03em",
                  textShadow: "0 0 6px rgba(226, 19, 57, 0.35)"
                }}
              >
                Turbocharges
              </span>
            </span>
            Your Business
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Scaling your startup is no longer a headache.
            <span className="text-gray-900"> PilotUP replaces entire roles with AI workers that run your operations, marketing, and workflows—24/7.</span>
          </motion.p>
        </div>

        {/* --- BENTO GRID (Primary Value) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {CORE_VALUES.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`
                ${item.colSpan}
                group relative overflow-hidden
                ${item.cardBg}
                rounded-[2.5rem]
                p-8 sm:p-10
                transition-all duration-500 ease-out
                relative
              `}
            >

              <div className={`h-full z-10 flex flex-col ${item.image ? 'md:flex-row md:items-center md:justify-between' : ''} h-full items-start`}>

                <div className={`${item.image ? 'md:max-w-md' : ''}`}>
                  <div className={`mb-6 ${(i !== 0 && i !== 1) ? 'w-12 h-12' : 'w-20 h-20'} p-2 flex items-center justify-center rounded-xl transition-transform duration-500 ${(i !== 0 && i !== 1) && 'bg-white shadow-sm border border-gray-100'} ${item.iconColor}`}>
                    <img src={item.icon} alt={item.title} className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{item.subtitle}</p>
                  <p className="text-gray-600 leading-relaxed text-[15px] sm:text-[16px] max-w-md">
                    {item.description}
                  </p>
                </div>

                {item.image && (
                  <div className={`absolute ${item.imageSize} right-0 top-0 xl:flex justify-end hidden ${item.transform}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={`${item.imageSize} object-contain`}
                      style={{
                        maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%), linear-gradient(to left, black 85%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%), linear-gradient(to left, black 85%, transparent 100%)',
                        maskComposite: 'intersect',
                        WebkitMaskComposite: 'source-in'
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- WHY FOUNDERS LOVE PILOTUP --- */}
        <div className="max-w-7xl mx-auto px-6 py-20">

          {/* Heading */}
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Why Founders Would Love our <br className="hidden sm:block" />
              AI-Powered Platform
            </h2>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* CARD 1 */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-black mb-5 border-4 border-gray-400">
                <img
                  src="handshake.png"
                  alt="Hire experts"
                  className="w-full h-[200px] object-cover"
                />
              </div>

              <h4 className="font-bold text-gray-900 mb-2">
                Hire Experts, Pay Intern Rates
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed">
                Build your employee from the ground up, tailored exactly to your needs.
                <b>No downtime, no distractions, just consistent execution.</b> Reliable AI
                employees handle complex tasks so you can focus on driving your business
                forward.
              </p>
            </div>

            {/* CARD 2 */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-black mb-5 relative border-4 border-gray-400">
                {/* soft overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/6 via-transparent to-black/90 pointer-events-none" />

                <div className="relative z-10 h-[200px] p-4 flex flex-col justify-center gap-3">
                  {/* Row 1: use LOGOS[0..3], alternate icon + blank */}
                  <div className="w-full overflow-hidden">
                    <div className="flex items-center gap-3 w-[200%] animate-infinite-marquee" style={{ animationDuration: '28s' }}>
                      {(() => {
                        const start = 0;
                        const base = [0, 1, 2, 3].map(i => LOGOS[(start + i) % LOGOS.length]);
                        const seq = base.flatMap(l => [l, 'blank']);
                        const doubled = [...seq, ...seq];
                        return doubled.map((item, i) => (
                          <div key={i} className={item === 'blank' ? 'w-10 h-10 aspect-square flex items-center justify-center' : 'w-12 h-12 aspect-square flex items-center justify-center'}>
                            {item === 'blank' ? (
                              <div className="w-full h-full rounded-md bg-[#121212] border border-[#333]" />
                            ) : (
                              <img src={item.src} alt={item.name} className="w-9 h-9 object-contain" style={item.name === 'GitHub' ? { filter: 'invert(1)' } : undefined} />
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Row 2: use LOGOS[2..5] */}
                  <div className="w-full overflow-hidden">
                    <div className="flex items-center gap-3 w-[200%] animate-infinite-marquee-reverse" style={{ animationDuration: '32s' }}>
                      {(() => {
                        const start = 2;
                        const base = [0, 1, 2, 3].map(i => LOGOS[(start + i) % LOGOS.length]);
                        const seq = base.flatMap(l => [l, 'blank']);
                        const doubled = [...seq, ...seq];
                        return doubled.map((item, i) => (
                          <div key={i} className={item === 'blank' ? 'w-10 h-10 aspect-square flex items-center justify-center' : 'w-12 h-12 aspect-square flex items-center justify-center'}>
                            {item === 'blank' ? (
                              <div className="w-full h-full rounded-md bg-[#121212] border border-[#333]" />
                            ) : (
                              <img src={item.src} alt={item.name} className="w-9 h-9 object-contain" style={item.name === 'GitHub' ? { filter: 'invert(1)' } : undefined} />
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>

                  {/* Row 3: use LOGOS[4..7] */}
                  <div className="w-full overflow-hidden">
                    <div className="flex items-center gap-3 w-[200%] animate-infinite-marquee" style={{ animationDuration: '24s' }}>
                      {(() => {
                        const start = 4;
                        const base = [0, 1, 2, 3].map(i => LOGOS[(start + i) % LOGOS.length]);
                        const seq = base.flatMap(l => [l, 'blank']);
                        const doubled = [...seq, ...seq];
                        return doubled.map((item, i) => (
                          <div key={i} className={item === 'blank' ? 'w-10 h-10 aspect-square flex items-center justify-center' : 'w-12 h-12 aspect-square flex items-center justify-center'}>
                            {item === 'blank' ? (
                              <div className="w-full h-full rounded-md bg-[#121212] border border-[#333]" />
                            ) : (
                              <img src={item.src} alt={item.name} className="w-9 h-9 object-contain" />
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-2 text-left">
                Seamless Integration
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed text-left">
                Connect your AI employee to the tools you already use — no changes
                required. <b>From project management to communication platforms, it fits
                  right into your existing workflow and starts working immediately.</b>
              </p>
            </div>

            {/* CARD 3 */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-black mb-5 border-4 border-gray-400">
                <img
                  src="availability.png"
                  alt="24/7 availability"
                  className="w-full h-[200px] object-cover"
                />
              </div>

              <h4 className="font-bold text-gray-900 mb-2">
                24/7 Availability
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed">
                Always on, always working. Your AI employee operates 24/7 without
                breaks or downtime. <b>Progress continues even when you’re offline.</b>
              </p>
            </div>

          </div>
        </div>


      </div>
    </section>
  );
};

const FocusLead = () => (
  <section className="py-1 px-6 pt-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#020617] leading-tight tracking-tight">
        Focus on what matters while AI handles the rest. Smarter work, faster results, and less stress, it's that simple.
      </h2>
    </div>
  </section>
);

const Comparison = () => {
  return (
    <section id="features" className="py-24 bg-[#fdfffc] font-sans">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          {/* Small Pill Label */}
          <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 bg-white mb-6">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Level Up With PilotUP
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
            Them vs Us
          </h2>

          {/* Subheading */}
          <p className="text-lg text-gray-500">
            What makes us <span className="font-bold text-gray-900">different from the other AI tools</span> out there.
          </p>
        </div>

        {/* --- COMPARISON GRID --- */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">

          {/* LEFT: OTHER AI TOOLS (Light Theme) */}
          <div className="bg-[#f4f4f2] rounded-[2rem] p-8 sm:p-10 border border-gray-100/50">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Other AI Tools</h3>

            <div className="space-y-4">
              {[
                "Just a chatbot waiting for prompts",
                "Requires constant supervision",
                "Can't collaborate on third party application like a human would do",
                "Designed for executing tasks. Not for running parts of your business",
                "Feels more like a tool to use. Not teammates you can rely on.",
                "Cannot communicate across channels like phone, email or slack"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  {/* Sad Red Icon */}
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#ff3b30] flex items-center justify-center">
                      <Frown className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-[14px] font-medium text-gray-700 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: PILOTUP (Dark Theme) */}
          <div className="bg-black rounded-[2rem] p-8 sm:p-10 text-white relative overflow-hidden">
            <h3 className="text-2xl font-bold text-white text-center mb-10 relative z-10">PilotUP</h3>

            <div className="space-y-4 relative z-10">
              {[
                "AI Employees with Real Identities",
                "Manages own schedule and deadlines",
                "Works on any supported third party application just like human",
                "Works on assigned tasks by its own",
                "Proactively suggests improvements", // Replaced duplicate placeholder text
                "Seamless cross-channel communication" // Replaced duplicate placeholder text
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 bg-[#1f1f1f] p-4 rounded-xl border border-white/5">
                  {/* Happy Green Icon */}
                  <div className="shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#4cd964] flex items-center justify-center">
                      <Smile className="w-5 h-5 text-black" strokeWidth={2.5} />
                    </div>
                  </div>
                  <span className="text-[14px] font-medium text-white leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Subtle Gradient Glow at bottom for depth */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent opacity-50 pointer-events-none" />
          </div>

        </div>

      </div>
    </section>
  );
};

const PRICING = {
  monthly: { growth: 149, exec: 499 },
};
// Note: yearly display is calculated as monthly * 0.8 (20% discount) and shown as per-month billed annually.

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  // Compute displayed monthly equivalents for annual billing (20% discount)
  const growthMonthly = PRICING.monthly.growth;
  const execMonthly = PRICING.monthly.exec;
  const growthAnnualPerMonth = Math.round(growthMonthly * 0.8);
  const execAnnualPerMonth = Math.round(execMonthly * 0.8);

  return (
    <section id="pricing" className="relative py-16 px-6 w-full max-w-[1280px] mx-auto overflow-hidden bg-[#fdfffc]">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-50 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-50 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">

        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto mb-10">
            We're finalizing pricing for our beta users. <br />
            <span className="text-gray-900 font-medium">Lock in these rates early.</span>
          </p>

          {/* --- APPLE-STYLE TOGGLE (Yearly left, Monthly right) --- */}
          <div className="flex items-center justify-center gap-4">
            <div className="relative flex bg-gray-200 p-2 rounded-full cursor-pointer w-[220px] sm:w-[220px]">
              <div
                className="absolute inset-y-1 left-1 w-[calc(50%-8px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ transform: isYearly ? 'translateX(0)' : 'translateX(100%) translateX(4px)' }}
              />
              <button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Yearly <span className="inline-block align-text-top text-[10px] text-emerald-600 ml-1 font-bold">-20%</span>
              </button>
              <button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 flex-1 text-center py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${!isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* --- PRICING GRID --- */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">

          {/* TIER 1: FREE */}
          <div className="relative overflow-hidden flex flex-col p-8 rounded-[2.5rem] bg-gradient-to-br from-white to-blue-50/10 border border-gray-200/60 hover:border-blue-200 transition-colors shadow-md hover:shadow-lg ring-1 ring-transparent hover:ring-blue-50">
            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                Starter
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">The Freemium</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Perfect for exploring the platform and building your first agent. <b>Forever free.</b></p>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              $0 <span className="text-lg font-medium text-gray-400">/mo</span>
            </div>
            <div className="text-xs text-gray-500 mb-6">FREE PLAN. FREE FOREVER.</div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "50,000 credits (One-time)",
                "1 Company Profile",
                "3 Active Agents",
                "Community Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Get Early Access
            </button>
          </div>

          {/* TIER 2: GROWTH (Highlight) */}
          <div className="relative flex flex-col p-8 rounded-[2.5rem] bg-[#090909] text-white shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4">
            {/* Highlight Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#E21339] text-white text-xs font-bold tracking-wider shadow-lg">
                <Sparkles className="w-3 h-3 fill-white" /> Recommended
              </span>
            </div>

            <div className="mb-6 mt-2">
              <span className="px-3 py-1 rounded-full bg-gray-800 text-white text-xs font-bold uppercase tracking-wider">
                Growth
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Growth Squad</h3>
            <p className="text-gray-400 text-sm mb-6 h-10">For startups ready to automate serious workflows.</p>

            <div className="text-4xl font-bold text-white mb-2">
              {`$${isYearly ? growthAnnualPerMonth : growthMonthly}`}
              <span className="text-lg font-medium text-gray-500">/mo</span>
            </div>
            {isYearly && <div className="text-xs text-gray-300 mb-4">Billed annually</div>}

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "250,000 credits / mo",
                "3 Company Profiles",
                "10 Active Agents",
                "Priority Support",
                "Credit Top-Up Bundles"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-[#E21339]/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#E21339]" strokeWidth={3} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full py-3.5 rounded-2xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
            >
              Get Early Access
            </button>
          </div>

          {/* TIER 3: ENTERPRISE */}
          <div className="flex flex-col p-8 rounded-[2.5rem] bg-white border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-[#ffe5e7] text-[#E21339] border border-[#E21339]/30 text-xs font-bold uppercase tracking-wider">
                Scale
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Executive</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Full autonomy for scaling companies with heavy workloads.</p>

            <div className="text-4xl font-bold text-gray-900 mb-2">
              {`$${isYearly ? execAnnualPerMonth : execMonthly}`}
              <span className="text-lg font-medium text-gray-400">/mo</span>
            </div>
            {isYearly && <div className="text-xs text-gray-500 mb-4">Billed annually</div>}

            <ul className="space-y-4 mb-8 flex-1">
              {[
                "1,000,000 credits / mo",
                "Unlimited Companies",
                "25 Active Agents",
                "Dedicated Account Manager",
                "API Access"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-gray-900 shrink-0" strokeWidth={3} />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const IdentitySection = () => {
  return (
    <section id="identity" className="relative px-4 sm:px-6 bg-[#fdfffc] w-full">
      <div className="max-w-[1100px] mx-auto">

        <div className="text-center mb-16 sm:mb-24 px-4">
          {/* Pill Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-8"
          >
            <div className="px-3 py-1 rounded-full border border-gray-200 bg-white shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
              <span className="text-[11px] sm:text-xs text-gray-800 uppercase tracking-[0.15em]">
                What makes us stand out
              </span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#0F172A] tracking-tight leading-[1.15]"
          >
            This is not <span className="font-bold text-[#020617]">“JUST</span> <br />
            <span className="font-extrabold text-[#020617]">ANOTHER AI TOOL”</span>
          </motion.h2>
        </div>

        {/* --- STACKING CARDS CONTAINER --- */}
        <div className="flex flex-col gap-6 sm:gap-10 pb-12 sm:pb-24">

          {/* === CARD 1: IDENTITY (THE ROBOT) === */}
          {/* Mobile: sticky top-20 (80px), Desktop: top-28 (112px) */}
          <div className="sticky top-20 sm:top-28 z-10">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#F5F5F7] border border-gray-200 shadow-2xl shadow-black/5 min-h-fit md:min-h-[450px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Content */}
              <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-start text-left mb-8 md:mb-0">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  AI Employees with <br />
                  Real Identities                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8 w-full lg:max-w-sm">
                  Your agent gets a name, role, and professional email.
                  It behaves like a real team member, not a chatbot.
                  Delegate tasks just like you would to human staff.
                  Reliable, accountable, and always ready to work.
                </p>
                <button onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })} className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-gray-900 font-semibold text-xs sm:text-sm shadow-sm border border-gray-200 hover:scale-105 transition-transform">
                  Get Started
                </button>
              </div>

              {/* Visual */}
              <div className="absolute top-0 right-8 w-full md:w-1/2 items-center justify-center hidden lg:flex">
                {/* Reduced width on mobile (w-[220px]) to fit screen */}
                <div className="w-full drop-shadow-2xl">
                  <img src="/id.png" alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* === CARD 2: COMMUNICATION (CHAT UI) === */}
          <div className="sticky top-24 sm:top-32 z-20">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-white border border-gray-200 shadow-2xl shadow-black/5 min-h-fit md:min-h-[550px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Content */}
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left order-2 md:order-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 sm:mb-6">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Communicate the<br />
                  Classic Way
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-0 md:mb-8 max-w-sm">
                  Call, message, or email your AI employee anytime. It joins meetings, take notes, and handles tasks autonomously.
                  You step in only approval is needed.
                </p>
              </div>

              {/* Visual: Simulated Chat */}
              <div className="w-full md:w-1/2 mt-8 md:mt-0 order-1 md:order-2 flex justify-center mb-6 md:mb-0">
                <div className="relative w-full max-w-[360px] flex flex-col gap-3 sm:gap-4">
                  {/* Message 1 (User) */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="self-end bg-blue-600 text-white p-3 sm:p-4 rounded-2xl rounded-tr-sm shadow-lg max-w-[90%]"
                  >
                    <p className="text-xs sm:text-sm font-medium">Summarize the Q3 marketing report?</p>
                  </motion.div>

                  {/* Message 2 (AI) */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="self-start bg-gray-100 text-gray-800 p-3 sm:p-4 rounded-2xl rounded-tl-sm max-w-[90%]"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600" />
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500">PilotUP Agent</span>
                    </div>
                    <p className="text-xs sm:text-sm">On it. Analyzing Q3 data. Draft in 5 mins.</p>
                  </motion.div>

                  {/* Voice Note Visual */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="self-start flex items-center gap-2 sm:gap-3 bg-gray-100 px-3 py-2 sm:px-4 sm:py-3 rounded-full mt-1"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Mic className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                    </div>
                    <div className="flex gap-1 h-2 sm:h-3 items-center">
                      {[1, 2, 3, 4, 2, 3, 1].map((h, i) => (
                        <div key={i} className="w-0.5 sm:w-1 bg-gray-400 rounded-full animate-pulse" style={{ height: `${h * (window.innerWidth < 640 ? 3 : 4)}px` }} />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 ml-1 sm:ml-2">0:14</span>
                  </motion.div>

                </div>
              </div>

            </div>
          </div>

          {/* === CARD 3: EXPERTISE (BLACK CARD) === */}
          <div className="sticky top-28 sm:top-36 z-30">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#0A0A0A] border border-white/10 shadow-2xl shadow-black/20 min-h-fit md:min-h-[550px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

              {/* --- LEFT: TEXT CONTENT --- */}
              <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-start text-left mb-12 md:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center mb-4 sm:mb-6">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Specialized <br />
                  Domain Expertise.
                </h3>
                <p className="text-sm sm:text-lg text-gray-400 leading-relaxed mb-6 sm:mb-8 w-full lg:max-w-sm">
                  Choose from content, marketing, operations, support, and more. Each AI is trained to perform like a domain specialist.
                  Scale your operaitons with expert level output, without hiring experts.
                </p>

                <div className="flex flex-wrap gap-2">
                  {["Marketing", "Data Analysis", "HR", "Sales"].map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full border border-white/10 text-[10px] sm:text-xs text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* --- RIGHT: FLOATING CARDS VISUAL --- */}
              <div className="w-full md:w-1/2 relative h-[300px] sm:h-[350px] items-center justify-center hidden lg:flex">
                {[
                  { title: "HEAD OF GROWTH", top: "0%", left: "0%", delay: 0 },
                  { title: "SOCIAL MEDIA MANAGER", top: "35%", left: "20%", delay: 0.2 }, // Shifted right
                  { title: "DATA ANALYST", top: "70%", left: "-2%", delay: 0.4 }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: card.delay, duration: 0.6, ease: "easeOut" }}
                    className="absolute flex items-center gap-3 sm:gap-4 p-3 sm:p-4 pr-4 sm:pr-8 rounded-2xl border border-white/65 bg-[#151515]/80 backdrop-blur-md shadow-2xl"
                    style={{ top: card.top, left: card.left }}
                  >
                    {/* Icon: White circle with black check */}
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-black stroke-[3]" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-base font-bold text-white tracking-wide truncate">
                        {card.title}
                      </span>
                      <span className="text-[9px] sm:text-[11px] text-gray-400 font-medium tracking-wider uppercase">
                        Role Template
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Join = () => {
  const posthog = usePostHog()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('');
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleJoinWaitlist = async () => {
    setError(null)

    if (!isValidEmail(email)) {
      posthog?.capture('waitlist_validation_failed', { email })
      setError('Enter a valid email')
      return
    }

    setLoading(true)

    try {
      if (posthog) {
        posthog.identify(email, { email, source: 'waitlist' })
        posthog.capture('joined_waitlist', { email, location: 'landing_page' })
      }

      const sourceFromUrl = searchParams.get('source')
      const { ok, error: apiError } = await submitToWaitlist(email, sourceFromUrl)

      if (!ok) {
        setError(apiError || 'Something went wrong. Try again.')
        return
      }

      setEmail('')
      setShowSuccessModal(true)
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="join" className="relative py-12 sm:py-20 lg:py-24 px-4 sm:px-6 w-full max-w-[1280px] mx-auto overflow-hidden">
      <WaitlistSuccessModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Background Decor - Scaled for mobile */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-b from-[#ffe5e7] to-transparent rounded-full blur-[80px] sm:blur-[120px] -z-10 opacity-60" />

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

        {/* --- LEFT: CTA & FORM --- */}
        <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ffe5e7] text-[#E21339] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6"
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E21339] animate-pulse" />
            Exclusive Early Access
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-[1.1]"
          >
            Hire your first
            <br className="hidden sm:block" />{" "}
            <span className="text-transparent bg-clip-text bg-#E21339 bg-gradient-to-r from-[#E21339] to-[#F0284A]">
              AI Employee.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-lg text-gray-500 leading-relaxed max-w-md mx-auto lg:mx-0 mb-8 sm:mb-10"
          >
            Founders are already preparing to scale smarter.
            Join the waiting list and be next.
          </motion.p>

          {/* Premium Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center w-full max-w-md mx-auto lg:mx-0 p-1 rounded-full backdrop-blur-2xl backdrop-saturate-150 border border-gray-200/60 bg-gradient-to-b from-gray-200/90 to-gray-300/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.06)] focus-within:shadow-[0_8px_30px_rgba(226,19,57,0.15)] transition-all duration-300"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="flex-grow px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-full min-w-0"
            />
            <button className={`group flex items-center justify-center w-10 h-10 sm:w-auto sm:px-6 sm:h-12 bg-gray-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:scale-105 active:scale-95 shrink-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleJoinWaitlist}
              disabled={loading}
            >
              <span className="hidden sm:block font-semibold mr-2 text-sm">{loading ? 'Joining...' : 'Join Waitlist'}</span>
              {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </motion.div>


          {error && (
            <p className="mt-4 text-[10px] sm:text-xs text-[red] sm:ml-6 flex items-center justify-center lg:justify-start gap-1">
              {error}
            </p>
          )}

          <p className="mt-4 text-[10px] sm:text-xs text-gray-400 sm:ml-6 flex items-center justify-center lg:justify-start gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            No credit card required
          </p>
        </div>

        {/* --- RIGHT: STATS WIDGETS --- */}
        <div className="relative w-full max-w-[500px] mx-auto lg:ml-auto">
          {/* Decor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#ffe5e7]/50 to-[#fca5ac]/50 rounded-full blur-[60px] sm:blur-[100px] -z-10" />

          {/* Grid Layout: 2 columns on mobile (compact), offset columns on desktop */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5">

            {/* Column 1 */}
            <div className="flex flex-col gap-3 sm:gap-5 sm:mt-12">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-between h-full"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-[#ffe5e7] flex items-center justify-center mb-2 sm:mb-4 text-[#E21339]">
                  <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1 break-words whitespace-normal">Early Access</div>
                  <div className="text-xs sm:text-sm font-medium text-gray-500 leading-tight">Join the founder waitlist</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gray-900 text-white shadow-[0_10px_30px_-10px_rgba(17,24,39,0.3)] flex flex-col justify-center h-full"
              >
                <div className="text-xl sm:text-2xl font-bold mb-1 text-white break-words whitespace-normal">Enterprise Secure</div>
                <div className="text-xs sm:text-sm font-medium text-gray-400 leading-tight mb-3">Bank-grade encryption &amp; data isolation</div>
                <div className="h-1 sm:h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[20%] bg-emerald-400 rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3 sm:gap-5">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-[#E21339] to-[#F0284A] text-white shadow-[0_10px_30px_-10px_rgba(226,19,57,0.3)] flex flex-col justify-center h-full"
              >
                <div className="text-xl sm:text-2xl font-bold mb-1 break-words whitespace-normal">Automates Operations</div>
                <div className="text-xs sm:text-sm font-medium text-[#fca5ac] leading-tight">Handles repetitive work like triage, summaries &amp; updates</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-center h-full"
              >
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {LOGOS.slice(0, 5).map((logo, i) => (
                    <div key={i} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden flex-shrink-0">
                      <img src={logo.src} alt={logo.name} className="w-full h-full object-contain p-[2px]" />
                    </div>
                  ))}

                  {LOGOS.length > 5 && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-gray-700 border border-gray-200 flex-shrink-0">
                      +{LOGOS.length - 5}
                    </div>
                  )}
                </div>

                <div className="text-xs sm:text-sm font-medium text-gray-500 leading-tight break-words">Integrates with Slack, Gmail, Notion, Figma & more</div>
              </motion.div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

const CARD_HEIGHT = 200;
const GAP = 20;

const Reviews = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-20 flex justify-center w-full">
      <div className="w-[98%] lg:w-[96%] max-w-[1600px] bg-[#0A0A0A] rounded-[2.5rem] sm:rounded-[3rem] px-6 py-12 sm:px-12 sm:py-20 overflow-hidden relative border border-white/5 shadow-2xl">

        <div
          className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">

          {/* LEFT SIDE */}
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E21339]/10 text-xs sm:text-sm font-bold uppercase tracking-widest text-[#E21339] mb-8"
            >
              <span>The Problems Founders Face</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
            >
              This is what  <br className="hidden lg:block" />
              Founders Keep Telling Us
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Every founder hits the same wall when scaling.
              These are the problems no one warns you about.
            </motion.p>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:pb-20">
            <div
              className="relative w-full max-w-xl mx-auto lg:ml-auto"
              style={{ height: (CARD_HEIGHT + GAP) * 2 + 80 }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {[0, 1, 2,].map((offset) => {
                  const itemIndex = (index + offset) % TESTIMONIALS.length;
                  const testimonial = TESTIMONIALS[itemIndex];

                  let yPos = 0;
                  let opacity = 1;
                  let scale = 1;
                  let zIndex = 3 - offset;
                  let blur = "0px";

                  if (offset === 0) {
                    yPos = 0;
                  } else if (offset === 1) {
                    yPos = CARD_HEIGHT + GAP;
                    opacity = 0.8;
                  } else {
                    // NO FADE-OUT FOR LAST CARD
                    yPos = (CARD_HEIGHT + GAP) * 2;
                    opacity = 0.8;
                    scale = 1;
                    blur = "0px";
                  }

                  return (
                    <motion.div
                      key={testimonial.text}
                      layout
                      initial={{ opacity: 0, y: yPos + 60, scale: 0.9 }}
                      animate={{
                        opacity,
                        scale,
                        y: yPos,
                        zIndex,
                        filter: `blur(${blur})`,
                      }}
                      exit={{ opacity: 0, scale: 0.9, y: -40, transition: { duration: 2 } }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 20,
                        mass: 1,
                      }}
                      className={`absolute left-0 right-0 p-8 rounded-3xl border backdrop-blur-md flex flex-col justify-between
                        ${offset === 0
                          ? "bg-[#E21339] border-none shadow-2xl z-30"
                          : "bg-[#121212] border-white/5 z-10"
                        }
                      `}
                      style={{ height: CARD_HEIGHT }}
                    >
                      <div>
                        <p
                          className={`text-[15px] sm:text-[16px] leading-relaxed font-medium line-clamp-3
                          ${offset === 0 ? "text-gray-100" : "text-gray-500"}
                        `}
                        >
                          "{testimonial.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-bold truncate ${offset === 0 ? "text-white" : "text-gray-400"
                              }`}
                          >
                            {testimonial.name}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-40" />
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative py-24 px-6 w-full max-w-5xl mx-auto bg-[#fdfffc]">

      {/* --- HEADER --- */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block mb-4 px-3 py-1 rounded-md bg-[#E21339]/10 text-[#E21339] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]"
        >
          Frequently Asked Questions
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight leading-[1.1]"
        >
          Wondering About Something? <br />
          Let's Clear Things Up!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 max-w-xl mx-auto"
        >
          We’ve gathered all the important info right here.
          Explore our FAQs and find the answers you need.
        </motion.p>
      </div>

      {/* --- ACCORDION LIST --- */}
      <div className="flex flex-col gap-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <motion.div
              key={idx}
              layout
              initial={false}
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className={`relative overflow-hidden cursor-pointer group ${isOpen ? "z-10" : "z-0"
                }`}
            >
              {/* THE QUESTION CARD 
                - This stays on top (z-20)
                - When open: Black background
                - When closed: Transparent
              */}
              <motion.div
                layout
                className={`relative z-20 flex justify-between items-center gap-6 p-6 sm:p-8 rounded-[2rem] transition-colors duration-300 ${isOpen
                  ? "bg-[#0A0A0A] shadow-2xl"
                  : "bg-white/50 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
              >
                <motion.h3
                  layout="position"
                  className={`text-lg sm:text-lg font-bold leading-snug flex-1 transition-colors duration-300 ${isOpen ? "text-white" : "text-gray-900"
                    }`}
                >
                  {faq.q}
                </motion.h3>

                <div className="shrink-0 relative w-6 h-6 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 0 : 1 }}
                    className="absolute"
                  >
                    <Plus className="w-6 h-6 text-gray-400 group-hover:text-gray-900" />
                  </motion.div>
                  <motion.div
                    animate={{ rotate: isOpen ? 0 : -45, opacity: isOpen ? 1 : 0 }}
                    className="absolute"
                  >
                    <X className={`w-5 h-5 ${isOpen ? 'text-white' : 'text-[#E21339]'}`} />
                  </motion.div>
                </div>
              </motion.div>

              {/* THE ANSWER PANEL 
                - Slides out from behind the question
                - We use 'margin-top: -24px' on the container + padding-top to create the visual overlap 
                - BUT we animate the inner content to ensure smoothness 
              */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="relative z-10 overflow-hidden"
                  >
                    {/* The gray background box */}
                    <div className="bg-[#F9FAFB] rounded-b-[2rem] -mt-6 pt-10 pb-8 px-6 sm:px-8 mx-2 border-x border-b border-gray-100/50">
                      <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-gray-500 text-sm sm:text-base leading-relaxed"
                      >
                        {faq.a}
                      </motion.p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

// CTA Section - "Your next hire isn't human"
const CTASection = () => {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#fdfffc] via-pink-50/70 via-20% to-rose-300/85 py-16 md:py-24 lg:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Small Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 md:mb-6 flex justify-center"
        >
          <span className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white text-gray-600 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase shadow-sm">
            SCALE WITH AI
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight"
        >
          Your next hire<br />isn't human
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base lg:text-lg text-gray-700 mb-8 md:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
        >
          See how fast-growing businesses cut costs and<br className="hidden md:block" />
          supercharge team productivity with PilotUP.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          {/* Talk to Sales Button */}
          <button
            onClick={() => {
              window.open("https://cal.com/nigeljacob/1-on-1", "_blank");
            }}
            className="px-6 py-2.5 md:px-8 md:py-4 rounded-full bg-white text-gray-900 font-semibold text-sm md:text-base hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg w-full max-w-[200px] sm:w-auto sm:max-w-none"
          >
            Talk to Sales
          </button>

          {/* Start with PilotUP Button */}
          <button
            onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 md:px-8 md:py-4 rounded-full bg-[#E21339] text-white font-semibold text-sm md:text-base hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full max-w-[200px] sm:w-auto sm:max-w-none group"
          >
            Start with PilotUP
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-[1280px] mx-auto px-6 overflow-auto">

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">

          <div className="lg:col-span-2">
            <div
              onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2.5 mb-6 cursor-pointer group w-fit"
            >
              {/* Logo Image (Replaces blue square + SVG) */}
              <img
                src="/Logo-full-white.png"
                alt="PilotUP Logo"
                className="h-8 w-auto object-contain"
              />
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
              The AI workforce that plans, executes, and reports on complex workflows. Scale without the overhead.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {[{
                Icon: Instagram,
                href: 'https://www.instagram.com/thepilotup',
                label: 'Instagram'
              }, {
                Icon: Linkedin,
                href: 'https://www.linkedin.com/company/pilotup/',
                label: 'LinkedIn'
              }, {
                Icon: Youtube,
                href: 'https://www.youtube.com/@thepilotup',
                label: 'Youtube'
              }].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Icon.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* 2. LINKS COLUMNS */}
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#reviews" className="hover:text-blue-400 transition-colors">Customer Stories</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-1">Changelog <ArrowUpRight className="w-3 h-3 opacity-50" /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
            </ul>
          </div>

        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-16 border-t border-white/10 pt-6">
          <div className="text-gray-500 text-xs mb-10">
            © {currentYear} PilotUP Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* WATERMARK — full-width outside max-w so it isn't clipped */}
      <div className="w-full flex justify-center select-none pointer-events-none py-2">
        <span
          className="
            font-semibold
            tracking-[-0.03em]
            leading-none
            inline-block
            bg-gradient-to-b
            from-[#ffffff66]
            via-[#ffffff33]
            to-transparent
            bg-clip-text
            text-transparent
            text-[12vw]
            sm:text-[14vw]
            md:text-[12vw]
            lg:text-[11vw]
          "
        >
          PilotUP.io
        </span>
      </div>
    </footer>
  );
};

// Back-to-top floating action button
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

// Home Page Component
const HomePage = () => {
  const { showAnnouncement } = useAnnouncement();

  const softwareAppJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PilotUP',
    url: SITE_URL,
    description: 'Build your own, AI employees to scale your business. Automate workflows with an AI workforce.',
  };

  return (
    <>
      <SEO
        title="PilotUP – Build your own AI employees to scale your business"
        description="Build your own, AI employees to scale your business. PilotUP helps you automate workflows with an AI workforce."
        canonicalPath="/"
        jsonLd={softwareAppJsonLd}
      />
      <NavbarWrapper showAnnouncement={showAnnouncement} />
      <Hero />
      <ValueProps />
      <IdentitySection />
      <FocusLead />
      <Comparison />
      <Pricing />
      <Reviews />
      <Join />
      <FAQ />
      <CTASection />
      <Footer />
      <BackToTop />
    </>
  );
};

function PostHogPageView() {
  const location = useLocation()
  const posthog = usePostHog()
  useEffect(() => {
    if (posthog) {
      posthog.capture('$pageview', { path: location.pathname })
    }
  }, [location.pathname, posthog])
  return null
}

function GoogleAnalyticsPageView() {
  const location = useLocation()
  useEffect(() => {
    gtagPageview(location.pathname)
  }, [location.pathname])
  return null
}

function WaitlistScrollFromQuery() {
  const [searchParams] = useSearchParams()
  useEffect(() => {
    const waitlist = searchParams.get('waitlist') ?? searchParams.get('waitinglist')
    if (waitlist !== null) {
      const el = document.getElementById('join')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [searchParams])
  return null
}

export default function App() {
  // Restrict entire site: show countdown page until target date (skip in development)
  const isDev = import.meta.env.VITE_PUBLIC_ENVIRONMENT === 'development';
  if (!isDev && new Date() < COUNTDOWN_TARGET_DATE) {
    return <CountdownPage />;
  }

  return (
    <AuthProvider>
      <AnnouncementProvider>
        <Router>
          <div className="min-h-screen bg-[#fdfffc] text-gray-900 font-sans selection:bg-red-500/20">
            <PostHogPageView />
            <GoogleAnalyticsPageView />
            <WaitlistScrollFromQuery />
            <WaitlistBanner />
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* Blog Routes */}
              <Route path="/blog" element={<BlogFeed />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />

              {/* Protected Admin Route */}
              <Route
                path="/blog/admin"
                element={
                  <ProtectedRoute>
                    <BlogAdmin />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Invites Route */}
              <Route
                path="/admin/invites"
                element={
                  <ProtectedRoute>
                    <AdminInvites />
                  </ProtectedRoute>
                }
              />

              {/* Protected Announcement Admin Route */}
              <Route
                path="/admin/announcement"
                element={
                  <ProtectedRoute>
                    <AnnouncementAdmin />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-100% / 4)); }
              }
              .animate-marquee {
                animation: marquee 40s linear infinite;
              }
              .reviews-dot-grid {
                background-image: radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px);
                background-size: 18px 18px;
                opacity: 0.45;
                mix-blend-mode: screen;
              }
              .review-scroll-track {
                display: flex;
                flex-direction: column;
                gap: var(--review-card-gap);
                padding-top: 1.5rem;
                padding-bottom: 1.5rem;
                animation: reviewsScroll var(--review-scroll-duration) linear infinite;
              }
              .review-card {
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
              }
              .review-card-active {
                border-bottom: 1px solid rgba(255, 255, 255, 0.25);
                box-shadow: 0 30px 40px -25px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08);
                transform: scale(1.01);
              }
              .logo-marquee {
                animation: scrollLogos 20s linear infinite;
              }
              .logo-marquee[data-direction="reverse"] {
                animation-direction: reverse;
              }
              .logo-marquee img {
                filter: saturate(1.2);
              }
              @keyframes reviewsScroll {
                0% {
                  transform: translateY(0);
                }
                100% {
                  transform: translateY(calc(-1 * var(--review-cycle-height)));
                }
              }
              @keyframes scrollLogos {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
            `}</style>
          </div>
        </Router>
      </AnnouncementProvider>
    </AuthProvider>
  );
}