import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { validateInviteToken, markInviteAsUsed, getTokenFromUrl } from '../utils/inviteTokens';
import { Mail, Lock, AlertCircle, CheckCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

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
                setTokenData({ message: 'No invite link provided. Please check the link.' });
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
                    state: { message: 'Sign up successful! Please check your email to confirm your account, then log in.' }
                });
            }, 2000);
        } catch (err) {
            setError(err.message || 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };

    // Token validation is still loading
    if (tokenValid === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">Validating invite link...</p>
                </div>
            </div>
        );
    }

    // Invalid token
    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite Link</h1>
                        <p className="text-gray-600 mb-6">
                            {tokenData?.message || 'This invite link is invalid, expired, or has already been used.'}
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Go to Login
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PilotUP!</h1>
                        <p className="text-gray-600 mb-6">
                            Your account has been created. Please check your email to confirm your account, then log in.
                        </p>
                        <p className="text-sm text-gray-500">Redirecting to login...</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Sign up form
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 mb-4 shadow-lg">
                            <img src="/Logo-full-white.png" alt="Logo" className="w-12 h-12 object-contain" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Admin Account</h1>
                        <p className="text-gray-600 text-sm">Join the team and start managing content</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSignUp} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="At least 6 characters"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-gray-600 text-sm mt-6">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Log in
                        </button>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SignUp;
