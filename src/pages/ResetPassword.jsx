import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, CheckCircle, AlertCircle, Loader2, KeyRound, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();
    const { updatePassword } = useAuth();
    const BRAND_COLOR = '#E21339';

    useEffect(() => {
        // Check if there's a valid session from email link
        const hash = window.location.hash;
        if (!hash.includes('access_token') && !hash.includes('type=recovery')) {
            setError('Invalid or expired reset link. Please request a new one.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!password || !confirmPassword) {
                throw new Error('Please fill in all fields');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            await updatePassword(password);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login', {
                    replace: true,
                    state: { message: 'Password updated successfully! Please log in with your new password.' }
                });
            }, 2000);
        } catch (err) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    // --- Success State ---
    if (success) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 font-sans text-[#1D1D1F]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 text-center border border-white relative overflow-hidden"
                >
                    {/* Success Gradient Bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    
                    <h1 className="text-2xl font-bold tracking-tight mb-3">All Set!</h1>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        Your password has been securely updated. <br />
                        Redirecting you to login...
                    </p>
                    
                    <div className="flex justify-center items-center gap-2 text-sm text-gray-400 font-medium">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting...
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- Form State ---
    return (
        <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 relative overflow-hidden font-sans text-[#1D1D1F]">
            
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#E21339]/5 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[440px] relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 p-8 md:p-10 border border-white"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 mb-5 shadow-lg shadow-gray-200">
                            <KeyRound className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">New Password</h1>
                        <p className="text-gray-500 text-sm md:text-base">
                            Create a strong password for your account
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* New Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="At least 6 characters"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-[#E21339]/10 transition-all duration-300 outline-none font-medium"
                                    placeholder="Repeat password"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !!error}
                            className="w-full py-4 mt-2 rounded-2xl text-white font-semibold text-lg shadow-lg shadow-[#E21339]/25 hover:shadow-xl hover:shadow-[#E21339]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            style={{ backgroundColor: BRAND_COLOR }}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Update Password</span>
                                    <ArrowRight className="w-5 h-5 opacity-80" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer / Copyright */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                        Secure connection via SSL
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPassword;