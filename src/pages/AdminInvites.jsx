import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateInviteToken, buildSignupUrl } from '../utils/inviteTokens';
import { Copy, Trash2, Plus, CheckCircle, Clock, AlertCircle, ArrowLeft, X, Link as LinkIcon, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminInvites = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        expiresIn: 7,
        expiresUnit: 'days'
    });
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    const BRAND_COLOR = '#E21339';

    useEffect(() => {
        if (user) fetchInvites();
    }, [user]);

    const fetchInvites = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_invites')
                .select('*')
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvites(data || []);
        } catch (error) {
            console.error('Error fetching invites:', error);
            setMessage('Failed to load invites');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvite = async (e) => {
        e.preventDefault();
        setCreating(true);
        setMessage('');

        try {
            const token = generateInviteToken();
            const expiresAt = new Date();
            const expiresValue = parseInt(formData.expiresIn);

            if (formData.expiresUnit === 'minutes') expiresAt.setMinutes(expiresAt.getMinutes() + expiresValue);
            else if (formData.expiresUnit === 'hours') expiresAt.setHours(expiresAt.getHours() + expiresValue);
            else if (formData.expiresUnit === 'days') expiresAt.setDate(expiresAt.getDate() + expiresValue);

            const { data, error } = await supabase
                .from('admin_invites')
                .insert({
                    token,
                    created_by: user.id,
                    email: formData.email || null,
                    expires_at: expiresAt.toISOString()
                })
                .select();

            if (error) throw error;

            setInvites([data[0], ...invites]);
            setFormData({ email: '', expiresIn: 7, expiresUnit: 'days' });
            setShowForm(false);
            setMessage('Invite created successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error creating invite:', error);
            setMessage(error.message || 'Failed to create invite');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteInvite = async (id) => {
        if (!confirm('Delete this invite link?')) return;
        try {
            const { error } = await supabase.from('admin_invites').delete().eq('id', id);
            if (error) throw error;
            setInvites(invites.filter(inv => inv.id !== id));
        } catch (error) {
            console.error('Error deleting invite:', error);
        }
    };

    const handleCopyLink = (token) => {
        const url = buildSignupUrl(token);
        navigator.clipboard.writeText(url);
        setCopiedToken(token);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const isExpired = (expiresAt) => new Date(expiresAt) < new Date();
    const isUsed = (usedAt) => usedAt !== null;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-4 border-[#E21339]/30 border-t-[#E21339] rounded-full animate-spin" />
                    <p className="text-gray-500 font-medium animate-pulse text-sm">Loading workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans pb-20">
            {/* Top Navigation Bar - Sticky & Glassmorphic */}
            <div className="sticky top-0 z-30 bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-gray-200/50 supports-[backdrop-filter]:bg-[#F5F5F7]/60">
                <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/blog/admin')}
                        className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#1D1D1F] transition-colors p-2 -ml-2 rounded-lg hover:bg-white/50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="font-semibold text-[#1D1D1F] text-sm md:text-base">Access Management</div>
                    <div className="w-8 sm:w-16" /> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-6 pt-6 md:pt-12">
                {/* Header Section: Flex Col on mobile, Row on Desktop */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold tracking-tight text-[#1D1D1F] mb-2 md:mb-3"
                        >
                            Invites
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-base md:text-lg text-gray-500 max-w-md leading-relaxed"
                        >
                            Generate secure, temporary links to onboard new administrators.
                        </motion.p>
                    </div>
                    
                    {!showForm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowForm(true)}
                            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3.5 md:py-3 rounded-2xl md:rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                            style={{ backgroundColor: BRAND_COLOR, boxShadow: `0 10px 20px -5px ${BRAND_COLOR}40` }}
                        >
                            <Plus className="w-5 h-5" />
                            <span>Create Invite</span>
                        </motion.button>
                    )}
                </div>

                {/* Message Toast */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 md:mb-8 overflow-hidden"
                        >
                            <div className="p-4 bg-white/80 backdrop-blur-md border border-[#E21339]/10 rounded-2xl shadow-sm flex items-start md:items-center gap-3 text-[#1D1D1F] text-sm md:text-base">
                                <div className="w-2 h-2 mt-1.5 md:mt-0 rounded-full shrink-0" style={{ backgroundColor: BRAND_COLOR }} />
                                {message}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Create Form Card */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            className="mb-8 md:mb-10"
                        >
                            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E21339] to-transparent opacity-50" />
                                
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg md:text-xl font-semibold tracking-tight">New Invitation</h3>
                                    <button 
                                        onClick={() => setShowForm(false)}
                                        className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreateInvite}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                                Recipient Email (Optional)
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="colleague@example.com"
                                                className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-0 rounded-xl md:rounded-2xl text-[#1D1D1F] placeholder-gray-400 focus:ring-2 focus:ring-[#E21339]/20 focus:bg-white transition-all duration-200"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                                Duration
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.expiresIn}
                                                onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                                                min="1"
                                                className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-0 rounded-xl md:rounded-2xl text-[#1D1D1F] focus:ring-2 focus:ring-[#E21339]/20 focus:bg-white transition-all duration-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                                Time Unit
                                            </label>
                                            <div className="relative">
                                                <select
                                                    value={formData.expiresUnit}
                                                    onChange={(e) => setFormData({ ...formData, expiresUnit: e.target.value })}
                                                    className="w-full px-5 py-3.5 md:py-4 bg-gray-50 border-0 rounded-xl md:rounded-2xl text-[#1D1D1F] focus:ring-2 focus:ring-[#E21339]/20 focus:bg-white transition-all duration-200 appearance-none"
                                                >
                                                    <option value="minutes">Minutes</option>
                                                    <option value="hours">Hours</option>
                                                    <option value="days">Days</option>
                                                </select>
                                                <Clock className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3.5 md:py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-xl transition-colors w-full md:w-auto text-center"
                                        >
                                            Cancel
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={creating}
                                            className="px-8 py-3.5 md:py-3 rounded-xl text-white font-medium shadow-lg disabled:opacity-50 disabled:shadow-none transition-all w-full md:w-auto"
                                            style={{ backgroundColor: BRAND_COLOR }}
                                        >
                                            {creating ? 'Generating...' : 'Generate Link'}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Invites List */}
                <div className="space-y-4">
                    {invites.length === 0 ? (
                        <div className="py-20 text-center px-4">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                                <LinkIcon className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-[#1D1D1F] font-semibold mb-1">No active invites</h3>
                            <p className="text-gray-500 text-sm md:text-base">Create a new invite to get started.</p>
                        </div>
                    ) : (
                        invites.map((invite) => {
                            const expired = isExpired(invite.expires_at);
                            const used = isUsed(invite.used_at);
                            const isCopied = copiedToken === invite.token;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={invite.id}
                                    className={`group bg-white rounded-2xl p-5 md:p-6 border transition-all duration-300 ${
                                        used ? 'border-gray-100 opacity-60 bg-gray-50/50' : 
                                        expired ? 'border-red-100' : 
                                        'border-white shadow-sm hover:shadow-md hover:border-gray-100'
                                    }`}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                                        {/* Left Side: Info */}
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 p-2 rounded-xl flex-shrink-0 ${
                                                used ? 'bg-green-100 text-green-700' : 
                                                expired ? 'bg-red-100 text-red-700' : 
                                                'bg-blue-50 text-blue-600'
                                            }`}>
                                                {used ? <CheckCircle className="w-5 h-5" /> : 
                                                 expired ? <AlertCircle className="w-5 h-5" /> : 
                                                 <Clock className="w-5 h-5" />}
                                            </div>
                                            
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-[#1D1D1F] flex items-center flex-wrap gap-2 text-base">
                                                    <span className="truncate">
                                                        {invite.email || 'General Invite Link'}
                                                    </span>
                                                    {used && <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-medium whitespace-nowrap">Redeemed</span>}
                                                </h4>
                                                
                                                <div className="flex items-center gap-4 mt-1 text-xs md:text-sm text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                                        {used 
                                                            ? `Used ${new Date(invite.used_at).toLocaleDateString()}` 
                                                            : `Expires ${new Date(invite.expires_at).toLocaleDateString()}`
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side: Actions - Full width on mobile, auto on desktop */}
                                        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                                            {!used && !expired && (
                                                <div className="flex-1 md:flex-none flex items-center justify-between bg-gray-50 rounded-xl p-1 pl-4 border border-gray-100 group-hover:border-gray-200 transition-colors min-w-0">
                                                    <code className="text-xs text-gray-500 font-mono truncate mr-2">
                                                        ...{invite.token.slice(-12)}
                                                    </code>
                                                    <div className="flex items-center">
                                                        <div className="w-px h-4 bg-gray-200 mx-1 md:mx-2" />
                                                        <motion.button
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleCopyLink(invite.token)}
                                                            className={`p-2.5 md:p-2 rounded-lg transition-all shrink-0 ${
                                                                isCopied 
                                                                ? 'bg-green-500 text-white shadow-md' 
                                                                : 'text-gray-400 hover:text-[#1D1D1F] hover:bg-white hover:shadow-sm'
                                                            }`}
                                                        >
                                                            {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <button
                                                onClick={() => handleDeleteInvite(invite.id)}
                                                className="p-3 md:p-3 rounded-xl text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                                                title="Revoke Invite"
                                            >
                                                <Trash2 className="w-5 h-5 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminInvites;