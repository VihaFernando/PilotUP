import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatDate, extractTextFromHTML } from '../utils/helpers';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Seo from '../components/SEO';

const BlogFeed = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
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
        } finally {
            setLoading(false);
        }
    };

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        extractTextFromHTML(blog.content).toLowerCase().includes(searchQuery.toLowerCase())
    );

    // --- Loading Skeleton ---
    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9FB]">
                <Navbar showAnnouncement={false} scrolled={true} setScrolled={() => {}} />
                <div className="max-w-[1200px] mx-auto pt-40 px-6">
                    <div className="h-12 w-1/3 bg-gray-200 animate-pulse mb-12 rounded" />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-[400px] bg-gray-200 animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const featuredBlog = filteredBlogs[0];
    const remainingBlogs = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-[#fff] text-[#111]">
            <Seo
                title="Blog"
                description="PilotUP blog: AI workflows, automation, and building your AI workforce. Tips and insights for scaling with AI employees."
                canonical="/blog"
                type="website"
            />
             {/* Font Import */}
             <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300&display=swap');`}
            </style>

            <Navbar showAnnouncement={false} scrolled={scrolled} setScrolled={setScrolled} />
            
            <main className="pt-32 pb-24 px-6 max-w-[1200px] mx-auto">
                
                {/* --- HEADER: NYT Style --- */}
                <div className="border-b border-black mb-16 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-3xl">
                        <span className="block font-sans text-xs font-bold tracking-[0.2em] text-[#E21339] mb-4 uppercase">
                            The Journal
                        </span>
                        <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tight leading-none text-gray-900">
                            Thinking <span className="italic font-light text-gray-400">Forward.</span>
                        </h1>
                        <p className="mt-6 text-lg text-gray-500 max-w-xl font-serif leading-relaxed">
                            Insights, engineering deep-dives, and stories from the frontier of AI and product development.
                        </p>
                    </div>

                    {/* Minimal Search */}
                    <div className="w-full md:w-64 relative group">
                        <input 
                            type="text" 
                            placeholder="Search articles..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-b border-gray-300 py-2 pl-0 pr-8 text-sm focus:outline-none focus:border-black transition-colors font-sans placeholder:text-gray-400"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute right-0 top-2.5" />
                    </div>
                </div>

                {filteredBlogs.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-serif italic text-xl">
                        No stories found.
                    </div>
                ) : (
                    <>
                        {/* --- FEATURED ARTICLE (Hero) --- */}
                        {featuredBlog && (
                            <section className="mb-20">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => navigate(`/blog/${featuredBlog.slug}`)}
                                    className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                                >
                                    {/* Image Side */}
                                    <div className="lg:col-span-8 relative overflow-hidden rounded-sm">
                                        <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                                            {featuredBlog.cover_url && (
                                                <img 
                                                    src={featuredBlog.cover_url} 
                                                    alt={featuredBlog.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content Side */}
                                    <div className="lg:col-span-4 flex flex-col justify-center h-full pt-2">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-2 h-2 bg-[#E21339] rounded-full"></span>
                                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">Featured Story</span>
                                        </div>
                                        
                                        <h2 className="text-3xl md:text-4xl font-serif font-bold leading-[1.2] mb-4 group-hover:text-[#E21339] transition-colors">
                                            {featuredBlog.title}
                                        </h2>
                                        
                                        <p className="text-gray-500 font-serif leading-relaxed mb-6 line-clamp-3 text-[1.05rem]">
                                            {extractTextFromHTML(featuredBlog.content, 180)}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-4 w-full">
                                            <div className="flex items-center gap-2 text-xs font-sans text-gray-400 font-medium">
                                                <span>{formatDate(featuredBlog.created_at)}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>{calculateReadTime(featuredBlog.content)} min read</span>
                                            </div>
                                            <span className="text-[#E21339] font-sans text-xs font-bold uppercase flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Read Now <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </section>
                        )}

                        {/* --- ARTICLE GRID (Editorial Style) --- */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 border-t border-black pt-16">
                            {remainingBlogs.map((blog, idx) => (
                                <motion.article 
                                    key={blog.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => navigate(`/blog/${blog.slug}`)}
                                    className="group cursor-pointer flex flex-col h-full"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-[3/2] mb-6 overflow-hidden bg-gray-100 rounded-sm">
                                        {blog.cover_url && (
                                            <img 
                                                src={blog.cover_url} 
                                                alt={blog.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                        {/* Subtle overlay on hover */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-grow">
                                        <div className="mb-3 flex items-center gap-2">
                                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-1 rounded-sm">
                                                Article
                                            </span>
                                        </div>

                                        <h3 className="font-serif text-xl font-bold leading-tight mb-3 group-hover:text-[#E21339] transition-colors">
                                            {blog.title}
                                        </h3>

                                        <p className="text-gray-500 font-serif text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                            {extractTextFromHTML(blog.content, 120)}
                                        </p>

                                        {/* Footer Meta */}
                                        <div className="flex items-center gap-4 text-xs text-gray-400 font-sans font-medium pt-4 border-t border-gray-100 mt-auto">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(blog.created_at)}
                                            </div>
                                            <span>{calculateReadTime(blog.content)} min read</span>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

// Function to calculate read time
const calculateReadTime = (content) => {
    return Math.max(1, Math.ceil(content.replace(/<[^>]+>/g, '').split(' ').length / 250));
};

export default BlogFeed;