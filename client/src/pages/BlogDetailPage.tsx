import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Share2, Loader2 } from 'lucide-react';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: { url: string };
    category: string;
    tags: string[];
    author: { name: string; avatar?: string };
    readTime: number;
    views: number;
    publishedAt: string;
}

export default function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/blogs/${slug}`);
                if (!response.ok) throw new Error('Blog not found');
                const data = await response.json();
                setBlog(data);
            } catch (err) {
                setError('Blog post not found');
            } finally {
                setIsLoading(false);
            }
        };
        if (slug) fetchBlog();
    }, [slug]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
                    <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
                <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Back</span>
                    </Link>
                    <button
                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Copy link"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="pt-24 pb-16">
                <article className="max-w-4xl mx-auto px-4">
                    {/* Category & Meta */}
                    <div className="mb-6">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full mb-4">
                            {blog.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                            {blog.title}
                        </h1>
                        {blog.excerpt && (
                            <p className="text-xl text-gray-600 leading-relaxed">{blog.excerpt}</p>
                        )}
                    </div>

                    {/* Author & Date */}
                    <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100 mb-8">
                        <div className="flex items-center gap-3">
                            {blog.author?.avatar ? (
                                <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="text-blue-600" size={18} />
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-gray-900">{blog.author?.name}</p>
                                <p className="text-xs text-gray-500">Author</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {blog.readTime} min read
                            </span>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {blog.featuredImage?.url && (
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <img
                                src={blog.featuredImage.url}
                                alt={blog.title}
                                className="w-full h-auto"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div
                        className="prose prose-lg prose-blue max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl prose-img:mx-auto prose-img:my-8
              prose-blockquote:border-l-blue-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
              prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:text-gray-100"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* Tags */}
                    {blog.tags?.length > 0 && (
                        <div className="mt-12 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2">
                                {blog.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </footer>
        </div>
    );
}
