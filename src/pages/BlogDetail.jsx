import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/helpers';
import { Calendar, ArrowLeft, Share2, Clock, Check, Bookmark } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import DOMPurify from 'dompurify';
import Navbar from '../components/Navbar';

// --- LIBRARIES FOR CODE BLOCKS ---
import parse from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    const [copiedStates, setCopiedStates] = useState({});
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data, error } = await supabase
                    .from('blogs')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                if (error) throw error;
                setBlog(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [slug]);

    // --- HTML PARSER OPTIONS ---
    const parseOptions = {
        replace: (domNode) => {
            // Handle Code Blocks
            if (domNode.name === 'pre') {
                let codeText = '';
                if (domNode.children && domNode.children.length > 0) {
                    const codeElement = domNode.children.find(child => child.name === 'code');
                    if (codeElement && codeElement.children.length > 0) {
                        codeText = codeElement.children[0].data;
                    } else {
                        codeText = domNode.children[0].data;
                    }
                }

                if (!codeText) return null;

                const handleCopyCode = (text) => {
                    navigator.clipboard.writeText(text);
                    const key = text.substring(0, 20);
                    setCopiedStates(prev => ({ ...prev, [key]: true }));
                    setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
                };
                const key = codeText.substring(0, 20);

                return (
                    <div className="my-10 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl border border-[#333] group max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto font-sans">
                        <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-[#111]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                            </div>
                            <button
                                onClick={() => handleCopyCode(codeText)}
                                className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 font-sans"
                            >
                                {copiedStates[key] ? (
                                    <span className="text-green-400 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
                                ) : (
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Copy Code</span>
                                )}
                            </button>
                        </div>

                        <div className="overflow-x-auto w-full">
                            <SyntaxHighlighter
                                language="javascript"
                                style={vscDarkPlus}
                                showLineNumbers={true}
                                wrapLines={false}
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
                                    minWidth: '100%'
                                }}
                                lineNumberStyle={{
                                    minWidth: '2.5em',
                                    paddingRight: '1em',
                                    color: '#6e7681',
                                    textAlign: 'right',
                                    userSelect: 'none'
                                }}
                            >
                                {codeText}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                );
            }
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try { await navigator.share({ title: blog?.title, url: window.location.href }); } catch (err) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#F9F9FB]" />;
    if (!blog) return null;

    const readTime = Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, '').split(' ').length / 250));

    return (
        <div className="bg-[#F9F9FB] min-h-screen selection:bg-[#E21339] selection:text-white pb-32">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap');`}
            </style>

            <Navbar showAnnouncement={false} scrolled={scrolled} setScrolled={setScrolled} />

            {/* Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#E21339] origin-left z-[60]" style={{ scaleX }} />

            {/* Main Wrapper */}
            <main className="pt-32 px-4 sm:px-6 mx-auto w-full">

                {/* --- Content Layout --- */}
                {/* 3-Column Grid: Left(Spacer) | Content(720px) | Right(Sidebar) */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(auto,720px)_1fr] gap-8 max-w-[1400px] mx-auto relative items-start">

                    {/* Left Column Spacer */}
                    <div className="hidden lg:block"></div>

                    {/* Center Column: Holds Header, Image, and Text */}
                    <div className="min-w-0">

                        {/* --- Header Section (Left Aligned & Inside Grid) --- */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-left mb-10"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[#E21339] text-xs font-bold uppercase tracking-[0.2em] font-sans bg-red-50/80 px-4 py-1.5 rounded-full backdrop-blur-sm border border-red-100">
                                    Blog Post
                                </span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#242424] tracking-tight mb-8 font-sans leading-[1.25] md:leading-[1.25]">
                                {blog.title}
                            </h1>

                            {/* Meta Info: Left Aligned */}
                            <div className="flex items-center gap-6 text-gray-500 text-sm font-medium font-sans border-b border-gray-200/80 pb-8">
                                <div className="flex items-center gap-2.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>{formatDate(blog.created_at)}</span>
                                </div>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-2.5">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>{readTime} min read</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* --- Cover Image --- */}
                        {blog.cover_url && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-xl mb-12 ring-1 ring-black/5"
                            >
                                <img src={blog.cover_url} alt={blog.title} className="w-full h-full object-cover" />
                            </motion.div>
                        )}

                        {/* --- Article Body --- */}
                        <motion.article
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="article-body"
                        >
                            {parse(DOMPurify.sanitize(blog.content), parseOptions)}
                        </motion.article>
                    </div>

                    {/* Right Column (Sidebar) */}
                    <aside className="hidden lg:block h-full">
                        <div className="sticky top-32 flex flex-col gap-6 w-fit ml-6">
                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={handleShare}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#E21339] hover:border-[#E21339]/30 hover:bg-red-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300"
                                    title="Share Article"
                                >
                                    {linkCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                                </button>

                                <button
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-[#E21339] hover:border-[#E21339]/30 hover:bg-red-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300"
                                    title="Save for later"
                                >
                                    <Bookmark className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="w-full h-[1px] bg-gray-200 my-1"></div>

                            <button
                                onClick={() => navigate('/blog')}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-black hover:border-gray-400 transition-all shadow-sm hover:shadow-md"
                                title="Back to Blog"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        </div>
                    </aside>
                </div>

                {/* Mobile Back Button */}
                <div className="lg:hidden mt-20 text-center border-t border-gray-200 pt-10">
                    <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-sm text-gray-600 font-bold hover:text-[#E21339] transition-colors uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to All Posts
                    </button>
                </div>
            </main>

            {/* --- TYPOGRAPHY SYSTEM --- */}
            <style>{`
                /* Base Settings */
                .article-body { 
                    font-family: 'Merriweather', 'Georgia', serif; 
                    color: #242424; 
                    line-height: 2; 
                    font-size: 1.125rem;
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: antialiased;
                }

                /* Text Elements */
                .article-body p { 
                    margin-bottom: 2rem; 
                    font-weight: 400; /* Restored to Normal Weight */
                    color: #292929;
                }

                .article-body strong {
                    font-weight: 700;
                    color: #111;
                }

                /* Headings */
                .article-body h2 { 
                    font-family: 'Merriweather', serif;
                    font-size: 2rem; 
                    font-weight: 900; 
                    margin: 2em 0 0.8em; 
                    color: #1a1a1a;
                    letter-spacing: -0.02em;
                    line-height: 1.25;
                }
                
                .article-body h3 { 
                    font-family: 'Merriweather', serif;
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    margin: 1.8em 0 0.8em; 
                    color: #1a1a1a;
                    line-height: 1.35;
                }

                /* Lists */
                .article-body ul, .article-body ol {
                    margin-bottom: 2.5rem;
                    padding-left: 1.5rem;
                    color: #292929;
                    font-weight: 400; /* Ensure lists are also normal weight */
                }
                .article-body li {
                    margin-bottom: 0.85em;
                    padding-left: 0.5rem;
                    position: relative;
                }
                .article-body ul li::marker {
                    color: #E21339;
                }

                /* Blockquotes */
                .article-body blockquote {
                    position: relative;
                    padding: 1.25rem 1.5rem;
                    margin: 2rem 0;
                    font-style: italic;
                    color: #111;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    border-left: 3px solid #E21339;
                    background: rgba(226, 19, 57, 0.03);
                    border-radius: 0 0.5rem 0.5rem 0;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                }

                /* Links */
                .article-body a { 
                    color: #111;
                    text-decoration: underline; 
                    text-decoration-color: rgba(226, 19, 57, 0.4);
                    text-decoration-thickness: 1px;
                    text-underline-offset: 4px;
                    font-weight: 700; 
                    transition: all 0.2s ease;
                }
                .article-body a:hover {
                    color: #E21339;
                    text-decoration-color: #E21339;
                    background: rgba(226, 19, 57, 0.05);
                }

                /* Images inside content */
                .article-body img {
                    width: 100%;
                    height: auto;
                    border-radius: 0.75rem;
                    margin: 3.5rem 0;
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
                }

                /* Inline Code */
                .article-body :not(pre) > code {
                    background: #f3f4f6;
                    color: #E21339;
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                    font-family: 'SF Mono', 'Menlo', monospace;
                    font-size: 0.85em;
                    font-weight: 500;
                    border: 1px solid #e5e7eb;
                }
            `}</style>
        </div>
    );
};

export default BlogDetail;