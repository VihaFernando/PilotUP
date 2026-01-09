import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateInviteToken, buildSignupUrl } from '../utils/inviteTokens';
import { Copy, Trash2, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminInvites = () => {
    const { user } = useAuth();
    const [invites, setInvites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        expiresIn: 7,
        expiresUnit: 'days' // 'minutes', 'hours', 'days'
    });
    const [creating, setCreating] = useState(false);
    const [message, setMessage] = useState('');
    const [copiedToken, setCopiedToken] = useState(null);

    useEffect(() => {
        if (user) {
            fetchInvites();
        }
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

            // Add time based on unit
            if (formData.expiresUnit === 'minutes') {
                expiresAt.setMinutes(expiresAt.getMinutes() + expiresValue);
            } else if (formData.expiresUnit === 'hours') {
                expiresAt.setHours(expiresAt.getHours() + expiresValue);
            } else if (formData.expiresUnit === 'days') {
                expiresAt.setDate(expiresAt.getDate() + expiresValue);
            }

            // Convert to ISO string properly (keeps local timezone offset)
            const isoString = expiresAt.toISOString();

            const { data, error } = await supabase
                .from('admin_invites')
                .insert({
                    token,
                    created_by: user.id,
                    email: formData.email || null,
                    expires_at: isoString
                })
                .select();

            if (error) throw error;

            setInvites([data[0], ...invites]);
            setFormData({ email: '', expiresIn: 7, expiresUnit: 'days' });
            setShowForm(false);
            setMessage('Invite created successfully!');
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
            const { error } = await supabase
                .from('admin_invites')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInvites(invites.filter(inv => inv.id !== id));
            setMessage('Invite deleted');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error deleting invite:', error);
            setMessage('Failed to delete invite');
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
            <div className="p-8 max-w-4xl mx-auto">
                <div className="animate-pulse">
                    <div className="h-8 w-32 bg-gray-200 rounded mb-4" />
                    <div className="h-64 bg-gray-100 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Invites</h1>
                    <p className="text-gray-600">Generate and manage temporary sign-up links for new admin users</p>
                </div>

                {/* Messages */}
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800"
                    >
                        {message}
                    </motion.div>
                )}

                {/* Create Button */}
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mb-8 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Invite
                    </button>
                )}

                {/* Form */}
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleCreateInvite}
                        className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email (Optional)
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expires In
                                </label>
                                <input
                                    type="number"
                                    value={formData.expiresIn}
                                    onChange={(e) => setFormData({ ...formData, expiresIn: e.target.value })}
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <select
                                    value={formData.expiresUnit}
                                    onChange={(e) => setFormData({ ...formData, expiresUnit: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="minutes">Minutes</option>
                                    <option value="hours">Hours</option>
                                    <option value="days">Days</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={creating}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                            >
                                {creating ? 'Creating...' : 'Create Invite'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}

                {/* Invites List */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        {invites.length} Invite{invites.length !== 1 ? 's' : ''}
                    </h2>

                    {invites.length === 0 ? (
                        <div className="p-8 bg-white border border-gray-200 rounded-lg text-center text-gray-500">
                            No invites yet. Create one to get started!
                        </div>
                    ) : (
                        invites.map((invite) => {
                            const expired = isExpired(invite.expires_at);
                            const used = isUsed(invite.used_at);
                            const signupUrl = buildSignupUrl(invite.token);

                            return (
                                <motion.div
                                    key={invite.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`p-4 border rounded-lg transition ${used ? 'bg-gray-50 border-gray-200' :
                                        expired ? 'bg-red-50 border-red-200' :
                                            'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {used ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : expired ? (
                                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                                ) : (
                                                    <Clock className="w-5 h-5 text-blue-600" />
                                                )}
                                                <span className="font-medium text-gray-900">
                                                    {invite.email || 'General invite'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {used ? (
                                                    `Used on ${new Date(invite.used_at).toLocaleDateString()}`
                                                ) : expired ? (
                                                    `Expired on ${new Date(invite.expires_at).toLocaleDateString()}`
                                                ) : (
                                                    `Expires on ${new Date(invite.expires_at).toLocaleDateString()}`
                                                )}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteInvite(invite.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Link Display */}
                                    {!used && !expired && (
                                        <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
                                            <code className="text-sm text-gray-600 truncate font-mono">
                                                {signupUrl}
                                            </code>
                                            <button
                                                onClick={() => handleCopyLink(invite.token)}
                                                className="ml-3 p-2 text-gray-500 hover:text-blue-600 transition flex-shrink-0"
                                            >
                                                {copiedToken === invite.token ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    )}
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
