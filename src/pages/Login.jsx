import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Info, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Seo, { SITE_URL } from '../components/SEO';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { user, signInWithEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const BRAND_COLOR = '#E21339';

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
    }, [location.state]);

    if (user) {
        return <Navigate to="/blog/admin" replace />;
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signInWithEmail(email, password);
            navigate('/blog/admin');
        } catch (err) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    // WebPage schema for login
    const loginSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Login - PilotUP',
        description: 'Sign in to PilotUP to manage your AI workforce',
        url: `${SITE_URL}/login`,
        isPartOf: {
            '@type': 'WebSite',
            name: 'PilotUP',
            url: SITE_URL
        }
    };

    return (
        <>
        <Seo
          title="Login"
          description="Sign in to PilotUP. Manage your AI workforce and automation workflows."
          canonical="/login"
          type="website"
          schema={loginSchema}
          robots="noindex,nofollow"
        />
        {/* min-h-[100dvh] ensures it fits the visible mobile screen (excluding URL bars) 
           flex items-center centers it vertically without forcing cutoff */}
        <div className="min-h-[100dvh] bg-[#F5F5F7] font-sans text-[#1D1D1F] flex items-center justify-center p-4 relative overflow-hidden">

            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[#E21339]/10 blur-[80px] md:blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-500/5 blur-[80px] md:blur-[100px] pointer-events-none" />

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[380px] md:max-w-[440px] relative z-10"
            >
                <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6 md:p-10 border border-white relative">

                    {/* --- Back Button (Moved Inside) --- */}
                    {/* Positioned absolute top-left for maximum space saving */}
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-[#1D1D1F] hover:bg-gray-100 transition-all"
                        aria-label="Back to Home"
                    >
                        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8 mt-2 md:mt-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-4 shadow-lg shadow-gray-200">
                            <img src="/Logo-white.png" alt="Logo" className="w-9 h-9 md:w-12 md:h-12 object-contain" />
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2 text-[#1D1D1F]">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-xs md:text-base">
                            Sign in to manage your workspace
                        </p>
                    </div>

                    {/* Messages Area */}
                    <AnimatePresence mode="wait">
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 20 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-green-50 text-green-700 p-3 rounded-xl text-xs md:text-sm flex items-start gap-2 border border-green-100 overflow-hidden"
                            >
                                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{successMessage}</span>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 20 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-red-50 text-red-600 p-3 rounded-xl text-xs md:text-sm flex items-start gap-2 border border-red-100 overflow-hidden"
                            >
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4 md:space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-gray-50 border-transparent rounded-xl md:rounded-2xl text-[#1D1D1F] text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-[10px] md:text-xs font-medium text-gray-500 hover:text-[#E21339] transition-colors"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 md:pl-12 pr-12 py-3 md:py-4 bg-gray-50 border-transparent rounded-xl md:rounded-2xl text-[#1D1D1F] text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 hover:text-[#1D1D1F] transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                                    ) : (
                                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 md:py-4 mt-2 rounded-xl md:rounded-2xl text-white font-semibold text-base md:text-lg shadow-lg shadow-[#E21339]/25 hover:shadow-xl hover:shadow-[#E21339]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ backgroundColor: BRAND_COLOR }}
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-5 md:mt-8 pt-5 md:pt-6 border-t border-gray-100">
                        <div className="flex gap-2 text-sm text-gray-500 bg-gray-50 p-3 md:p-4 rounded-xl items-start">
                            <Info className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 text-gray-400 mt-0.5" />
                            <p className="leading-tight text-[10px] md:text-xs">
                                New admins require an invite link. Contact an existing administrator to join.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-6 text-[10px] md:text-xs text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} PilotUP.io. All rights reserved.
                </div>
            </motion.div>
        </div>
        </>
    );
};

export default Login;