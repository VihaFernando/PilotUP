import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDate } from '../utils/helpers';
import { Calendar, ArrowLeft, Share2, Clock, Check } from 'lucide-react';
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
                    // FIX: Added max-w-[calc(100vw-2rem)] to prevent page blowout on mobile
                    <div className="my-10 rounded-xl overflow-hidden bg-[#1e1e1e] shadow-2xl border border-[#333] group max-w-[calc(100vw-2rem)] sm:max-w-full mx-auto">
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
                        
                        {/* FIX: Ensure scroll container has w-full */}
                        <div className="overflow-x-auto w-full">
                            <SyntaxHighlighter
                                language="javascript"
                                style={vscDarkPlus}
                                showLineNumbers={true}
                                wrapLines={false} // Ensure lines don't wrap weirdly, forcing horizontal scroll
                                customStyle={{
                                    margin: 0,
                                    padding: '1.5rem',
                                    background: 'transparent',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    fontFamily: "'SF Mono', 'JetBrains Mono', 'Fira Code', monospace",
                                    minWidth: '100%' // Ensures background covers full scroll width
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
            try { await navigator.share({ title: blog?.title, url: window.location.href }); } catch (err) {}
        } else {
            navigator.clipboard.writeText(window.location.href);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#F5F5F7]" />;
    if (!blog) return null;

    const readTime = Math.max(1, Math.ceil(blog.content.replace(/<[^>]+>/g, '').split(' ').length / 250));

    return (
        <div className="bg-[#F5F5F7] min-h-screen selection:bg-[#E21339] selection:text-white">
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&display=swap');`}
            </style>

            <Navbar showAnnouncement={false} scrolled={scrolled} setScrolled={setScrolled} />
            
            {/* Reading Progress Bar */}
            <motion.div className="fixed top-0 left-0 right-0 h-1 bg-[#E21339] origin-left z-[60]" style={{ scaleX }} />

            <main className="pt-32 pb-24 px-4 sm:px-6 max-w-[1100px] mx-auto overflow-hidden sm:overflow-visible">
                
                {/* --- Header Section --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="text-center max-w-4xl mx-auto mb-12"
                >
                    <span className="text-[#E21339] text-xs font-bold uppercase tracking-[0.2em] mb-6 inline-block font-sans bg-red-50 px-3 py-1 rounded-full">
                        Blog Post
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#1d1d1f] tracking-tight mb-8 font-sans leading-[1.1]">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium font-sans border-y border-gray-200 py-4 w-fit mx-auto px-8">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>{formatDate(blog.created_at)}</span></div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /><span>{readTime} min read</span></div>
                    </div>
                </motion.div>

                {/* --- Cover Image --- */}
                {blog.cover_url && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl mb-16 ring-1 ring-black/5"
                    >
                        <img src={blog.cover_url} alt={blog.title} className="w-full h-full object-cover" />
                    </motion.div>
                )}

                {/* --- Main Content Layout --- */}
                <div className="grid lg:grid-cols-[1fr_auto] gap-12 relative">
                    
                    {/* Article Body */}
                    <motion.article 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="article-body min-w-0 max-w-full lg:max-w-[720px] mx-auto lg:mx-0"
                    >
                        {parse(DOMPurify.sanitize(blog.content), parseOptions)}
                    </motion.article>

                    {/* Floating Sidebar */}
                    <aside className="hidden lg:block relative w-fit">
                        <div className="sticky top-32 flex flex-col gap-6 ml-4">
                            <div className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 rounded-full py-6 px-3 flex flex-col items-center gap-5">
                                <button 
                                    onClick={handleShare} 
                                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-[#E21339] hover:bg-red-50 transition-all group relative"
                                    title="Share Article"
                                >
                                    {linkCopied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                                </button>
                                
                                <div className="w-4 h-[1px] bg-gray-200"></div>
                                
                                <button 
                                    onClick={() => navigate('/blog')} 
                                    className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 hover:text-[#E21339] hover:bg-red-50 transition-all"
                                    title="Back to Blog"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Mobile Back Button */}
                <div className="lg:hidden mt-16 text-center border-t border-gray-200 pt-8">
                     <button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2 text-sm text-gray-600 font-bold hover:text-[#E21339] transition-colors uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to All Posts
                    </button>
                </div>
            </main>

            {/* --- GLOBAL CSS FOR CONTENT --- */}
            <style jsx global>{`
                /* Font Settings */
                .article-body { 
                    font-family: 'Merriweather', 'Georgia', serif; 
                    color: #242424; 
                    line-height: 1.9; 
                    font-size: 1.125rem;
                    text-rendering: optimizeLegibility;
                    word-wrap: break-word; /* Prevents long text from overflowing */
                }

                /* Paragraphs */
                .article-body p { 
                    margin-bottom: 2em; 
                    font-weight: 400;
                    color: #2d2d2d;
                }

                /* Headings */
                .article-body h2 { 
                    font-family: 'Merriweather', 'Georgia', serif;
                    font-size: 1.875rem; 
                    font-weight: 900; 
                    margin: 2.5em 0 1em; 
                    color: #111;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                }
                
                .article-body h3 { 
                    font-family: 'Merriweather', 'Georgia', serif;
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    margin: 2em 0 0.8em; 
                    color: #111;
                    line-height: 1.4;
                }

                /* Lists (Crucial for Documentation) */
                .article-body ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-bottom: 2rem;
                    color: #333;
                }
                .article-body ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-bottom: 2rem;
                    color: #333;
                }
                .article-body li {
                    margin-bottom: 0.75em;
                    padding-left: 0.5rem;
                }

                /* Links */
                .article-body a { 
                    color: #111;
                    text-decoration: underline; 
                    text-decoration-color: rgba(226, 19, 57, 0.4);
                    text-underline-offset: 4px;
                    font-weight: 700; 
                    transition: all 0.2s;
                }
                .article-body a:hover {
                    color: #E21339;
                    text-decoration-color: #E21339;
                    background: rgba(226, 19, 57, 0.05);
                }

                /* Italic/Quotes */
                .article-body em, .article-body i {
                    font-style: italic;
                    color: #444;
                }
                
                .article-body blockquote {
                    border-left: 4px solid #E21339;
                    padding-left: 1.5rem;
                    margin: 2.5rem 0;
                    font-style: italic;
                    color: #4a4a4a;
                    font-size: 1.35rem;
                    line-height: 1.6;
                    background: transparent;
                }

                /* Images inside content */
                .article-body img {
                    width: 100%;
                    height: auto;
                    border-radius: 12px;
                    margin: 3rem 0;
                    box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.1);
                }

                /* Inline Code */
                .article-body :not(pre) > code {
                    background: rgba(226, 19, 57, 0.08);
                    color: #c4102e;
                    padding: 0.2rem 0.4rem;
                    border-radius: 6px;
                    font-family: 'SF Mono', 'Menlo', monospace;
                    font-size: 0.85em;
                    font-weight: 500;
                    border: 1px solid rgba(226, 19, 57, 0.1);
                    word-break: break-word;
                }
            `}</style>
        </div>
    );
};

export default BlogDetail;