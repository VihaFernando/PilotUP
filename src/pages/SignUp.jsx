import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { validateInviteToken, markInviteAsUsed } from '../utils/inviteTokens';
import { Mail, Lock, AlertCircle, CheckCircle, User, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(null);
    const [tokenValid, setTokenValid] = useState(null); 
    const [tokenData, setTokenData] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { user, signUpWithEmail } = useAuth();
    const navigate = useNavigate();
    const BRAND_COLOR = '#E21339';

    useEffect(() => {
        if (user) {
            navigate('/blog/admin', { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const validateToken = async () => {
            const urlToken = searchParams.get('token');

            if (!urlToken) {
                setTokenValid(false);
                setTokenData({ message: 'No invite link provided.' });
                return;
            }

            setToken(urlToken);
            const validation = await validateInviteToken(supabase, urlToken);
            setTokenData(validation);
            setTokenValid(validation.valid);

            if (validation.email) {
                setEmail(validation.email);
            }
        };

        validateToken();
    }, [searchParams]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!fullName || !email || !password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const { data, error: signUpError } = await signUpWithEmail(email, password, fullName);
            if (signUpError) throw signUpError;

            if (token && data?.user) {
                await markInviteAsUsed(supabase, token, data.user.id);
            }

            setSuccess(true);
            setTimeout(() => {
                navigate('/login', {
                    replace: true,
                    state: { message: 'Sign up successful! Please check your email to confirm your account.' }
                });
            }, 3000);
        } catch (err) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    // --- STATES ---

    if (tokenValid === null) {
        return (
            <div className="fixed inset-0 bg-[#F5F5F7] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" style={{ color: BRAND_COLOR }} />
                    <p className="text-gray-500 font-medium animate-pulse text-xs md:text-sm">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="fixed inset-0 bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[380px] bg-white rounded-3xl shadow-xl p-6 text-center"
                >
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Invalid Link</h1>
                    <p className="text-gray-500 mb-6 text-xs leading-relaxed">
                        {tokenData?.message || 'This invite link is invalid, expired, or has already been used.'}
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm"
                    >
                        Return to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="fixed inset-0 bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-[380px] bg-white rounded-3xl shadow-xl p-6 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <h1 className="text-xl font-bold mb-2">Welcome Aboard!</h1>
                    <p className="text-gray-500 mb-6 text-xs leading-relaxed">
                        Account created successfully. Redirecting...
                    </p>
                    <div className="flex justify-center">
                        <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- MAIN FORM ---

    return (
        /* 1. fixed inset-0: Locks the outer container to the viewport size.
           2. overflow-hidden: Strictly CUTS OFF the background blobs so no horizontal scroll.
        */
        <div className="fixed inset-0 bg-[#F5F5F7] font-sans text-[#1D1D1F] overflow-hidden">
            
            {/* Background Glows (Now strictly contained) */}
            <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[#E21339]/5 blur-[60px] md:blur-[100px] pointer-events-none z-0" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-500/5 blur-[60px] md:blur-[100px] pointer-events-none z-0" />

            {/* 3. Scrollable Wrapper: 
                  - w-full h-full: Fills the fixed container.
                  - overflow-y-auto: Allows vertical scroll ONLY if form is taller than screen.
                  - overflow-x-hidden: Extra safety against horizontal scroll.
            */}
            <div className="w-full h-full overflow-y-auto overflow-x-hidden relative z-10">
                <div className="min-h-full flex items-center justify-center p-4 py-6">
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-[380px] md:max-w-[460px]"
                    >
                        <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-2xl shadow-gray-200/50 p-6 md:p-10 border border-white">
                            {/* Header */}
                            <div className="text-center mb-5 md:mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-3 shadow-lg shadow-gray-200">
                                    <img src="/Logo-white.png" alt="Logo" className="w-7 h-7 md:w-10 md:h-10 object-contain" />
                                </div>
                                <h1 className="text-xl md:text-3xl font-bold tracking-tight mb-1 md:mb-2 text-[#1D1D1F]">Create Account</h1>
                                <p className="text-gray-500 text-xs md:text-base">
                                    Join the workspace
                                </p>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, mb: 0 }}
                                        animate={{ opacity: 1, height: 'auto', mb: 16 }}
                                        exit={{ opacity: 0, height: 0, mb: 0 }}
                                        className="bg-red-50 text-red-600 p-3 rounded-xl text-xs md:text-sm flex items-start gap-3 border border-red-100 overflow-hidden"
                                    >
                                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                        <span className="font-medium">{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSignUp} className="space-y-3 md:space-y-5">
                                {/* Compact spacing for mobile inputs */}
                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="Jane Doe"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-[#1D1D1F] text-sm md:text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@company.com"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-[#1D1D1F] text-sm md:text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Min 6 chars"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-[#1D1D1F] text-sm md:text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat password"
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-transparent rounded-xl text-[#1D1D1F] text-sm md:text-base placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 mt-2 rounded-xl text-white font-semibold text-sm md:text-lg shadow-lg shadow-[#E21339]/25 hover:shadow-xl hover:shadow-[#E21339]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    style={{ backgroundColor: BRAND_COLOR }}
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <ArrowRight className="w-4 h-4 opacity-80" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Footer */}
                            <div className="mt-5 md:mt-8 pt-5 md:pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs md:text-sm text-gray-500">
                                    Already have an account?{' '}
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="font-semibold text-gray-900 hover:text-[#E21339] transition-colors"
                                    >
                                        Sign In
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-center mt-5 text-[10px] md:text-xs text-gray-400 font-medium">
                            &copy; {new Date().getFullYear()} PilotUP.io. All rights reserved.
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;