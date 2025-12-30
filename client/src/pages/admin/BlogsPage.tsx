import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    FileText, Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff, Star, Upload, Image as ImageIcon
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { blogsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage?: { url: string; publicId: string };
    category: string;
    tags: string[];
    author: { name: string };
    readTime: number;
    views: number;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string;
    createdAt: string;
}

const categories = ['Technology', 'Development', 'Design', 'Business', 'News', 'Tutorial', 'Case Study', 'Other'];

const BlogsPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const quillRef = useRef<ReactQuill>(null);

    const [formData, setFormData] = useState({
        title: '', slug: '', excerpt: '', content: '', category: 'Technology',
        tags: '', authorName: 'Admin', isPublished: false, isFeatured: false,
        metaTitle: '', metaDescription: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        try {
            const response = await blogsAPI.getAll({ published: 'false' } as any);
            setBlogs(response.data);
        } catch (error) { console.error('Error:', error); }
        finally { setIsLoading(false); }
    };

    // Image upload handler for Quill editor
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            setIsUploading(true);
            try {
                const formData = new FormData();
                formData.append('image', file);
                const response = await blogsAPI.uploadImage(formData);

                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', response.data.url);
                    quill.setSelection({ index: range.index + 1, length: 0 });
                }
            } catch (err) {
                console.error('Image upload failed:', err);
                alert('Failed to upload image. Please try again.');
            } finally {
                setIsUploading(false);
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, 4, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'align': [] }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        },
        clipboard: { matchVisual: false }
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'indent', 'align',
        'blockquote', 'code-block', 'link', 'image', 'video'
    ];

    const openModal = (blog?: Blog) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title, slug: blog.slug, excerpt: blog.excerpt || '',
                content: blog.content, category: blog.category, tags: blog.tags.join(', '),
                authorName: blog.author?.name || 'Admin', isPublished: blog.isPublished,
                isFeatured: blog.isFeatured, metaTitle: '', metaDescription: ''
            });
            setImagePreview(blog.featuredImage?.url || '');
        } else {
            setEditingBlog(null);
            setFormData({
                title: '', slug: '', excerpt: '', content: '', category: 'Technology',
                tags: '', authorName: 'Admin', isPublished: false, isFeatured: false,
                metaTitle: '', metaDescription: ''
            });
            setImagePreview('');
        }
        setImageFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingBlog(null); setError(''); };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                formDataToSend.append(key, String(value));
            });
            if (imageFile) formDataToSend.append('featuredImage', imageFile);

            if (editingBlog) await blogsAPI.update(editingBlog._id, formDataToSend);
            else await blogsAPI.create(formDataToSend);
            await fetchBlogs();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await blogsAPI.delete(id); await fetchBlogs(); setDeleteConfirm(null); }
        catch (err) { console.error('Error:', err); }
    };

    const togglePublish = async (blog: Blog) => {
        try {
            const formData = new FormData();
            formData.append('isPublished', String(!blog.isPublished));
            await blogsAPI.update(blog._id, formData);
            await fetchBlogs();
        } catch (err) { console.error('Error:', err); }
    };

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Blog Posts</h1>
                    <p className="text-gray-500 mt-1">Manage your blog content and articles</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <Plus size={18} />New Post
                </button>
            </div>

            {blogs.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Post</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Views</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {blogs.map((blog) => (
                                <tr key={blog._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {blog.featuredImage?.url ? (
                                                <img src={blog.featuredImage.url} alt="" className="w-12 h-9 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center"><FileText size={16} className="text-gray-400" /></div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    {blog.title}
                                                    {blog.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                                </p>
                                                <p className="text-xs text-gray-500">{blog.readTime} min read • {blog.author?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{blog.category}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell text-center">
                                        <span className="text-sm text-gray-600">{blog.views}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => togglePublish(blog)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${blog.isPublished ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {blog.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {blog.isPublished ? 'Published' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(blog)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                                            <button onClick={() => setDeleteConfirm(blog._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No blog posts yet</h3>
                    <p className="text-gray-500 mb-4">Start creating content for your audience</p>
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Plus size={18} />New Post</button>
                </div>
            )}

            {/* Blog Editor Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{editingBlog ? 'Edit Post' : 'New Post'}</h2>
                            <div className="flex items-center gap-2">
                                {isUploading && <span className="text-xs text-blue-600 flex items-center gap-1"><Loader2 size={14} className="animate-spin" />Uploading image...</span>}
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

                            {/* Featured Image */}
                            <div className="flex items-center gap-4">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-24 h-16 rounded-lg object-cover border border-gray-200" />
                                ) : (
                                    <div className="w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300"><ImageIcon className="w-6 h-6 text-gray-400" /></div>
                                )}
                                <div>
                                    <label className="cursor-pointer">
                                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"><Upload size={16} />Featured Image</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px</p>
                                </div>
                            </div>

                            {/* Title & Slug */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your blog post title" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                                    <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="auto-generated-from-title" />
                                </div>
                            </div>

                            {/* Category & Tags */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
                                    <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="react, nodejs, web" />
                                </div>
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Excerpt</label>
                                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} maxLength={500} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Brief description shown in listings..." />
                            </div>

                            {/* Rich Text Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                    <ReactQuill
                                        ref={quillRef}
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(content) => setFormData({ ...formData, content })}
                                        modules={modules}
                                        formats={formats}
                                        className="bg-white"
                                        style={{ minHeight: '300px' }}
                                        placeholder="Write your blog content here... Use the image button in the toolbar to insert images."
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Click the image icon in the toolbar to insert images between paragraphs</p>
                            </div>

                            {/* Options */}
                            <div className="flex flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">Publish immediately</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-700">Mark as featured</span>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingBlog ? 'Update Post' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post?</h3>
                        <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BlogsPage;
