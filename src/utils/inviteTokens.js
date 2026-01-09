// Utility functions for generating and validating admin invite tokens

/**
 * Generate a secure random token for admin invites
 * @returns {string} A 32-character random token
 */
export const generateInviteToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

/**
 * Extract token from URL search params
 * @param {string} search - URL search string (e.g., "?token=xyz")
 * @returns {string|null} The token if found
 */
export const getTokenFromUrl = (search) => {
    const params = new URLSearchParams(search);
    return params.get('token');
};

/**
 * Build signup URL with token
 * @param {string} token - The invite token
 * @returns {string} The signup URL with token
 */
export const buildSignupUrl = (token) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/signup?token=${encodeURIComponent(token)}`;
};

/**
 * Validate invite token on Supabase
 * @param {object} supabase - Supabase client
 * @param {string} token - The invite token to validate
 * @returns {Promise} Validation result with valid status, email, and message
 */
export const validateInviteToken = async (supabase, token) => {
    try {
        const { data, error } = await supabase.rpc('validate_admin_invite_token', {
            token_input: token
        });

        if (error) {
            return {
                valid: false,
                email: null,
                message: 'Failed to validate invite'
            };
        }

        return data?.[0] || {
            valid: false,
            email: null,
            message: 'Invalid invite link'
        };
    } catch (err) {
        console.error('Token validation error:', err);
        return {
            valid: false,
            email: null,
            message: 'Error validating invite'
        };
    }
};

/**
 * Mark invite as used after successful signup
 * @param {object} supabase - Supabase client
 * @param {string} token - The invite token
 * @param {string} userId - The new user's ID
 * @returns {Promise} Success status
 */
export const markInviteAsUsed = async (supabase, token, userId) => {
    try {
        const { data, error } = await supabase.rpc('mark_invite_as_used', {
            token_input: token,
            user_id: userId
        });

        if (error) {
            console.error('Error marking invite as used:', error);
            return false;
        }

        return data;
    } catch (err) {
        console.error('Error marking invite:', err);
        return false;
    }
};
