import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Menu, Check, ChevronDown, Users, Zap, LayoutDashboard, Briefcase, Shield,
  Star, Quote, BadgeCheck, X, Plus, Minus, MessageCircle, CheckCircle2, BarChart3, Mail,
  ArrowRight, ArrowLeft, PlayCircle, ShieldCheck, Clock, BrainCircuit, Frown, Smile,
  Globe2, Sparkles, MessageSquare, TrendingUp, Instagram, Linkedin, Github, Globe, ArrowUpRight, ChevronUp, Fingerprint, Mic, LogOut, UserCircle,
  Loader2,
  Youtube,
  ExternalLink,
  CheckCircle2Icon,
  Brain,
  Workflow
} from 'lucide-react';

// Auth & Blog Imports
import { AuthProvider } from './contexts/AuthContext';
import { AnnouncementProvider, useAnnouncement } from './contexts/AnnouncementContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import WaitlistBanner from './components/WaitlistBanner';
import WaitlistSuccessModal from './components/WaitlistSuccessModal';
import Seo, { SITE_URL } from './components/SEO';
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
import WaitlistPage from './pages/WaitlistPage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import IntegrationsPage from './pages/IntegrationsPage';
import RolesIndex from './pages/RolesIndex';
import RolePage from './pages/RolePage';
import FunctionsIndex from './pages/FunctionsIndex';
import FunctionPage from './pages/FunctionPage';
import FeaturesIndex from './pages/FeaturesIndex';
import FeaturePage from './pages/FeaturePage';
import { usePostHog } from 'posthog-js/react';
import { pageview as gtagPageview } from './gtag.js';

// Site gate: show only countdown until this date (31 Jan 2026, 4:00 PM IST = 10:30 AM UTC)
const COUNTDOWN_TARGET_DATE = new Date('2026-01-31T10:30:00.000Z');

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

const FUNCTION_CARDS = [
  {
    id: 'sales',
    title: 'Sales AI Employee',
    icon: TrendingUp,
    color: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
    what: 'Turns inbound and outbound activity into a predictable revenue engine, without expanding your sales team. ',
    outputs: [
      'Qualify inbound leads instantly',
      'Run personalized outbound campaingns',
      'Follow up automaically until booked',
      'Close Deals',
      'Update CRM and track pipeline',
      'Surface high-intent prospects',
    ],
    example: '"Research 50 SaaS founders in fintech, write a personalized intro email for each, and log them in HubSpot."',
    route: '/functions/sales',
  },
  {
    id: 'marketing',
    title: 'Marketing AI Employee',
    icon: Sparkles,
    color: 'bg-violet-50',
    iconBg: 'bg-violet-100 text-violet-600',
    what: 'Manage demand generation, brand positioning, and campaign performance across channels.',
    outputs: [
      'Create and launch campaigns',
      'Generate ads, emails, landing page copy',
      'Optimize funnels and conversion flows',
      'Monitor performance metrics in real time',
      'Research audience behavior and market trends',
      'Analyze competitor messaging and positioning',
      'Content calendar planning and scheduling',
      'Design posts for content',
      'SEO Optimization',
      'SEO keyword research with competitor gap analysis',
    ],
    example: '"Write 4 LinkedIn posts about our product launch next week, schedule them, and draft a launch email for our list."',
    route: '/functions/marketing',
  },
  {
    id: 'support',
    title: 'Support AI Employee',
    icon: MessageCircle,
    color: 'bg-cyan-50',
    iconBg: 'bg-cyan-100 text-cyan-600',
    what: 'Handles customer communication, issue resolution, and satisfaction management at scale.',
    outputs: [
      'Resolve tickets instantly',
      'Provide product, billing, and technical support',
      'Escalate complex issues intelligently',
      'Maintain consistent brand tone',
      'Analyze support trends and recurring issues',
      'Research solutions across documentation and history',
    ],
    example: '"Go through the 30 open tickets, draft replies for anything straightforward, and flag the rest for me."',
    route: '/functions/support',
  },
  {
    id: 'research',
    title: 'Research & Strategy AI Employee',
    icon: Globe2,
    color: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
    what: 'Continuously gathers intelligence, analyzes data, and supports strategic decision-making across the company.',
    outputs: [
      'Conduct market and competitor analysis',
      'Compile strategic briefs and reports',
      'Analyze customer feedback and trends',
      'Extract insights from internal documents',
      'Monitor industry trends',
      'Identify growth opportunities',
      'Support leadership with data-backed recommendations'
    ],
    example: '"Find 10 competitors in the AI hiring space, compare their pricing tiers, and summarize what they each do differently."',
    route: '/functions/research',
  },
  {
    id: 'operations',
    title: 'Operations AI Employee',
    icon: LayoutDashboard,
    color: 'bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
    what: 'Runs day-to-day business execution. Processes, coordination, documentation, and operational performance.',
    outputs: [
      'Coordinate tasks across teams and tools',
      'Maintain SOPs, documentation, and internal knowledge',
      'Track projects, deadlines, and follow-ups',
      'Handle vendor, logistics, and procurement coordination (where applicable)',
      'Monitor operational KPIs and flag bottlenecks early',
      'Research process improvements and cost-saving opportunities',
      'Analyze recurring operational issues and recommend fixes'
    ],
    example: '"Check all open tasks in Linear, compile a status update for the team, and flag anything overdue."',
    route: '/functions/operations',
  },
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
    className={`w-fit absolute z-30 flex items-center gap-3 p-2.5 pl-3 pr-5 bg-white/80 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-xl cursor-default hover:scale-105 transition-transform duration-300 ${className}`}
    style={{ top: y, left: x }}
  >
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-white to-gray-50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100/50">
      <Icon className="w-4 h-4 text-gray-700" />
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-bold text-gray-800 leading-tight">{text}</span>
      {subtext && <span className="w-20 text-xs font-medium text-gray-500">{subtext}</span>}
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
const HERO_VIDEO_EMBED_URL = 'https://www.youtube.com/embed/QnRtcMGw6d0';

// ── Hero role selector data ──────────────────────────────────────────
const HERO_ROLES = [
  {
    id: 'sales',
    label: 'Sales',
    image: '/roles/sales.mp4',
    name: 'Alex Rivera',
    title: 'AI Sales Lead',
    badges: [
      { icon: CheckCircle2, text: 'Deal Won', subtext: '$42k Closed' },
      { icon: BarChart3, text: 'Pipeline', subtext: '+38% Growth' },
      { icon: Zap, text: 'Follow-up', subtext: '12 Leads Queued' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    image: '/roles/marketing.mp4',
    name: 'Maya Chen',
    title: 'AI Marketing Lead',
    badges: [
      { icon: CheckCircle2, text: 'Campaign', subtext: '3 Launched Today' },
      { icon: BarChart3, text: 'Engagement', subtext: '+67% CTR' },
      { icon: Zap, text: 'SEO', subtext: 'Keywords Updated' },
    ],
  },
  {
    id: 'content',
    label: 'Content',
    image: '/roles/content.mp4',
    name: 'Jack Doe',
    title: 'AI Content Lead',
    badges: [
      { icon: CheckCircle2, text: 'Published', subtext: '3 Posts Today' },
      { icon: BarChart3, text: 'Growth', subtext: '+124% Reach' },
      { icon: Zap, text: 'Drafting', subtext: 'Newsletter Ready' },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    image: '/roles/ops.mp4',
    name: 'Sam Jordan',
    title: 'AI Ops Manager',
    badges: [
      { icon: CheckCircle2, text: 'Standup', subtext: 'Sent to #general' },
      { icon: BarChart3, text: 'Tasks', subtext: '97% On Track' },
      { icon: Zap, text: 'Blockers', subtext: '2 Flagged' },
    ],
  },
  {
    id: 'research',
    label: 'Research',
    image: '/roles/sales.mp4',
    name: 'Priya Nair',
    title: 'AI Research Lead',
    badges: [
      { icon: CheckCircle2, text: 'Brief Done', subtext: 'Market Analysis' },
      { icon: BarChart3, text: 'Sources', subtext: '47 Analyzed' },
      { icon: Zap, text: 'Insight', subtext: 'Competitor Gap Found' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    image: '/roles/support.mp4',
    name: 'Zara Kim',
    title: 'AI Support Lead',
    badges: [
      { icon: CheckCircle2, text: 'Resolved', subtext: '28 Tickets Today' },
      { icon: BarChart3, text: 'CSAT', subtext: '4.9 / 5.0' },
      { icon: Zap, text: 'Escalated', subtext: '1 to Engineering' },
    ],
  },
  {
    id: 'development',
    label: 'Development',
    image: '/roles/sales.mp4',
    name: 'Leo Park',
    title: 'AI Tech Lead',
    badges: [
      { icon: CheckCircle2, text: 'Merged', subtext: '5 PRs Today' },
      { icon: BarChart3, text: 'CI/CD', subtext: 'All Passing' },
      { icon: Zap, text: 'Sprint', subtext: '92% Velocity' },
    ],
  },
  // {
  //   id: 'data',
  //   label: 'Data',
  //   image: '/roles/data.mp4',
  //   name: 'Kai Tanaka',
  //   title: 'AI Data Analyst',
  //   badges: [
  //     { icon: CheckCircle2, text: 'Report', subtext: 'Weekly KPIs Sent' },
  //     { icon: BarChart3, text: 'Pipeline', subtext: '3 ETL Jobs Done' },
  //     { icon: Zap, text: 'Anomaly', subtext: 'Spike Detected' },
  //   ],
  // },
];

const Hero = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('sales');


  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedRole((prevRole) => {
        const roleIndex = HERO_ROLES.findIndex((role) => role.id === prevRole);
        const nextRoleIndex = (roleIndex + 1) % HERO_ROLES.length;
        return HERO_ROLES[nextRoleIndex].id;
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedRole]);


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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; playsinline"
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
        <div className="relative z-10 w-full max-w-[1280px] px-6 md:px-10 grid lg:grid-cols-2 gap-4 items-center">

          {/* LEFT CONTENT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

            {/* TITLE */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.2] tracking-tight text-gray-900">
              Build teams of <br />
              <span className="text-gray-800">AI Employees to scale your business.</span>
            </h1>

            {/* SUBTEXT */}
            <p className="text-gray-500 text-base lg:text-lg max-w-[520px] leading-relaxed">
              PilotUP saves you months of execution by letting you create AI employees
              that work together on your business goals and deliver human-quality results.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              {/* PRIMARY */}
              <button
                type="button"
                onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-md shadow-md hover:bg-red-700 transition"
              >
                Get Started. IT'S FREE
              </button>

              {/* SECONDARY – opens video modal */}
              <button
                type="button"
                onClick={() => setShowVideoModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-800 font-semibold text-sm transition"
              >
                <PlayCircle className="w-4 h-4" />
                See How It Works
              </button>


            </div>

            {/* ── ROLE SELECTOR CHIPS ── */}
            <div className="w-full max-w-[500px]">
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center lg:text-left pl-1">
                Build Your AI Employee Team in any field
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {HERO_ROLES.map((role) => {
                  const isActive = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive
                        ? 'bg-black text-white shadow-md border border-black'
                        : 'bg-white text-gray-500 border border-dashed border-gray-300 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {isActive && <Check className="w-3.5 h-3.5" />}
                      {role.label}
                    </button>
                  );
                })}
              </div>

              <Link
                to="/roles"
                className="mx-auto lg:mx-0 w-fit flex items-center gap-2 px-4 py-1 mt-6 rounded-xl bg-red-600 text-white text-sm shadow-md hover:bg-red-700 transition"
              >
                Learn More
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

            </div>
            {/* SUPPORTED APP INTEGRATIONS */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4 sm:pt-3 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px] hidden"
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

          {/* RIGHT COLUMN: Visuals – dynamic per selected role */}
          <div className="relative h-[380px] sm:h-[450px] lg:h-[600px] w-full flex items-center justify-center lg:justify-end lg:-translate-x-14 order-2">
            <AnimatePresence mode="wait">
              {HERO_ROLES.filter(r => r.id === selectedRole).map((role) => (
                <motion.div
                  key={role.id}
                  initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: -10 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative w-full max-w-[300px] sm:max-w-[360px] h-[380px] sm:h-[460px] bg-white/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white/60 z-10 pb-8"
                  style={{ transformStyle: 'preserve-3d' }}
                >

                  {/* Inner Gradient Background for Card */}
                  <div className="absolute inset-2 sm:inset-3 bg-gradient-to-b from-white/80 to-white/40 rounded-[1.5rem] overflow-hidden border border-white/50 flex flex-col items-center shadow-inner">

                    {/* Role visualization image */}
                    <motion.div
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="relative w-full h-[310px] sm:h-[365px] overflow-hidden rounded-[1.5rem] bg-white px-1 py-3 flex items-center justify-center"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 to-purple-100/40 blur-[60px]" />

                      {/* Main video */}
                      <video
                        src={role.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className={`relative z-10 w-auto h-full object-contain object-center pointer-events-none  ${(role.id === 'support' || role.id === "operations") ? 'scale-110' : 'scale-125'} ${(role.id === "marketing" || role.id === "content" || role.id === "operations") && "mt-10"}`}
                      />

                      {/* Soft vignette for contrast */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-white/70" />

                      {/* Bottom fade to blend with background */}
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white pointer-events-none z-20" />
                    </motion.div>

                    {/* Role name and title */}
                    <div className="pt-1 sm:pt-1 mt-1 pb-3 sm:pb-5 text-center px-4 relative z-20">
                      <div className="inline-flex items-center gap-1.5 mt-4 px-4 py-0.5 rounded-xl bg-black border border-white/60 shadow-sm backdrop-blur-md">
                        <span className="text-lg text-white uppercase tracking-wide">
                          {role.title}
                        </span>
                      </div>
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                      animate={{ top: ['5%', '95%', '5%'] }}
                      transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
                      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/30 to-transparent w-full z-10"
                    />
                  </div>

                  {/* --- FLOATING UI ELEMENTS (role-specific) --- */}
                  <FloatingBadge icon={role.badges[0].icon} text={role.badges[0].text} subtext={role.badges[0].subtext} delay={0.3} x="-8%" y="25%" className="hidden sm:flex" />
                  <FloatingBadge icon={role.badges[1].icon} text={role.badges[1].text} subtext={role.badges[1].subtext} delay={0.5} x="72%" y="30%" />
                  <FloatingBadge icon={role.badges[2].icon} text={role.badges[2].text} subtext={role.badges[2].subtext} delay={0.7} x="-5%" y="65%" />

                  {/* Decorative Sphere behind */}
                  <div className="absolute -z-10 top-20 -right-12 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </section>
    </>
  );
};

/* ── STACK CARD ── scroll-linked depth effect per card ── */
const StackCard = ({ card, index, totalCards }) => {
  const cardRef = useRef(null);
  const IconComp = card.icon;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start 0.2', 'end 0.2'],  // track when the card top passes 20% from viewport top
  });

  // As we scroll past this card, scale it down and fade it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const isLast = index === totalCards - 1;
  const stickyTop = 100 + index * 12; // slight offset so you see the stacked edges

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky w-full max-w-[1080px] mx-auto px-4 sm:px-6"
      style={{
        top: `${stickyTop}px`,
        zIndex: 10 + index,
        marginBottom: isLast ? 0 : '24px',
      }}
    >
      <motion.div
        style={{
          scale: isLast ? 1 : scale,
          opacity: isLast ? 1 : opacity,
          transition: "all 0.5s ease-in-out",
        }}
        className={`
          relative overflow-hidden
          rounded-[1.5rem] sm:rounded-[2.5rem] /* Tighter border radius on mobile */
          bg-white/95 backdrop-blur-2xl
          border border-gray-200/60
          p-6 sm:p-8 lg:p-12 /* Reduced padding on mobile */
          shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.5)_inset]
          transition-shadow duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]
          origin-top
        `}
      >
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 relative z-10">
          
          {/* LEFT — Identity + Description */}
          <div className="w-full">
            {/* Header with Icon */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
               <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm border border-black/[0.04]`}>
                <IconComp className="w-5 h-5 sm:w-6 h-6" strokeWidth={2} />
              </div>
               <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                {card.title}
              </h3>
            </div>
            
            <p className="text-gray-600 leading-relaxed text-[15px] sm:text-[17px] lg:text-lg mb-6 sm:mb-8 max-w-3xl">
              {card.what}
            </p>

            {/* Outputs */}
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">
              Capabilities & Outputs
            </p>
            <div className="flex items-center flex-wrap gap-2 sm:gap-2.5 mb-8 sm:mb-10">
              {card.outputs.map((o, j) => (
                <div 
                  key={j} 
                  className="bg-gray-50/80 border border-gray-200/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[12px] sm:text-[14px] font-medium text-gray-700 leading-snug shadow-sm"
                >
                  {o}
                </div>
              ))}
            </div>

            {/* Micro-CTA */}
            <Link
              to={card.route}
              className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gray-900 text-white rounded-full text-[13px] sm:text-[14px] font-semibold hover:bg-black transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:scale-95"
            >
              Build this AI Employee
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Optional Subtle Background Decoration based on card color */}
        <div className={`absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-64 h-64 sm:w-96 sm:h-96 ${card.color} rounded-full blur-[80px] sm:blur-[100px] opacity-40 pointer-events-none`} />

      </motion.div>
    </motion.div>
  );
};

const FunctionCardStack = () => (
  <section className="relative py-16 sm:py-24 w-full max-w-[1280px] mx-auto overflow-hidden">
    <div className="text-center mb-12 sm:mb-16 px-4">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 tracking-tight">
        Meet your new workforce
      </h2>
      <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">
        Deploy specialized AI agents that execute complex workflows autonomously across your entire organization.
      </p>
    </div>

    <div className="relative mb-16 sm:mb-24">
      {FUNCTION_CARDS.map((card, i) => (
        <StackCard key={card.id} card={card} index={i} totalCards={FUNCTION_CARDS.length} />
      ))}
    </div>
  </section>
);

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
            <span className="text-gray-900"> PilotUP replaces entire roles with AI employees that run your sales, marketing, and operations — 24/7.</span>
          </motion.p>
        </div>

        {/* --- FUNCTION CARDS — SCROLL STACK --- */}
        <FunctionCardStack />

        {/* --- WHY FOUNDERS LOVE PILOTUP --- */}
        <div className="max-w-7xl mx-auto px-6 py-4">

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
                AI Employees work around the clock
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

const INTEGRATION_LOGOS = [
  // Row 1 — 5 logos
  { name: 'Google Docs', src: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg' },
  { name: 'Google Sheets', src: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg' },
  { name: 'Google Calendar', src: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg' },
  { name: 'Slack', src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
  { name: 'Google', src: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' },
  // Row 2 — 4 logos (offset)
  { name: 'LinkedIn', src: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
  { name: 'Telegram', src: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' },
  { name: 'Notion', src: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png' },
  { name: 'Figma', src: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
  // Row 3 — 4 logos (offset other way)
  { name: 'GitHub', src: 'https://img.icons8.com/?size=100&id=12599&format=png&color=000000' },
  { name: 'Discord', src: 'https://img.icons8.com/?size=100&id=30998&format=png&color=000000' },
  { name: 'YouTube', src: 'https://img.icons8.com/?size=100&id=19318&format=png&color=000000' },
  { name: 'Trello', src: 'https://img.icons8.com/?size=100&id=21049&format=png&color=000000' },
  // Row 4 — 5 logos
  { name: 'ClickUp', src: 'https://img.icons8.com/?size=100&id=znqq179L1K9g&format=png&color=000000' },
  { name: 'Zoho', src: 'https://img.icons8.com/?size=100&id=N14VKELiROlj&format=png&color=000000' },
  { name: 'Salesforce', src: 'https://img.icons8.com/?size=100&id=YU03kFhd5JYs&format=png&color=000000' },
  { name: 'HubSpot', src: 'https://img.icons8.com/?size=100&id=y3VVdMBJloCR&format=png&color=000000' },
  { name: 'Gmail', src: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg' },
  // Row 5 — 3 logos
  { name: 'Google Meet', src: 'https://img.icons8.com/?size=100&id=pE97I4t7Il9M&format=png&color=000000' },
  { name: 'WhatsApp', src: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
];

const INTEGRATION_ROWS = [
  [0, 1, 2, 3, 4],         // 5 logos
  [5, 6, 7, 8],            // 4 logos (offset)
  [9, 10, 11, 12],         // 4 logos
  [13, 14, 15, 16, 17],    // 5 logos
  [18, 19],                // 2 logos
];

const Integrations = () => (
  <section className="py-16 bg-[#fdfffc]">
    <div className="max-w-[1100px] mx-auto px-6">

      {/* Header */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Integrations
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          Connects with all your{' '}
          <br className="hidden sm:block" />
          favorite apps
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Your AI Employees get their very own workspace. They join the
          tools you already use
          <span className="text-gray-900"> and get to work right where your team operates.</span>
        </motion.p>
      </div>

      {/* CTA */}
      <div className="text-center mb-16">
        <Link
          to="/integrations"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#DB2627] text-white font-semibold text-sm transition"
        >
          Learn more about integrations
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>


      {/* Hub-and-Spoke Integration Visual */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mb-10 bg-[#FAFAFA] rounded-xl hidden lg:flex"
      >
        {/* Wide landscape container */}
        <div className="relative w-full mx-auto" style={{ paddingBottom: '45%' }}>

          {/* SVG connector lines with draw animation */}
          <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 450" fill="none" preserveAspectRatio="xMidYMid meet">
            {(() => {
              const cx = 500, cy = 225;
              const spoke = INTEGRATION_LOGOS.slice(0, 10);
              return spoke.map((logo, i) => {
                const angle = (i / spoke.length) * 2 * Math.PI - Math.PI / 2;
                const rx = 380, ry = 160;
                const ex = cx + rx * Math.cos(angle);
                const ey = cy + ry * Math.sin(angle);
                const len = Math.sqrt((ex - cx) ** 2 + (ey - cy) ** 2);
                return (
                  <motion.line
                    key={logo.name}
                    x1={cx} y1={cy} x2={ex} y2={ey}
                    stroke="#E7E7E7"
                    strokeWidth="2"
                    initial={{ strokeDasharray: len, strokeDashoffset: len }}
                    whileInView={{ strokeDashoffset: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.06, ease: 'easeOut' }}
                  />
                );
              });
            })()}
          </svg>

          {/* Center Hub — PilotUP Logo with pulse ring */}
          <div
            className="absolute z-20 flex items-center justify-center"
            style={{
              width: '80px', height: '80px',
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute w-[110%] h-[110%] rounded-full border border-gray-200"
              animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
              className="w-full h-full rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center"
            >
              <img
                src="/Logo-black.svg"
                alt="PilotUP"
                className="w-9 h-9 object-contain"
              />
            </motion.div>
          </div>

          {/* Orbiting logos — staggered entrance + floating */}
          {INTEGRATION_LOGOS.slice(0, 10).map((logo, i) => {
            const total = 10;
            const angle = (i / total) * 360 - 90;
            const radians = (angle * Math.PI) / 180;
            const radiusX = 38;  // wider horizontal spread (%)
            const radiusY = 35.5; // tighter vertical
            const left = 50 + radiusX * Math.cos(radians) - 2.5;
            const top = 50 + radiusY * Math.sin(radians) - 5;
            const floatDuration = 3 + (i % 3) * 0.5; // stagger float speeds

            return (
              <motion.div
                key={logo.name}
                className="absolute z-10"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                title={logo.name}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: floatDuration, repeat: Infinity, ease: 'easeInOut' }}
                  className="flex items-center justify-center"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:scale-110 hover:shadow-lg transition-all duration-300">
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  </section>
);

const FocusLead = () => (
  <section className="py-1 px-6 pt-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#020617] leading-tight tracking-tight">
        Focus on what matters while AI handles the rest. Smarter work, faster results, and less stress, it's that simple.
      </h2>
    </div>
  </section>
);

/* ── HOW IT WORKS ── */
const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Choose a Role',
    desc: 'Pick the function you need help with — Sales, Marketing, Support, Research, or Operations. Each AI Employee comes pre-loaded with the skills and context for that role.',
    details: [
      'Select from ready-made role templates',
      'Or create a custom role from scratch',
      'Set goals, tone of voice, and boundaries',
    ],
    icon: Users,
    color: 'bg-emerald-50',
    accentColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
  },
  {
    num: '02',
    title: 'Define the Brief',
    desc: 'Tell your AI Employee what to do in plain language — just like briefing a real teammate. Attach context, link tools, and set deadlines.',
    details: [
      'Write tasks in natural language',
      'Attach files, links, or reference docs',
      'Set priority levels and deadlines',
    ],
    icon: Briefcase,
    color: 'bg-violet-50',
    accentColor: 'text-violet-600',
    borderColor: 'border-violet-200',
  },
  {
    num: '03',
    title: 'Your AI Employee Gets to Work',
    desc: 'Your AI Employee plans the execution, breaks down the task, and starts delivering. It works inside your connected tools — Slack, Gmail, Notion, HubSpot — not a separate dashboard.',
    details: [
      'Autonomous planning and task breakdown',
      'Works directly inside your existing tools',
      'Real-time progress updates in Slack or email',
    ],
    icon: Zap,
    color: 'bg-cyan-50',
    accentColor: 'text-cyan-600',
    borderColor: 'border-cyan-200',
  },
  {
    num: '04',
    title: 'Review & Approve',
    desc: 'Your AI Employee sends you the finished work for review. Approve it, request changes, or give feedback — just like working with a human teammate.',
    details: [
      'Get notifications when deliverables are ready',
      'Request revisions with inline comments',
      'AI Employee learns from your feedback over time',
    ],
    icon: CheckCircle2,
    color: 'bg-blue-50',
    accentColor: 'text-blue-600',
    borderColor: 'border-blue-200',
  },
  {
    num: '05',
    title: 'Scale Your Team',
    desc: 'Once one AI Employee is running smoothly, add more. Build a full team of AI Employees across every function — each one working 24/7, costing a fraction of a hire.',
    details: [
      'Add AI Employees for new functions in minutes',
      'AI Employees collaborate with each other',
      'Pay only for what you use — no salaries, no overhead',
    ],
    icon: LayoutDashboard,
    color: 'bg-amber-50',
    accentColor: 'text-amber-600',
    borderColor: 'border-amber-200',
  },
];

const HowItWorksStep = ({ step, index, total }) => {
  const ref = useRef(null);
  const IconComp = step.icon;
  const isLast = index === total - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.3'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <div ref={ref} className="relative flex gap-6 sm:gap-10">

      {/* Timeline spine */}
      <div className="hidden sm:flex flex-col items-center pt-1">
        {/* Number dot */}
        <div className={`w-12 h-12 rounded-full ${step.color} border-2 ${step.borderColor} flex items-center justify-center text-sm font-bold ${step.accentColor} shrink-0 z-10 bg-white`}>
          {step.num}
        </div>
        {/* Connector line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-gray-200 to-gray-100 mt-2" />
        )}
      </div>

      {/* Card */}
      <motion.div
        style={{ y, opacity, scale }}
        className={`flex-1 ${step.color} rounded-[2rem] p-8 sm:p-10 mb-8 border ${step.borderColor} origin-top`}
      >
        <div className="flex flex-col lg:flex-row lg:gap-10">

          {/* Left — title + description */}
          <div className="lg:w-3/5 mb-6 lg:mb-0">
            <div className={`sm:hidden mb-3 w-9 h-9 rounded-full ${step.color} border ${step.borderColor} flex items-center justify-center text-xs font-bold ${step.accentColor}`}>
              {step.num}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed text-[15px] sm:text-base">{step.desc}</p>
          </div>

          {/* Right — detail bullets */}
          <div className="lg:w-2/5">
            <ul className="space-y-3">
              {step.details.map((d, j) => (
                <li key={j} className="flex items-start gap-2.5 text-[14px] text-gray-700 leading-snug">
                  <CheckCircle2Icon className='fill-black text-white' />
                  {d}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export const HowItWorks = () => (
  <section className="py-24 bg-[#fdfffc]">
    <div className="max-w-[1000px] mx-auto px-6">

      {/* Header */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-900" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            How It Works
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
        >
          Scale your business{' '}
          <br className="hidden sm:block" />
          in five steps
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
        >
          A few steps away from a smarter business.
        </motion.p>
      </div>

      {/* Steps */}
      <div className="relative">
        {HOW_IT_WORKS_STEPS.map((step, i) => (
          <HowItWorksStep key={step.num} step={step} index={i} total={HOW_IT_WORKS_STEPS.length} />
        ))}
      </div>

    </div>
  </section>
);

/* ── WHY PILOTUP — deep value props ── */
const ROTATING_WORDS = ['Sales', 'Marketing', 'Support', 'Research', 'Operations', 'Development'];

const ROLE_FAN_CARDS = [
  { name: 'Sales Rep.', person: 'Alex Rivera', image: '/roles/sales.png' },
  { name: 'Marketing Lead', person: 'Maya Chen', image: '/roles/marketing.png' },
  { name: 'Research Analyst', person: 'Priya Nair', image: '/roles/research.png' },
  { name: 'Support Agent', person: 'Zara Kim', image: '/roles/support.png' },
  { name: 'Tech Lead', person: 'Leo Park', image: '/roles/development.png' },
  { name: 'Data Analyst', person: 'Kai Tanaka', image: '/roles/data.png' },
];

const VALUE_PROPS_DEEP = [
  {
    icon: Users,
    title: 'Build an entire team of AI Employees',
    desc: 'Build AI Employees that can handle any use case, across any industry',
  },
  {
    icon: Briefcase,
    title: 'Built for all business tasks',
    desc: 'Your AI Employees does everything from A - Z to ensure your business runs towards success. ',
  },
  {
    icon: Brain,
    title: 'Human-quality output',
    desc: 'Your AI Employee matches your tone of voice, and improves with every task.',
  },
  {
    icon: Workflow,
    title: 'Collaborates with the team',
    desc: 'Your AI Employees work together on certain tasks collaboratively.',
  },
  {
    icon: BarChart3,
    title: 'Built for any Business',
    desc: 'AI Employees can handle any workflows from a new startup to an enterprice level.',
  },
  {
    icon: Zap,
    title: 'Results from day one',
    desc: 'Your AI Employee starts delivering on its first assignment, and keeps going 24/7 without breaks.',
  },
];

const WhyPilotUP = () => {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2300);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-28 bg-[#fdfffc] overflow-hidden">
      <div className="max-w-[1100px] mx-auto px-6">

        {/* ── Heading with rotating word ── */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5"
          >
            Scale your{' '}
            <span className="relative inline-flex overflow-hidden align-baseline h-[1.2em]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={ROTATING_WORDS[wordIdx]}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="inline-block text-[#DB2627]"
                >
                  {ROTATING_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            and watch your business grow towards success
          </motion.p>
        </div>

        {/* ── 3×2 Value Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-12 mb-16">
          {VALUE_PROPS_DEEP.map((prop, i) => {
            const IconComp = prop.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: 0.08 * i, duration: 0.45 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <IconComp className="w-5 h-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{prop.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{prop.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Dual CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/signup"
            className="px-7 py-3.5 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition shadow-sm"
          >
            Get Started &mdash; It's Free
          </Link>
          <div
            onClick={() => window.open("https://www.youtube.com/watch?v=QnRtcMGw6d0", '_blank')}
            className="px-7 py-3.5 rounded-xl bg-white border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-50 transition"
          >
            See how it works
          </div>
        </motion.div>

      </div>
    </section>
  );
};

const Comparison = () => {
  return (
    <section className="py-24 bg-[#fdfffc] font-sans">
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
            Plans that scale with you
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
    <section id="features" className="relative px-4 sm:px-6 bg-[#fdfffc] w-full mt-10">
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
            PilotUP is not <span className="font-bold text-[#020617]">“JUST</span> <br />
            <span className="font-extrabold text-[#020617]">ANOTHER AI TOOL”</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-0 md:mb-8 max-w-2xl mt-4 mx-auto"
          >
            It is a platform that allows you to create AI employees that works 24/7 & handles different tasks.
            It is like having a full-on team where no-one never sleeps.
          </motion.p>
        </div>

        {/* --- STACKING CARDS CONTAINER --- */}
        <div className="flex flex-col gap-6 sm:gap-10 pb-12 sm:pb-24">

          {/* === CARD 1: EXPERTISE (BLACK CARD) === */}
          <div className="sticky top-20 sm:top-28 z-10">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#0A0A0A] border border-white/10 min-h-fit md:min-h-[450px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />

              {/* --- LEFT: TEXT CONTENT --- */}
              <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-start text-left mb-0">
                <h3 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  Create an Employee, <br />
                  Experts in any Field
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

          {/* === CARD 2: IDENTITY (THE ROBOT) === */}
          <div className="sticky top-24 sm:top-32 z-20">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#F5F5F7] border border-gray-200 min-h-fit md:min-h-[500px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              <div className="w-full items-center justify-center lg:hidden flex">
                {/* Reduced width on mobile (w-[220px]) to fit screen */}
                <div className="w-full drop-shadow-2xl -translate-y-5">
                  <img src="/id.png" alt="" />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-start text-left mb-8 md:mb-0">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  They get their own <br />Identity
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-6 sm:mb-8 w-full lg:max-w-sm">
                  Your employee gets a name, role, phone number and professional email.
                  You can delegate tasks just like you would to a human.
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

          {/* === CARD 3: COMMUNICATION (CHAT UI) === */}
          <div className="sticky top-28 sm:top-36 z-30">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-white border border-gray-200 min-h-fit md:min-h-[500px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Content */}
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left order-2 md:order-1">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Just Text Or <br />
                  Call them on your phone
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-0 md:mb-8 max-w-sm">
                  Call, message, or email your AI employee anytime. It joins meetings, take notes, and handles tasks autonomously.
                  You step in only when approval is needed.
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
                    className="self-end bg-[#DB2627] text-white p-3 sm:p-4 rounded-2xl rounded-tr-sm shadow-lg max-w-[90%]"
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
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500">AI Employee</span>
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

          {/* === CARD 4: INTERGRATIONS === */}
          <div className="sticky top-32 sm:top-40 z-30">
            <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] bg-[#F5F5F7] border border-gray-200min-h-fit md:min-h-[500px] flex flex-col md:flex-row items-center justify-between p-6 sm:p-14">

              {/* Content */}
              <div className="w-full md:w-1/2 relative z-10 flex flex-col items-start text-left order-2 md:order-1">
                <h3 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  Invite to All <br />
                  Your Favourite Apps
                </h3>
                <p className="text-sm sm:text-lg text-gray-500 leading-relaxed mb-0 md:mb-8 max-w-sm">
                  Call, message, or email your AI employee anytime. It joins meetings, take notes, and handles tasks autonomously.
                  You step in only when approval is needed.
                </p>
              </div>

              {/* Visual: Hub-and-Spoke */}
              <div className="absolute right-0 bottom-0 w-full md:w-1/2 mt-8 md:mt-0 order-1 md:order-2 justify-center items-center mb-6 md:mb-0 hidden xl:flex">
                <img src="/intergrations.png" alt="" className='scale-150 translate-x-10 translate-y-10' />
              </div>

              <div className="w-full md:w-1/2 mt-8 md:mt-0 order-1 md:order-2 justify-center items-center mb-6 md:mb-0 flex xl:hidden">
                <img src="/intergrations.png" alt="" className='scale-150 translate-x-10 -translate-y-20' />
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
                          ? "bg-[#f1f1f1] border-none shadow-2xl z-30"
                          : "bg-[#121212] border-white/5 z-10"
                        }
                      `}
                      style={{ height: CARD_HEIGHT }}
                    >
                      <div>
                        <p
                          className={`text-xl leading-relaxed font-medium line-clamp-3
                          ${offset === 0 ? "text-black" : "text-gray-500"}
                        `}
                        >
                          "{testimonial.text}"
                        </p>
                      </div>

                      <div className="flex items-center gap-4 mt-auto">
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`text-sm font-bold truncate ${offset === 0 ? "text-black" : "text-gray-400"
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
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
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
    <section className="relative w-full max-w-[1500px] mx-auto rounded-b-xl bg-gradient-to-b from-[#fdfffc] via-pink-50/70 via-20% to-rose-300/85 py-10 mb-20 md:py-16 lg:py-32 px-6">
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

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6 cursor-pointer group w-fit">
              <img src="/Logo-full-white.png" alt="PilotUP Logo" className="h-8 w-auto object-contain" />
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
              Build teams of AI Employees to scale your business. PilotUP automates complex tasks with autonomous AI agents that work 24/7.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Instagram, href: 'https://www.instagram.com/thepilotup', label: 'Instagram' },
                { Icon: Linkedin, href: 'https://www.linkedin.com/company/pilotup/', label: 'LinkedIn' },
                { Icon: Youtube, href: 'https://www.youtube.com/@thepilotup', label: 'Youtube' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
                >
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

        {/* --- BOTTOM SECTION --- */}
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

      {/* WATERMARK */}
      <div className="w-full flex justify-center select-none pointer-events-none py-2">
        <span className="font-semibold tracking-[-0.03em] leading-none inline-block bg-gradient-to-b from-[#ffffff66] via-[#ffffff33] to-transparent bg-clip-text text-transparent text-[12vw] sm:text-[14vw] md:text-[12vw] lg:text-[11vw]">
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

  // Multi-schema graph for comprehensive SEO
  const homePageSchemas = [
    // Organization Schema - establishes brand identity
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'PilotUP',
      url: SITE_URL,
      logo: `${SITE_URL}/Logo-full-black.png`,
      description: 'Build teams of AI Employees to scale your business. PilotUP helps you automate workflows with an AI workforce that works 24/7.',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: ['en']
      }
    },

    // WebSite Schema - enables sitelinks search box
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'PilotUP',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/blog?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    },

    // SoftwareApplication Schema - existing, enhanced
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_URL}/#softwareapplication`,
      name: 'PilotUP',
      url: SITE_URL,
      description: 'Build teams of AI Employees to scale your business. Automate workflows with an AI workforce.',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }
    },

    // FAQPage Schema - leverages existing FAQ content
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faqpage`,
      mainEntity: FAQS.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    }
  ];

  return (
    <>
      <Seo
        fullTitle="PilotUP: Build Teams of AI Employees to Scale Your Business"
        description="PilotUP saves you months of execution by letting you create AI employees that work together on your business goals and deliver human-quality results. Get started free."
        canonical="/"
        type="website"
        schema={homePageSchemas}
        keywords={['AI employees', 'AI workforce', 'business automation', 'AI agents', 'workflow automation', 'autonomous AI', 'AI assistant', 'business scaling']}
        twitterCard="summary_large_image"
        ogImage={`${SITE_URL}/pilotup-landing.png`}
        datePublished="2025-12-01T00:00:00Z"
        dateModified={new Date().toISOString()}
      />
      <NavbarWrapper showAnnouncement={showAnnouncement} />
      <Hero />
      <IdentitySection />
      {/* <HowItWorks /> */}
      <ValueProps />
      <Integrations />
      {/* <FocusLead /> */}
      <Reviews />
      {/* <Comparison /> */}
      <Pricing />
      <Join />
      <FAQ />
      <WhyPilotUP />
      {/* <CTASection /> */}
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

              {/* New IA Pages */}
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/roles" element={<RolesIndex />} />
              <Route path="/roles/:slug" element={<RolePage />} />
              <Route path="/functions" element={<FunctionsIndex />} />
              <Route path="/functions/:slug" element={<FunctionPage />} />
              <Route path="/features" element={<FeaturesIndex />} />
              <Route path="/features/:slug" element={<FeaturePage />} />

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