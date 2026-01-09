import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const sessionCheckInProgress = useRef(false); // Prevent duplicate checks

    useEffect(() => {
        // Prevent multiple simultaneous session checks
        if (sessionCheckInProgress.current) return;
        sessionCheckInProgress.current = true;

        const getSession = async () => {
            try {
                // getSession() is LOCAL - reads from localStorage, NO API call!
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('Session error:', sessionError);
                    setUser(null);
                } else if (session?.user) {
                    // Trust the session - already validated by Supabase
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                setUser(null);
            } finally {
                setLoading(false);
                sessionCheckInProgress.current = false;
            }
        };

        getSession();

        // onAuthStateChange listens to LOCAL events (no API calls)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            // This is a local event listener - NO API CALL
            setUser(session?.user ?? null);
        });

        return () => subscription?.unsubscribe();
    }, []);

    const signInWithEmail = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signUpWithEmail = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: 'admin'
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const value = {
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        updatePassword,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
