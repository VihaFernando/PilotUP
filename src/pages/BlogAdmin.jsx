import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateSlug, formatDate } from '../utils/helpers';
import { Editor } from '@tinymce/tinymce-react';
import Navbar from '../components/Navbar';
import Seo from '../components/SEO';
import {
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    LogOut,
    FileText,
    Image as ImageIcon,
    AlertCircle,
    ChevronRight,
    LayoutDashboard,
    Users,
    ArrowUpRight,
    LayoutGrid,
    List,
    Calendar,
    Link as LinkIcon,
    Maximize2,
    Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogAdmin = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditor, setShowEditor] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
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
        setFormData({ title: '', slug: '', content: '', cover_url: '' });
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
            const { error } = await supabase.from('blogs').delete().eq('id', id);
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

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-[#E21339] rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium tracking-tight">Syncing workspace...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
        <Seo
          title="Blog admin"
          description="Manage PilotUP blog posts. Create, edit, and publish content."
          canonical="/blog/admin"
          type="website"
        />
        <div className="min-h-screen bg-[#F5F5F7] selection:bg-[#E21339] selection:text-white font-sans">
            <Navbar showAnnouncement={false} scrolled={false} setScrolled={() => { }} />

            <div className="pt-28 pb-20 px-6 max-w-[1400px] mx-auto">

                {/* --- Header Section --- */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full md:w-auto"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-6 px-2.5 rounded-md bg-white border border-gray-200 text-[11px] font-bold uppercase tracking-wider text-[#E21339] flex items-center shadow-sm">
                                Admin Console
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1D1D1F]">
                            Content Manager
                        </h1>
                        <p className="text-gray-500 mt-2 md:mt-3 text-base md:text-lg font-medium">
                            Create, edit, and manage your publication.
                        </p>
                    </motion.div>

                    {/* Navigation Controls */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        /* Layout Logic:
                        1. Mobile: 'grid grid-cols-2' creates the 2x2 layout.
                        2. Desktop: 'md:flex' switches to the single row line.
                        */
                        className="grid grid-cols-2 md:flex items-center gap-2 p-2 md:p-1.5 bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl md:rounded-full shadow-sm w-full md:w-auto"
                    >
                        <button
                            onClick={() => navigate('/admin/invites')}
                            className="h-10 px-3 md:px-5 rounded-xl md:rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#E21339] transition-all flex items-center justify-center gap-2"
                        >
                            <Users className="w-4 h-4" /> Invites
                        </button>
                        
                        <button
                            onClick={() => navigate('/admin/announcement')}
                            className="h-10 px-3 md:px-5 rounded-xl md:rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#E21339] transition-all flex items-center justify-center gap-2"
                        >
                            <LayoutDashboard className="w-4 h-4" /> Announcement
                        </button>
                        
                        <button
                            onClick={() => navigate('/blog')}
                            className="h-10 px-3 md:px-5 rounded-xl md:rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#E21339] transition-all flex items-center justify-center gap-2"
                        >
                            <ArrowUpRight className="w-4 h-4" /> Live Site
                        </button>
                        
                        {/* Logout Button: Rectangle with text on mobile (4th grid item), Circle icon on Desktop */}
                        <button
                            onClick={handleLogout}
                            className="h-10 w-full md:w-10 px-3 md:px-0 rounded-xl md:rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all gap-2 md:gap-0"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                            {/* Text visible only on mobile to fill the grid cell */}
                            <span className="md:hidden text-sm font-medium">Sign Out</span>
                        </button>
                    </motion.div>
                </header>

                {/* --- Error Toast --- */}
                <AnimatePresence>
                    {error && !showEditor && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -20, height: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="p-4 rounded-2xl bg-red-50/50 border border-red-100 text-red-700 flex items-center gap-3 shadow-sm backdrop-blur-sm">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium">{error}</span>
                                <button onClick={() => setError('')} className="ml-auto hover:bg-red-100 p-1 rounded-full transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- FULL SCREEN EDITOR MODAL --- */}
                <AnimatePresence>
                    {showEditor && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => { setShowEditor(false); setError(''); }}
                                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-all"
                            />

                            {/* Modal Content */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                                className="fixed z-50 bg-[#fff] shadow-2xl flex flex-col overflow-hidden ring-1 ring-black/5
                                           inset-0 md:inset-4 lg:inset-6 md:rounded-[32px]"
                            >
                                {/* Modal Header */}
                                <div className="px-4 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-20">
                                    <div className="flex flex-col">
                                        <h2 className="text-xl md:text-2xl font-bold text-[#1D1D1F] tracking-tight">
                                            {editingBlog ? 'Edit Article' : 'New Article'}
                                        </h2>
                                        <p className="hidden md:block text-xs text-gray-500 font-medium">
                                            {editingBlog ? 'Changes are not live until updated.' : 'Ready to share your story?'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <button
                                            onClick={() => { setShowEditor(false); setError(''); }}
                                            className="px-4 py-2 rounded-full text-sm font-medium text-gray-500 hover:bg-gray-100 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-[#E21339] text-white text-sm font-medium hover:bg-[#c01030] transition-all shadow-lg shadow-[#E21339]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="hidden md:inline">Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>{editingBlog ? 'Update' : 'Publish'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Body - Scrollable */}
                                <div className="flex-1 overflow-y-auto bg-[#F5F5F7] relative">
                                    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6 h-full flex flex-col">

                                        {error && (
                                            <div className="p-4 rounded-xl bg-red-50 text-red-600 flex items-center gap-2 text-sm font-medium border border-red-100 shrink-0">
                                                <AlertCircle className="w-4 h-4" /> {error}
                                            </div>
                                        )}

                                        {/* Metadata Row */}
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
                                            <div className="lg:col-span-2 space-y-4">
                                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Title</label>
                                                        <input
                                                            type="text"
                                                            value={formData.title}
                                                            onChange={(e) => handleTitleChange(e.target.value)}
                                                            placeholder="Enter title..."
                                                            className="w-full px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-[#E21339]/10 text-lg font-bold text-[#1D1D1F] transition-all"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Slug</label>
                                                            <div className="flex items-center px-4 py-2 rounded-xl bg-gray-50 border border-transparent focus-within:bg-white focus-within:border-gray-200 focus-within:ring-2 focus-within:ring-[#E21339]/10 transition-all">
                                                                <span className="text-gray-400 text-sm font-mono">/</span>
                                                                <input
                                                                    type="text"
                                                                    value={formData.slug}
                                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                                    placeholder="url-slug"
                                                                    className="w-full bg-transparent border-none p-0 ml-1 text-sm font-mono text-gray-600 focus:ring-0"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Cover Image</label>
                                                            <div className="relative">
                                                                <input
                                                                    type="url"
                                                                    value={formData.cover_url}
                                                                    onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                                                                    placeholder="Image URL..."
                                                                    className="w-full pl-9 px-4 py-2 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 focus:ring-2 focus:ring-[#E21339]/10 text-sm transition-all"
                                                                />
                                                                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Preview Image Box */}
                                            <div className="hidden lg:block lg:col-span-1">
                                                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 h-full">
                                                    <div className="h-full min-h-[140px] rounded-xl bg-gray-50 overflow-hidden relative flex items-center justify-center">
                                                        {formData.cover_url ? (
                                                            <img
                                                                src={formData.cover_url}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover absolute inset-0"
                                                                onError={(e) => e.target.style.display = 'none'}
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center gap-2 text-gray-300">
                                                                <ImageIcon className="w-8 h-8" />
                                                                <span className="text-xs font-medium">No Cover</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Editor Area */}
                                        <div className="flex-1 min-h-[600px] flex flex-col space-y-1 pb-4">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Content</label>
                                            <div className="flex-1 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white relative max-h-[80vh]">
                                                <Editor
                                                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                                                    onInit={(evt, editor) => editorRef.current = editor}
                                                    value={formData.content}
                                                    onEditorChange={(content) => setFormData({ ...formData, content })}
                                                    init={{
                                                        height: "100%",
                                                        menubar: true,
                                                        plugins: [
                                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                                                            'codesample', 'directionality', 'visualchars', 'template', 'pagebreak', 'nonbreaking', 'quickbars', 'emoticons'
                                                        ],
                                                        toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                                                            'bold italic underline strikethrough | link image media table mergetags | align lineheight | ' +
                                                            'checklist numlist bullist indent outdent | blockquote | emoticons charmap | removeformat | fullscreen code codesample',
                                                        content_style: `
                                                            body {
                                                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                                                font-size: 18px;
                                                                line-height: 1.7;
                                                                color: #1d1d1f;
                                                                padding: 20px 30px;
                                                                max-width: 900px;
                                                                margin: 0 auto;
                                                                background: #fff;
                                                            }
                                                            h1 { font-size: 2.8em; font-weight: 800; color: #1d1d1f; margin-top: 0.8em; margin-bottom: 0.3em; }
                                                            h2 { font-size: 2.2em; font-weight: 700; color: #1d1d1f; margin-top: 0.8em; margin-bottom: 0.3em; }
                                                            h3 { font-size: 1.7em; font-weight: 600; color: #1d1d1f; margin-top: 0.8em; margin-bottom: 0.3em; }
                                                            a { color: #E21339; text-decoration: none; }
                                                            a:hover { text-decoration: underline; }
                                                            img { max-width: 100%; border-radius: 12px; height: auto; display: block; margin: 2em auto; }
                                                            pre {
                                                                background: #1f2937;
                                                                color: #f9fafb;
                                                                padding: 20px;
                                                                border-radius: 12px;
                                                                overflow-x: auto;
                                                                margin: 2em 0;
                                                                font-family: 'SF Mono', Menlo, Monaco, Consolas, monospace;
                                                                font-size: 15px;
                                                                line-height: 1.5;
                                                            }
                                                            code {
                                                                background-color: #f3f4f6;
                                                                padding: 4px 8px;
                                                                border-radius: 6px;
                                                                font-family: 'SF Mono', Monaco, 'Courier New', monospace;
                                                                font-size: 15px;
                                                            }
                                                            blockquote { border-left: 4px solid #E21339; padding-left: 1.5em; color: #444; font-style: italic; margin: 2em 0; }
                                                        `,
                                                        skin: 'oxide',
                                                        content_css: 'default',
                                                        statusbar: true,
                                                        resize: true,
                                                        codesample_languages: [
                                                            { text: 'HTML/XML', value: 'markup' },
                                                            { text: 'JavaScript', value: 'javascript' },
                                                            { text: 'CSS', value: 'css' },
                                                            { text: 'PHP', value: 'php' },
                                                            { text: 'Ruby', value: 'ruby' },
                                                            { text: 'Python', value: 'python' },
                                                            { text: 'Java', value: 'java' },
                                                            { text: 'C', value: 'c' },
                                                            { text: 'C#', value: 'csharp' },
                                                            { text: 'C++', value: 'cpp' }
                                                        ]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* --- Dashboard Content --- */}
                {!showEditor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h2 className="text-xl font-bold text-[#1D1D1F] flex items-center gap-2">
                                <LayoutDashboard className="w-5 h-5 text-gray-400" />
                                All Posts
                                <span className="text-gray-400 font-medium ml-1 text-base">({blogs.length})</span>
                            </h2>

                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                {/* View Toggle */}
                                <div className="bg-gray-200/50 p-1 rounded-xl flex items-center gap-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#E21339] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        title="Grid View"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#E21339] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                        title="List View"
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                                {/* New Post Button */}
                                <button
                                    onClick={handleNewBlog}
                                    className="flex-1 sm:flex-none group relative overflow-hidden rounded-full bg-[#E21339] px-6 py-2.5 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#E21339]/20"
                                >
                                    <span className="relative flex items-center justify-center gap-2 font-medium z-10">
                                        <Plus className="w-4 h-4" /> New Article
                                    </span>
                                </button>
                            </div>
                        </div>

                        {blogs.length === 0 ? (
                            <div className="bg-white rounded-[32px] border border-dashed border-gray-300 p-20 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <FileText className="w-8 h-8 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No stories yet</h3>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                    Your digital canvas is empty. Start writing your first masterpiece today.
                                </p>
                                <button
                                    onClick={handleNewBlog}
                                    className="text-[#E21339] font-semibold hover:underline"
                                >
                                    Create first post &rarr;
                                </button>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {viewMode === 'grid' ? (
                                    <motion.div
                                        key="grid"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    >
                                        {blogs.map((blog) => (
                                            <div
                                                key={blog.id}
                                                className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 flex flex-col h-full relative"
                                            >
                                                <div className="aspect-[16/9] w-full bg-gray-100 relative overflow-hidden">
                                                    {blog.cover_url ? (
                                                        <img
                                                            src={blog.cover_url}
                                                            alt={blog.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            onError={(e) => e.target.style.display = 'none'}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                            <FileText className="w-10 h-10 text-gray-200" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                                        <button
                                                            onClick={() => handleEditBlog(blog)}
                                                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(blog.id)}
                                                            className="w-10 h-10 rounded-full bg-[#E21339] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                                                        <span>{formatDate(blog.created_at)}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-[#1D1D1F] mb-3 leading-snug line-clamp-2 group-hover:text-[#E21339] transition-colors">
                                                        {blog.title}
                                                    </h3>
                                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                        <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md max-w-[150px] truncate">
                                                            /{blog.slug}
                                                        </code>
                                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#E21339] group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="list"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden"
                                    >
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                                        <th className="px-6 py-5 font-semibold">Article</th>
                                                        <th className="px-6 py-5 font-semibold">Date</th>
                                                        <th className="px-6 py-5 font-semibold text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                    {blogs.map((blog) => (
                                                        <tr key={blog.id} className="group hover:bg-gray-50/80 transition-colors">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                                                        {blog.cover_url ? (
                                                                            <img src={blog.cover_url} className="w-full h-full object-cover" alt="" onError={(e) => e.target.style.display = 'none'} />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText className="w-5 h-5" /></div>
                                                                        )}
                                                                    </div>
                                                                    <div>
                                                                        <h3 className="font-bold text-[#1D1D1F] text-lg leading-tight group-hover:text-[#E21339] transition-colors">{blog.title}</h3>
                                                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                                            <LinkIcon className="w-3 h-3" />
                                                                            <span className="truncate max-w-[200px]">{blog.slug}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                                    {formatDate(blog.created_at)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleEditBlog(blog)}
                                                                        className="p-2 rounded-full text-gray-400 hover:bg-white hover:text-[#1D1D1F] hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(blog.id)}
                                                                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-[#E21339] transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Mobile/Tablet Card View */}
                                        <div className="md:hidden divide-y divide-gray-50">
                                            {blogs.map((blog) => (
                                                <div key={blog.id} className="p-4 hover:bg-gray-50/80 transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                                            {blog.cover_url ? (
                                                                <img src={blog.cover_url} className="w-full h-full object-cover" alt="" onError={(e) => e.target.style.display = 'none'} />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText className="w-6 h-6" /></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-bold text-[#1D1D1F] text-base leading-tight mb-1 truncate">{blog.title}</h3>
                                                            <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
                                                                <LinkIcon className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">{blog.slug}</span>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Calendar className="w-3 h-3" />
                                                                    <span>{formatDate(blog.created_at)}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <button
                                                                        onClick={() => handleEditBlog(blog)}
                                                                        className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-[#1D1D1F] transition-all"
                                                                        title="Edit"
                                                                    >
                                                                        <Edit2 className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(blog.id)}
                                                                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-[#E21339] transition-all"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
        </>
    );
};

export default BlogAdmin;