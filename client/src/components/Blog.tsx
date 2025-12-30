import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, ArrowRight, User, Loader2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage?: { url: string };
    category: string;
    author: { name: string };
    readTime: number;
    publishedAt: string;
    isFeatured: boolean;
}

export default function Blog() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const featuredRef = useRef<HTMLAnchorElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/blogs?limit=6`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setBlogs(data);
                } else {
                    setBlogs([]);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setBlogs([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // GSAP Animations
    useEffect(() => {
        if (isLoading || !sectionRef.current || blogs.length === 0) return;

        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Featured post animation (from left)
            gsap.fromTo(
                featuredRef.current,
                { opacity: 0, x: -50, scale: 0.95 },
                {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: featuredRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none',
                    },
                }
            );

            // Other posts stagger (from right)
            const listItems = listRef.current?.children;
            if (listItems) {
                gsap.fromTo(
                    listItems,
                    { opacity: 0, x: 50 },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: listRef.current,
                            start: 'top 80%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [isLoading, blogs.length]);

    if (!isLoading && blogs.length === 0) return null;

    if (isLoading) {
        return (
            <section id="blog" className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                </div>
            </section>
        );
    }

    const featuredBlog = blogs.find(b => b.isFeatured) || blogs[0];
    const otherBlogs = blogs.filter(b => b._id !== featuredBlog?._id).slice(0, 4);

    return (
        <section ref={sectionRef} id="blog" className="py-24 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 opacity-0">
                    <div>
                        <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Blog</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Latest Insights</h2>
                    </div>
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group"
                    >
                        View All Posts <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Featured Post */}
                    {featuredBlog && (
                        <a
                            ref={featuredRef}
                            href={`/blog/${featuredBlog.slug}`}
                            className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 opacity-0"
                        >
                            <div className="relative h-64 bg-gray-100 overflow-hidden">
                                {featuredBlog.featuredImage?.url ? (
                                    <img
                                        src={featuredBlog.featuredImage.url}
                                        alt={featuredBlog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
                                        <span className="text-white/50 text-4xl font-bold">Marici Technology</span>
                                    </div>
                                )}
                                <span className="absolute top-4 left-4 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                                    {featuredBlog.category}
                                </span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {featuredBlog.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{featuredBlog.excerpt}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <User size={12} /> {featuredBlog.author?.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {featuredBlog.readTime} min read
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(featuredBlog.publishedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        </a>
                    )}

                    {/* Other Posts */}
                    <div ref={listRef} className="space-y-4">
                        {otherBlogs.map((blog) => (
                            <a
                                key={blog._id}
                                href={`/blog/${blog.slug}`}
                                className="group flex gap-4 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-x-1 opacity-0"
                            >
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                    {blog.featuredImage?.url ? (
                                        <img
                                            src={blog.featuredImage.url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span className="text-xs text-blue-600 font-medium">{blog.category}</span>
                                    <h4 className="text-sm font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock size={10} /> {blog.readTime} min
                                        </span>
                                        <span>
                                            {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
