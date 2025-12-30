import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Pencil, Trash2, X, Loader2, Eye, EyeOff, Star, MapPin } from 'lucide-react';
import { careersAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    salary: { min?: number; max?: number; currency: string; isVisible: boolean };
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    skills: string[];
    applicationEmail: string;
    applicationUrl: string;
    deadline: string;
    isActive: boolean;
    isFeatured: boolean;
    order: number;
    createdAt: string;
}

const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'HR', 'Finance', 'Other'];
const types = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];
const levels = ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Manager'];

const CareersPage: React.FC = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCareer, setEditingCareer] = useState<Career | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '', department: 'Engineering', location: '', type: 'Full-time', experience: 'Mid Level',
        salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryVisible: false,
        description: '', requirements: '', responsibilities: '', benefits: '', skills: '',
        applicationEmail: '', applicationUrl: '', deadline: '', isFeatured: false, order: 0
    });

    useEffect(() => { fetchCareers(); }, []);

    const fetchCareers = async () => {
        try {
            const response = await careersAPI.getAll({ active: 'false' } as any);
            setCareers(response.data);
        } catch (error) { console.error('Error:', error); }
        finally { setIsLoading(false); }
    };

    const openModal = (career?: Career) => {
        if (career) {
            setEditingCareer(career);
            setFormData({
                title: career.title, department: career.department, location: career.location,
                type: career.type, experience: career.experience,
                salaryMin: career.salary?.min?.toString() || '', salaryMax: career.salary?.max?.toString() || '',
                salaryCurrency: career.salary?.currency || 'USD', salaryVisible: career.salary?.isVisible || false,
                description: career.description, requirements: career.requirements.join(', '),
                responsibilities: career.responsibilities.join(', '), benefits: career.benefits.join(', '),
                skills: career.skills.join(', '), applicationEmail: career.applicationEmail || '',
                applicationUrl: career.applicationUrl || '',
                deadline: career.deadline ? new Date(career.deadline).toISOString().split('T')[0] : '',
                isFeatured: career.isFeatured, order: career.order
            });
        } else {
            setEditingCareer(null);
            setFormData({
                title: '', department: 'Engineering', location: '', type: 'Full-time', experience: 'Mid Level',
                salaryMin: '', salaryMax: '', salaryCurrency: 'USD', salaryVisible: false,
                description: '', requirements: '', responsibilities: '', benefits: '', skills: '',
                applicationEmail: '', applicationUrl: '', deadline: '', isFeatured: false, order: 0
            });
        }
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingCareer(null); setError(''); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            if (editingCareer) await careersAPI.update(editingCareer._id, formData);
            else await careersAPI.create(formData);
            await fetchCareers();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await careersAPI.delete(id); await fetchCareers(); setDeleteConfirm(null); }
        catch (err) { console.error('Error:', err); }
    };

    const toggleActive = async (career: Career) => {
        try {
            await careersAPI.update(career._id, { isActive: !career.isActive });
            await fetchCareers();
        } catch (err) { console.error('Error:', err); }
    };

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Careers</h1>
                    <p className="text-gray-500 mt-1">Manage job openings and positions</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <Plus size={18} />Add Job
                </button>
            </div>

            {careers.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Position</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Department</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Location</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Type</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {careers.map((career) => (
                                <tr key={career._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <Briefcase size={18} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    {career.title}
                                                    {career.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                                </p>
                                                <p className="text-xs text-gray-500">{career.experience}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-gray-600">{career.department}</span></td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex items-center gap-1 text-sm text-gray-600"><MapPin size={14} />{career.location}</div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell text-center">
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{career.type}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleActive(career)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${career.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {career.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {career.isActive ? 'Open' : 'Closed'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(career)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                                            <button onClick={() => setDeleteConfirm(career._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No job openings yet</h3>
                    <p className="text-gray-500 mb-4">Add positions to attract talent</p>
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Plus size={18} />Add Job</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{editingCareer ? 'Edit Job' : 'Add Job'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Senior Frontend Developer" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label><select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{departments.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{types.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label><input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="New York, USA" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label><select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{levels.map((l) => <option key={l} value={l}>{l}</option>)}</select></div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary</label><input type="number" value={formData.salaryMin} onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="50000" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary</label><input type="number" value={formData.salaryMax} onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="80000" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label><input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={3} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Job description..." /></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements (comma separated)</label><input type="text" value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="5+ years experience, React, Node.js" /></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Skills (comma separated)</label><input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="React, TypeScript, Node.js" /></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Benefits (comma separated)</label><input type="text" value={formData.benefits} onChange={(e) => setFormData({ ...formData, benefits: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Health insurance, Stock options" /></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Application Email</label><input type="email" value={formData.applicationEmail} onChange={(e) => setFormData({ ...formData, applicationEmail: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="careers@company.com" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Application URL</label><input type="url" value={formData.applicationUrl} onChange={(e) => setFormData({ ...formData, applicationUrl: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://apply.company.com" /></div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-gray-700">Mark as featured position</span></label>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{editingCareer ? 'Save' : 'Add Job'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Job?</h3>
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

export default CareersPage;
