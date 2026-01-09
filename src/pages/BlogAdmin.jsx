import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateSlug, formatDate } from '../utils/helpers';
import { Editor } from '@tinymce/tinymce-react';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    LogOut,
    FileText,
    Image as ImageIcon,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        content: '',
        cover_url: ''
    });

    const editorRef = useRef(null);
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleNewBlog = () => {
        setEditingBlog(null);
        setFormData({
            title: '',
            slug: '',
            content: '',
            cover_url: ''
        });
        setShowEditor(true);
        setError('');
    };

    const handleEditBlog = (blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            content: blog.content,
            cover_url: blog.cover_url || ''
        });
        setShowEditor(true);
        setError('');
    };

    const handleTitleChange = (title) => {
        setFormData({
            ...formData,
            title,
            slug: generateSlug(title)
        });
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            setError('Title is required');
            return false;
        }
        if (!formData.content.trim() || formData.content === '<p></p>') {
            setError('Content is required');
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setSaving(true);
        setError('');

        try {
            const blogData = {
                title: formData.title,
                slug: formData.slug,
                content: formData.content,
                cover_url: formData.cover_url || null,
                author_id: user.id
            };

            if (editingBlog) {
                const { error } = await supabase
                    .from('blogs')
                    .update(blogData)
                    .eq('id', editingBlog.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('blogs')
                    .insert([blogData]);

                if (error) throw error;
            }

            await fetchBlogs();
            setShowEditor(false);
            setFormData({ title: '', slug: '', content: '', cover_url: '' });
        } catch (error) {
            console.error('Error saving blog:', error);
            setError(error.message || 'Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const { error } = await supabase
                .from('blogs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchBlogs();
        } catch (error) {
            console.error('Error deleting blog:', error);
            setError('Failed to delete blog');
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fdfffc] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfffc] pt-24 pb-20 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-0 mb-10 md:mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Blog Dashboard</h1>
                        <p className="text-gray-500 text-sm md:text-base">Manage your blog posts</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/invites')}
                            className="px-4 py-2.5 rounded-full border border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 transition-all text-center text-sm md:text-base"
                        >
                            Manage Invites
                        </button>
                        <button
                            onClick={() => navigate('/blog')}
                            className="px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-center text-sm md:text-base"
                        >
                            View Blog
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-sm md:text-base"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Error Display */}
                {error && !showEditor && (
                    <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm md:text-base">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="ml-auto">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Editor View */}
                <AnimatePresence>
                    {showEditor && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white rounded-3xl border border-gray-200 p-5 md:p-8 mb-8 shadow-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowEditor(false);
                                        setError('');
                                    }}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Enter blog title..."
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all text-base md:text-lg font-semibold"
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Slug (auto-generated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="blog-post-slug"
                                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all font-mono text-sm"
                                    />
                                </div>

                                {/* Cover URL */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Cover Image URL
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="url"
                                                value={formData.cover_url}
                                                onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all text-sm md:text-base"
                                            />
                                        </div>
                                    </div>
                                    {formData.cover_url && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                                            <img
                                                src={formData.cover_url}
                                                alt="Cover preview"
                                                className="w-full h-40 md:h-48 object-cover"
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* TinyMCE Editor */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Content *
                                    </label>
                                    <div className="border border-gray-200 rounded-2xl overflow-hidden">
                                        <Editor
                                            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                            onInit={(evt, editor) => editorRef.current = editor}
                                            value={formData.content}
                                            onEditorChange={(content) => setFormData({ ...formData, content })}
                                            init={{
                                                height: 500,
                                                menubar: true,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'codesample'
                                                ],
                                                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image codesample | removeformat | code | help',
                                                content_style: `
                                                  body { 
                                                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                                                    font-size: 16px; 
                                                    line-height: 1.6;
                                                    padding: 20px;
                                                  }
                                                  h1, h2, h3, h4, h5, h6 { 
                                                    font-weight: bold; 
                                                    margin-top: 1.5em; 
                                                    margin-bottom: 0.5em; 
                                                  }
                                                  img { 
                                                    max-width: 100%; 
                                                    height: auto; 
                                                    border-radius: 12px; 
                                                  }
                                                  code { 
                                                    background-color: #f3f4f6; 
                                                    padding: 2px 6px; 
                                                    border-radius: 4px; 
                                                    font-family: 'SF Mono', Monaco, 'Courier New', monospace;
                                                    font-size: 14px;
                                                  }
                                                  pre { 
                                                    background-color: #1f2937; 
                                                    color: #f9fafb; 
                                                    padding: 16px; 
                                                    border-radius: 8px; 
                                                    overflow-x: auto;
                                                    margin: 16px 0;
                                                  }
                                                  pre code {
                                                    background-color: transparent;
                                                    padding: 0;
                                                    font-size: 14px;
                                                    line-height: 1.5;
                                                  }
                                                  .mce-content-body .mce-content-body figure.wp-block-code {
                                                    background-color: #1f2937;
                                                    padding: 16px; 
                                                    border-radius: 8px; 
                                                    margin: 16px 0;
                                                  }
                                                  .mce-content-body .mce-content-body figure.wp-block-code figcaption {
                                                    color: #9ca3af;
                                                    font-size: 12px; 
                                                    margin-bottom: 8px;
                                                  }
                                                `,
                                                skin: 'oxide',
                                                content_css: 'default',
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center sm:justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => {
                                            setShowEditor(false);
                                            setError('');
                                        }}
                                        className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all text-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        <Save className="w-4 h-4" />
                                        {saving ? 'Saving...' : editingBlog ? 'Update Post' : 'Publish Post'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Blog List */}
                {!showEditor && (
                    <>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                All Posts ({blogs.length})
                            </h2>
                            <button
                                onClick={handleNewBlog}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition-all shadow-lg"
                            >
                                <Plus className="w-5 h-5" />
                                New Post
                            </button>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 text-center">
                                <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">No blog posts yet</h3>
                                <p className="text-sm md:text-base text-gray-500 mb-6">Create your first blog post to get started</p>
                                <button
                                    onClick={handleNewBlog}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white font-semibold hover:bg-black transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create First Post
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {blogs.map((blog) => (
                                    <motion.div
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 hover:border-gray-300 transition-all"
                                    >
                                        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
                                            {/* Thumbnail */}
                                            {blog.cover_url && (
                                                <div className="w-full md:w-32 h-40 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    <img
                                                        src={blog.cover_url}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => e.target.style.display = 'none'}
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0 w-full">
                                                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 break-words">
                                                    {blog.title}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 mb-4 md:mb-3">
                                                    <span>{formatDate(blog.created_at)}</span>
                                                    <span className="hidden md:inline">•</span>
                                                    <span className="font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[200px]">
                                                        /{blog.slug}
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center justify-end md:justify-start gap-2 mt-auto">
                                                    <button
                                                        onClick={() => handleEditBlog(blog)}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 md:p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all text-sm font-medium"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="md:hidden">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(blog.id)}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 md:p-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all text-sm font-medium"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="md:hidden">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogAdmin;