import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { markInviteAsUsed } from '../utils/inviteTokens';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Handles Google OAuth signup callback (with invite token)
 * Only works if there's a valid invite token in session storage
 */
const GoogleSignupCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Setting up your account...');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    setStatus('error');
                    setMessage('Authentication failed. Please try again.');
                    return;
                }

                const user = session.user;

                // Get invite token from session storage (set by SignUp page before OAuth)
                const token = sessionStorage.getItem('pendingInviteToken');

                if (token) {
                    // Mark invite as used
                    await markInviteAsUsed(supabase, token, user.id);
                    sessionStorage.removeItem('pendingInviteToken');
                }

                setStatus('success');
                setMessage('Account created successfully!');

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login', {
                        replace: true,
                        state: { message: 'Google sign up successful! Please check your email to confirm your account, then log in.' }
                    });
                }, 2000);
            } catch (error) {
                console.error('Google signup callback error:', error);
                setStatus('error');
                setMessage('Failed to complete signup. Please try again.');
            }
        };

        handleCallback();
    }, [navigate]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
                    <p className="text-gray-600">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    {status === 'success' ? (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <p className="text-sm text-gray-500">Redirecting to login...</p>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Signup Failed</h1>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Go to Login
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GoogleSignupCallback;
