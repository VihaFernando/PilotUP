import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Check, ChevronDown, Users, Zap, LayoutDashboard, Briefcase, Shield,
  Star, Quote, BadgeCheck, X, Plus, Minus, MessageCircle, CheckCircle2, BarChart3, Mail,
  ArrowRight, ArrowLeft, PlayCircle, ShieldCheck, Clock, BrainCircuit, Frown, Smile,
  Globe2, Sparkles, MessageSquare, TrendingUp, Instagram, Linkedin, Github, Globe, ArrowUpRight, ChevronUp, Fingerprint, Mic, LogOut, UserCircle
} from 'lucide-react';

import Lottie from "lottie-react";
import GreenRobot from "./assets/GreenRobot.json";

// Auth & Blog Imports
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnnouncementProvider, useAnnouncement } from './contexts/AnnouncementContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BlogFeed from './pages/BlogFeed';
import BlogDetail from './pages/BlogDetail';
import BlogAdmin from './pages/BlogAdmin';
import AdminInvites from './pages/AdminInvites';
import AnnouncementAdmin from './pages/AnnouncementAdmin';

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
    icon: Users,
    title: "Digital Workforce",
    subtitle: "Works Like a Human, Scales Like Software",
    description: "Why hire one by one? Deploy an entire AI team that integrates into your Slack, email, and project boards instantly.",
    colSpan: "md:col-span-2", // Bento: Wide card
    cardBg: "bg-blue-50",
    borderColor: "border-blue-100/70",
    hoverBorder: "hover:border-blue-200/80",
    hoverShadow: "hover:shadow-[0_25px_70px_-35px_rgba(37,99,235,0.45)]",
    gradient: "from-blue-400/30 to-blue-500/10",
    iconColor: "text-blue-600"
  },
  {
    icon: Zap,
    title: "10x Output",
    subtitle: "Zero Downtime",
    description: "Replace inconsistent execution with 24/7 autonomy. No coffee breaks, just results.",
    colSpan: "md:col-span-1", // Bento: Square card
    cardBg: "bg-emerald-50",
    borderColor: "border-emerald-100/70",
    hoverBorder: "hover:border-emerald-200/80",
    hoverShadow: "hover:shadow-[0_25px_70px_-35px_rgba(16,185,129,0.45)]",
    gradient: "from-emerald-400/30 to-emerald-500/10",
    iconColor: "text-emerald-600"
  },
  {
    icon: LayoutDashboard,
    title: "Self-Managing",
    subtitle: "Autonomous Responsibility",
    description: "Agents don't just wait for commands. They plan, research, and execute workflows based on your goals.",
    colSpan: "md:col-span-3", // Bento: Full width
    cardBg: "bg-rose-50",
    borderColor: "border-rose-100/70",
    hoverBorder: "hover:border-rose-200/80",
    hoverShadow: "hover:shadow-[0_25px_70px_-35px_rgba(244,63,94,0.45)]",
    gradient: "from-rose-400/30 to-rose-500/10",
    iconColor: "text-rose-600"
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
    name: "Alex Rivera",
    role: "Founder, TechFlow",
    text: "I was skeptical about 'AI employees' until I tried PilotUP. Now, my entire research department is just one agent running 24/7.",
    initial: "A",
    color: "bg-blue-100 text-blue-600"
  },
  {
    type: "review",
    name: "Sarah Chen",
    role: "Product Lead, Stripe",
    text: "The autonomy is real. I assigned a workflow to the Growth Agent, went to sleep, and woke up to a full report and drafted emails.",
    initial: "S",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    type: "review",
    name: "James Wilson",
    role: "CEO, Horizon",
    text: "It feels illegal to have this much leverage. We scaled from 10 to 100 clients without hiring a single new human operations manager.",
    initial: "J",
    color: "bg-emerald-100 text-emerald-600"
  },
  {
    type: "review",
    name: "Emily Davis",
    role: "Marketing Director",
    text: "Finally, an AI tool that doesn't feel like a toy. The 'Executive' tier allows us to manage multiple brands seamlessly.",
    initial: "E",
    color: "bg-purple-100 text-purple-600"
  },
  {
    type: "review",
    name: "Michael Chang",
    role: "Startup Founder",
    text: "The pricing is a steal. Getting an infinite workforce for the price of a SaaS subscription is the biggest no-brainer of the year.",
    initial: "M",
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



const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
              <span className="text-gray-800">Ai employees to scale your business.</span>
            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-500 text-base lg:text-lg max-w-[520px] leading-relaxed">
              Meet <span className="font-semibold text-gray-900">PilotUP</span>. Your AI team member
              that plans, executes, and reports on complex workflows — so you can focus
              on strategy, not busywork.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              {/* PRIMARY */}
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-semibold text-sm shadow-md hover:bg-red-700 transition">
                Start with PilotUP
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* SECONDARY */}
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition">
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
    <section className="relative py-16 px-6 w-full max-w-[1280px] mx-auto overflow-hidden bg-[#fdfffc]">
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
            Scaling your startup no longer means signing expensive contracts.
            <span className="text-gray-900"> PilotUP fundamentally changes your org chart.</span>
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
                border ${item.borderColor}
                transition-all duration-500 ease-out
                ${item.hoverBorder}
                ${item.hoverShadow}
              `}
            >
              {/* Hover Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10 flex flex-col h-full items-start">
                <div className={`mb-6 p-4 rounded-2xl bg-white shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-500 ${item.iconColor}`}>
                  <item.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">{item.subtitle}</p>
                <p className="text-gray-600 leading-relaxed text-[15px] sm:text-[16px] max-w-md">
                  {item.description}
                </p>
              </div>

              {/* Decorative Icon Fade in corner */}
              <item.icon className="absolute -bottom-6 -right-6 w-48 h-48 text-gray-200/50 -rotate-12 group-hover:rotate-0 transition-transform duration-700 pointer-events-none" />
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
              <div className="rounded-2xl overflow-hidden bg-black mb-5">
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
                No downtime, no distractions, just consistent execution. Reliable AI
                employees handle complex tasks so you can focus on driving your business
                forward.
              </p>
            </div>

            {/* CARD 2 */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-black mb-5 relative h-[200px]">
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/90" />
                <div className="relative z-10 h-full px-6 py-6 flex flex-col justify-evenly">
                  {logoRows.map((row, rowIdx) => (
                    <div
                      key={`row-${rowIdx}`}
                      className="logo-marquee flex items-center gap-6"
                      data-direction={rowIdx % 2 === 0 ? "normal" : "reverse"}
                    >
                      {[...row, ...row].map((logo, idx) => (
                        <img
                          key={`${logo.name}-${idx}`}
                          src={logo.src}
                          alt={logo.name}
                          className="h-10 w-auto object-contain"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-2">
                Seamless Integration
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed">
                Connect your AI employee to the tools you already use — no changes
                required. From project management to communication platforms, it fits
                right into your existing workflow and starts working immediately.
              </p>
            </div>

            {/* CARD 3 */}
            <div>
              <div className="rounded-2xl overflow-hidden bg-black mb-5">
                <img
                  src="handshake.png"
                  alt="24/7 availability"
                  className="w-full h-[200px] object-cover"
                />
              </div>

              <h4 className="font-bold text-gray-900 mb-2">
                24/7 Availability
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed">
                Always on, always working. Your AI employee operates 24/7 without
                breaks or downtime. Progress continues even when you’re offline.
              </p>
            </div>

          </div>
        </div>


      </div>
    </section>
  );
};

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
  monthly: { growth: 49, exec: 99 },
  yearly: { growth: 39, exec: 79 },
};

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-24 px-6 w-full max-w-[1280px] mx-auto overflow-hidden bg-[#fdfffc]">
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

          {/* --- APPLE-STYLE TOGGLE --- */}
          <div className="flex items-center justify-center gap-4">
            <div className="relative flex bg-gray-200 p-1 rounded-full cursor-pointer">
              <div
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                style={{ transform: isYearly ? 'translateX(100%) translateX(4px)' : 'translateX(0)' }}
              />
              <button
                onClick={() => setIsYearly(false)}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${!isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${isYearly ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Yearly <span className="text-[10px] text-emerald-600 ml-1 font-bold">-20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- PRICING GRID --- */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">

          {/* TIER 1: FREE */}
          <div className="flex flex-col p-8 rounded-[2.5rem] bg-white border border-gray-200 hover:border-gray-300 transition-colors">
            <div className="mb-6">
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider">
                Starter
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">The Freemium</h3>
            <p className="text-gray-500 text-sm mb-6 h-10">Perfect for exploring the platform and building your first agent.</p>

            <div className="text-4xl font-bold text-gray-900 mb-8">
              $0 <span className="text-lg font-medium text-gray-400">/mo</span>
            </div>

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

            <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
              Start for Free
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

            <div className="text-4xl font-bold text-white mb-8">
              ${isYearly ? PRICING.yearly.growth : PRICING.monthly.growth}
              <span className="text-lg font-medium text-gray-500">/mo</span>
            </div>

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

            <button className="w-full py-3.5 rounded-2xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all shadow-lg shadow-white/10">
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

            <div className="text-4xl font-bold text-gray-900 mb-8">
              ${isYearly ? PRICING.yearly.exec : PRICING.monthly.exec}
              <span className="text-lg font-medium text-gray-400">/mo</span>
            </div>

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

            <button className="w-full py-3.5 rounded-2xl border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all">
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
    <section id="identity" className="relative py-10 px-4 sm:px-6 bg-[#fdfffc] w-full">
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
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#F5F5F7] border border-gray-200 shadow-2xl shadow-black/5 min-h-fit md:min-h-[550px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Content */}
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left mb-8 md:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-xl sm:text-2xl shadow-sm mb-4 sm:mb-6">
                  🤖
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Real Identity. <br />
                  Real Responsibility.
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8 max-w-sm">
                  Your agent isn't a script. It gets a corporate email, a Slack account, and a secure ID. It takes ownership of tasks so you don't have to.
                </p>
                <button className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-white text-gray-900 font-semibold text-xs sm:text-sm shadow-sm border border-gray-200 hover:scale-105 transition-transform">
                  Create Identity
                </button>
              </div>

              {/* Visual */}
              <div className="w-full md:w-1/2 flex items-center justify-center relative">
                {/* Reduced width on mobile (w-[220px]) to fit screen */}
                <div className="w-[220px] sm:w-[380px] drop-shadow-2xl">
                  <Lottie animationData={GreenRobot} loop autoplay />
                </div>

                {/* Floating Badge - Scaled down on mobile */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center gap-2 sm:gap-3 border border-gray-100 scale-90 sm:scale-100 origin-bottom-left"
                >
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase">Status</div>
                    <div className="text-xs sm:text-sm font-bold text-gray-900">Online</div>
                  </div>
                </motion.div>
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
                  Fluent in <br />
                  Human & Business.
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-0 md:mb-8 max-w-sm">
                  Don't learn prompt engineering. Just talk. Call them, text them, or tag them in Slack. They understand context.
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
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left mb-12 md:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/10 text-white flex items-center justify-center mb-4 sm:mb-6">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Specialized <br />
                  Domain Expertise.
                </h3>
                <p className="text-sm sm:text-lg text-gray-400 leading-relaxed mb-6 sm:mb-8 max-w-sm">
                  Don't hire a generalist. Select an agent pre-trained for Operations, HR, or Sales. Expert-level output from Day 1.
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
              <div className="w-full md:w-1/2 relative h-[300px] sm:h-[350px] flex items-center justify-center">
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
  return (
    <section id="join" className="relative py-12 sm:py-20 lg:py-24 px-4 sm:px-6 w-full max-w-[1280px] mx-auto overflow-hidden">

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
            Limited Beta Access
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
            Be one of the first to automate your entire backend.
            Get exclusive access and <span className="text-gray-900 font-medium">priority onboarding</span>.
          </motion.p>

          {/* Premium Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative flex items-center w-full max-w-md mx-auto lg:mx-0 p-1 bg-white border border-gray-200 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] focus-within:shadow-[0_8px_30px_rgba(226,19,57,0.15)] focus-within:border-[#E21339] transition-all duration-300"
          >
            <input
              type="email"
              placeholder="Enter work email..."
              className="flex-grow px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent outline-none rounded-full min-w-0"
            />
            <button className="group flex items-center justify-center w-10 h-10 sm:w-auto sm:px-6 sm:h-12 bg-gray-900 text-white rounded-full hover:bg-black transition-all duration-300 shadow-lg shadow-gray-900/20 hover:scale-105 active:scale-95 shrink-0">
              <span className="hidden sm:block font-semibold mr-2 text-sm">Join Waitlist</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

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
                  <div className="text-2xl sm:text-4xl font-bold text-gray-900 mb-0.5 sm:mb-1">2K+</div>
                  <div className="text-[10px] sm:text-sm font-medium text-gray-500 leading-tight">Founders on waitlist</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gray-900 text-white shadow-[0_10px_30px_-10px_rgba(17,24,39,0.3)] flex flex-col justify-center h-full"
              >
                <div className="text-2xl sm:text-4xl font-bold mb-1 text-emerald-400">96%</div>
                <div className="text-[10px] sm:text-sm font-medium text-gray-400 leading-tight mb-3">Satisfaction rating</div>
                <div className="h-1 sm:h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-[96%] bg-emerald-400 rounded-full" />
                </div>
              </motion.div>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3 sm:gap-5">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-[#E21339] to-[#F0284A] text-white shadow-[0_10px_30px_-10px_rgba(226,19,57,0.3)] flex flex-col justify-center h-full"
              >
                <div className="text-2xl sm:text-4xl font-bold mb-1">48k</div>
                <div className="text-[10px] sm:text-sm font-medium text-[#fca5ac] leading-tight">Tasks automated daily</div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-white border border-gray-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex flex-col justify-center h-full"
              >
                <div className="flex -space-x-2 sm:-space-x-3 mb-2 sm:mb-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-200" />
                  ))}
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-gray-500">+200</div>
                </div>
                <div className="text-[10px] sm:text-sm font-medium text-gray-500 leading-tight">Partner startups onboarded</div>
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-bold uppercase tracking-widest text-gray-300 mb-8"
            >
              <Star className="w-4 h-4 text-[#E21339] fill-[#E21339]" />
              <span>Trusted by 5,000+ Teams</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
            >
              Real Results. <br className="hidden lg:block" />
              Real Growth.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              See how companies are automating their entire workflows with our AI employees.
              Efficiency isn't just a goal; it's the new standard.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-[#E21339] text-white font-bold text-base sm:text-lg hover:bg-[#c91032] transition-colors shadow-[0_10px_30px_-10px_rgba(226,19,57,0.4)]"
            >
              Read More
            </motion.button>
          </div>

          {/* RIGHT SIDE */}
          <div className="lg:pb-20">
            <div
              className="relative w-full max-w-xl mx-auto lg:ml-auto"
              style={{ height: (CARD_HEIGHT + GAP) * 2 + 80 }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {[0, 1, 2].map((offset) => {
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
                      key={testimonial.name}
                      layout
                      initial={{ opacity: 0, y: yPos + 60, scale: 0.9 }}
                      animate={{
                        opacity,
                        scale,
                        y: yPos,
                        zIndex,
                        filter: `blur(${blur})`,
                      }}
                      exit={{ opacity: 0, scale: 0.9, y: -40, transition: { duration: 0.4 } }}
                      transition={{
                        type: "spring",
                        stiffness: 160,
                        damping: 20,
                        mass: 1,
                      }}
                      className={`absolute left-0 right-0 p-8 rounded-3xl border backdrop-blur-md flex flex-col justify-between
                        ${offset === 0
                          ? "bg-[#18181b] border-[#E21339]/30 shadow-2xl z-30"
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
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-inner ${testimonial.color}`}
                        >
                          {testimonial.initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-bold truncate ${offset === 0 ? "text-white" : "text-gray-400"
                              }`}
                          >
                            {testimonial.name}
                          </h4>
                          <p className="text-xs text-gray-600 font-bold uppercase tracking-wide truncate">
                            {testimonial.role}
                          </p>
                        </div>

                        {offset === 0 && (
                          <div className="bg-[#E21339]/10 p-1.5 rounded-full">
                            <BadgeCheck className="w-5 h-5 text-[#E21339]" />
                          </div>
                        )}
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
                    <X className="w-5 h-5 text-[#E21339]" />
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
          className="text-3xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 lg:mb-8 leading-tight"
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
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 md:px-8 md:py-4 rounded-full bg-white text-gray-900 font-semibold text-sm md:text-base hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg w-full max-w-[200px] sm:w-auto sm:max-w-none"
          >
            Talk to Sales
          </button>

          {/* Start with PilotUP Button */}
          <button
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-2.5 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm md:text-base hover:from-rose-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full max-w-[200px] sm:w-auto sm:max-w-none group"
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
      <div className="max-w-[1280px] mx-auto px-6">

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
              {[Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
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
        <div className="mt-16 border-t border-white/10 pt-6 overflow-hidden">

          {/* COPYRIGHT */}
          <div className="text-gray-500 text-xs mb-10">
            © {currentYear} PilotUP Inc. All rights reserved.
          </div>

          {/* WATERMARK — UNDER COPYRIGHT */}
          <div className="relative left-1/2 -translate-x-1/2 w-screen flex justify-center select-none pointer-events-none">
            <span
              className="
                font-semibold
                tracking-[-0.03em]
                leading-none
                scale-[1.05]
                inline-block
                bg-gradient-to-b
                from-[#ffffff66]
                via-[#ffffff33]
                to-transparent
                bg-clip-text
                text-transparent

                /* MOBILE — very small */
                text-[14vw]

                /* TABLET */
                sm:text-[18vw]

                /* DESKTOP — EXACT SAME AS NOW */
                md:text-[16vw]
                lg:text-[14vw]
              "
            >
              PilotUP.io
            </span>

          </div>


        </div>
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

  return (
    <>
      <NavbarWrapper showAnnouncement={showAnnouncement} />
      <Hero />
      <ValueProps />
      <IdentitySection />
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

export default function App() {
  return (
    <AuthProvider>
      <AnnouncementProvider>
        <Router>
          <div className="min-h-screen bg-[#fdfffc] text-gray-900 font-sans selection:bg-red-500/20">
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

            <style jsx>{`
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