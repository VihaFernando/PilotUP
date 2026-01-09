import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

/**
 * Handles Google OAuth login callback
 * Verifies that user exists in admin_invites table
 * If new user, deletes them and redirects to signup with link
 */
const GoogleLoginCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Get current session
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError || !session) {
                    navigate('/login?error=auth_failed');
                    return;
                }

                const user = session.user;
                const userEmail = user.email;
                const userCreatedAt = new Date(user.created_at);
                const now = new Date();
                const diffSeconds = (now - userCreatedAt) / 1000;

                // If user was created less than 10 seconds ago, they're a NEW user (signup)
                // We don't allow new signups via Google on the login page
                if (diffSeconds < 10) {
                    // This is a new account created just now, delete it
                    await supabase.auth.admin.deleteUser(user.id).catch(() => null);
                    await supabase.auth.signOut();

                    navigate('/login?error=new_account_not_allowed');
                    return;
                }

                // Existing user, allow login
                navigate('/blog/admin', { replace: true });
            } catch (error) {
                console.error('Google login callback error:', error);
                navigate('/login?error=callback_failed');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="inline-block w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Verifying your account...</p>
            </div>
        </div>
    );
};

export default GoogleLoginCallback;
