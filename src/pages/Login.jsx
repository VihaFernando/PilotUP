import { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, CheckCircle, AlertCircle, ArrowLeft, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { user, signInWithEmail } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Brand color constant
    const BRAND_COLOR = '#E21339';

    // Check for success message from password reset
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

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#1D1D1F]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#E21339]/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[440px] relative z-10">
                
                {/* Back Button (Floating) */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/blog')}
                    className="absolute -top-16 left-0 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1D1D1F] transition-colors p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white"
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-6 shadow-lg shadow-gray-200">
                            <img src="/Logo-white.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-[#1D1D1F]">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Sign in to manage your workspace
                        </p>
                    </div>

                    {/* Messages Area */}
                    <AnimatePresence mode="wait">
                        {successMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm flex items-start gap-3 border border-green-100"
                            >
                                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{successMessage}</span>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-100"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                                <button
                                    type="button"
                                    onClick={() => navigate('/forgot-password')}
                                    className="text-xs font-medium text-gray-500 hover:text-[#E21339] transition-colors"
                                >
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 mt-2 rounded-2xl text-white font-semibold text-lg shadow-lg shadow-[#E21339]/25 hover:shadow-xl hover:shadow-[#E21339]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ backgroundColor: BRAND_COLOR }}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex gap-3 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                            <Info className="w-5 h-5 flex-shrink-0 text-gray-400" />
                            <p className="leading-relaxed text-xs md:text-sm">
                                New admins require an invite link. Contact an existing administrator to join.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Copyright / Footer Text */}
                <div className="text-center mt-8 text-xs text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} PilotUP.io. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;