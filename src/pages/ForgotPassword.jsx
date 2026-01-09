import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const BRAND_COLOR = '#E21339';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email) {
                throw new Error('Please enter your email address');
            }

            await resetPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to send reset email');
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
                
                {/* Floating Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/login')}
                    className="absolute -top-16 left-0 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1D1D1F] transition-colors p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {success ? (
                            /* Success View */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-center"
                            >
                                {/* Top Decoration */}
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-green-400 to-emerald-500" />

                                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                
                                <h1 className="text-2xl font-bold tracking-tight mb-3">Check your inbox</h1>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    We've sent a password reset link to <br/>
                                    <span className="font-semibold text-gray-900">{email}</span>
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
                        ) : (
                            /* Form View */
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-5 shadow-lg shadow-gray-200">
                                        <KeyRound className="w-7 h-7 text-white" />
                                    </div>
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Reset Password</h1>
                                    <p className="text-gray-500 text-sm md:text-base">
                                        Enter your email to receive recovery instructions
                                    </p>
                                </div>

                                {/* Error Message */}
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
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                                placeholder="name@example.com"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 rounded-2xl text-white font-semibold text-lg shadow-lg shadow-[#E21339]/25 hover:shadow-xl hover:shadow-[#E21339]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        style={{ backgroundColor: BRAND_COLOR }}
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </motion.button>
                                </form>

                                {/* Bottom Link */}
                                <div className="mt-8 text-center">
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        Remember your password? <span className="underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900">Sign in</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-gray-400 font-medium">
                    &copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;