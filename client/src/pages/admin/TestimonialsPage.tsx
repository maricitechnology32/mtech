import React, { useState, useEffect } from 'react';
import { Star, Plus, Pencil, Trash2, X, Loader2, Upload, Eye, EyeOff, Quote } from 'lucide-react';
import { testimonialsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Testimonial {
    _id: string;
    name: string;
    position: string;
    company: string;
    testimonial: string;
    rating: number;
    image: { url: string; publicId: string };
    isActive: boolean;
    createdAt: string;
}

const TestimonialsPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', position: '', company: '', testimonial: '', rating: 5 });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        try { const response = await testimonialsAPI.getAll(); setTestimonials(response.data); }
        catch (error) { console.error('Error:', error); }
        finally { setIsLoading(false); }
    };

    const openModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial);
            setFormData({ name: testimonial.name, position: testimonial.position, company: testimonial.company, testimonial: testimonial.testimonial, rating: testimonial.rating });
            setImagePreview(testimonial.image?.url || '');
        } else {
            setEditingTestimonial(null);
            setFormData({ name: '', position: '', company: '', testimonial: '', rating: 5 });
            setImagePreview('');
        }
        setImageFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingTestimonial(null); setError(''); };

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
            Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, String(value)));
            if (imageFile) formDataToSend.append('image', imageFile);
            if (editingTestimonial) await testimonialsAPI.update(editingTestimonial._id, formDataToSend);
            else await testimonialsAPI.create(formDataToSend);
            await fetchTestimonials();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await testimonialsAPI.delete(id); await fetchTestimonials(); setDeleteConfirm(null); } catch (err) { console.error('Error:', err); }
    };

    const toggleActive = async (testimonial: Testimonial) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!testimonial.isActive));
            await testimonialsAPI.update(testimonial._id, formData);
            await fetchTestimonials();
        } catch (err) { console.error('Error:', err); }
    };

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Testimonials</h1>
                    <p className="text-gray-500 mt-1">Manage customer reviews and feedback</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <Plus size={18} />Add Testimonial
                </button>
            </div>

            {testimonials.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Customer</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Testimonial</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Rating</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {testimonial.image?.url ? <img src={testimonial.image.url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><Quote size={16} className="text-gray-400" /></div>}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{testimonial.name}</p>
                                                <p className="text-xs text-gray-500">{testimonial.position}, {testimonial.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <p className="text-sm text-gray-600 truncate max-w-md italic">"{testimonial.testimonial}"</p>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-0.5">
                                            {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleActive(testimonial)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${testimonial.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {testimonial.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {testimonial.isActive ? 'Active' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(testimonial)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                                            <button onClick={() => setDeleteConfirm(testimonial._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No testimonials yet</h3>
                    <p className="text-gray-500 mb-4">Add customer reviews to build trust</p>
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Plus size={18} />Add Testimonial</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

                            <div className="flex items-center gap-4">
                                {imagePreview ? <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" /> : <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300"><Quote className="w-6 h-6 text-gray-400" /></div>}
                                <label className="cursor-pointer"><span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"><Upload size={16} />{imageFile ? 'Change' : 'Upload Photo'}</span><input type="file" accept="image/*" onChange={handleImageChange} className="hidden" /></label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company *</label><input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Position *</label><input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="CEO, Manager, etc." /></div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <button key={n} type="button" onClick={() => setFormData({ ...formData, rating: n })} className="p-1">
                                            <Star size={24} className={n <= formData.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Testimonial *</label><textarea value={formData.testimonial} onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })} required rows={4} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="What did they say about your service?" /></div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{editingTestimonial ? 'Save' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Testimonial?</h3>
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

export default TestimonialsPage;
