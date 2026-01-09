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
    const [tokenValid, setTokenValid] = useState(null); // null=checking, true=valid, false=invalid
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

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/blog/admin', { replace: true });
        }
    }, [user, navigate]);

    // Validate token on mount
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

            // Pre-fill email if provided in token
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

            // Sign up user with full name
            const { data, error: signUpError } = await signUpWithEmail(email, password, fullName);

            if (signUpError) throw signUpError;

            // Mark invite as used
            if (token && data?.user) {
                await markInviteAsUsed(supabase, token, data.user.id);
            }

            setSuccess(true);

            // Redirect after 2 seconds
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

    // --- RENDER HELPERS ---

    // 1. Loading State (Validating Token)
    if (tokenValid === null) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" style={{ color: BRAND_COLOR }} />
                    <p className="text-gray-500 font-medium animate-pulse text-sm">Verifying invitation...</p>
                </div>
            </div>
        );
    }

    // 2. Invalid Token State
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 text-center border border-white"
                >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-3">Invalid Link</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        {tokenData?.message || 'This invite link is invalid, expired, or has already been used.'}
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/login')}
                        className="w-full py-3.5 rounded-2xl bg-gray-900 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                        Return to Login
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // 3. Success State
    if (success) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 text-center border border-white relative overflow-hidden"
                >
                     {/* Success Confetti/Glow */}
                     <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-3">Welcome Aboard!</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your admin account has been created successfully. Redirecting you to the login page...
                    </p>
                    <div className="flex justify-center">
                        <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
                    </div>
                </motion.div>
            </div>
        );
    }

    // 4. Main Sign Up Form
    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#1D1D1F]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E21339]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[480px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-5 shadow-lg shadow-gray-200">
                            <img src="/Logo-white.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Create Account</h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Join the workspace to start managing content
                        </p>
                    </div>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, mb: 0 }}
                                animate={{ opacity: 1, height: 'auto', mb: 24 }}
                                exit={{ opacity: 0, height: 0, mb: 0 }}
                                className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm flex items-start gap-3 border border-red-100 overflow-hidden"
                            >
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span className="font-medium">{error}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSignUp} className="space-y-5">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Jane Doe"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@company.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                />
                            </div>
                        </div>

                        {/* Password Grid - Stack on mobile, side-by-side on tablet if desired, but stacked usually safer for long passwords */}
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 chars"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat password"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
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
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="w-5 h-5 opacity-80" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="font-semibold text-gray-900 hover:text-[#E21339] transition-colors"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </motion.div>
                
                {/* Copyright */}
                <div className="text-center mt-8 text-xs text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default SignUp;