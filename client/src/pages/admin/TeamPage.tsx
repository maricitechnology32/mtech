import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    Upload,
    User,
    Eye,
    EyeOff,
    Linkedin,
    Github,
    Twitter,
    Mail,
} from 'lucide-react';
import { teamAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface TeamMember {
    _id: string;
    name: string;
    position: string;
    bio: string;
    email: string;
    phone: string;
    photo: { url: string; publicId: string };
    socialLinks: { linkedin: string; github: string; twitter: string; website: string };
    department: string;
    isActive: boolean;
    order: number;
}

const departments = ['Leadership', 'Development', 'Design', 'Marketing', 'Sales', 'Support', 'Other'];

const TeamPage: React.FC = () => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '', position: '', bio: '', email: '', phone: '', department: 'Development',
        linkedin: '', github: '', twitter: '', website: '', order: 0,
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>('');

    useEffect(() => { fetchMembers(); }, []);

    const fetchMembers = async () => {
        try {
            const response = await teamAPI.getAll();
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching team members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (member?: TeamMember) => {
        if (member) {
            setEditingMember(member);
            setFormData({
                name: member.name, position: member.position, bio: member.bio || '',
                email: member.email || '', phone: member.phone || '', department: member.department || 'Development',
                linkedin: member.socialLinks?.linkedin || '', github: member.socialLinks?.github || '',
                twitter: member.socialLinks?.twitter || '', website: member.socialLinks?.website || '', order: member.order,
            });
            setPhotoPreview(member.photo?.url || '');
        } else {
            setEditingMember(null);
            setFormData({ name: '', position: '', bio: '', email: '', phone: '', department: 'Development', linkedin: '', github: '', twitter: '', website: '', order: 0 });
            setPhotoPreview('');
        }
        setPhotoFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingMember(null); setError(''); };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, String(value)));
            if (photoFile) formDataToSend.append('photo', photoFile);
            if (editingMember) await teamAPI.update(editingMember._id, formDataToSend);
            else await teamAPI.create(formDataToSend);
            await fetchMembers();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try { await teamAPI.delete(id); await fetchMembers(); setDeleteConfirm(null); } catch (err) { console.error('Error:', err); }
    };

    const toggleActive = async (member: TeamMember) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!member.isActive));
            await teamAPI.update(member._id, formData);
            await fetchMembers();
        } catch (err) { console.error('Error:', err); }
    };

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Team Members</h1>
                    <p className="text-gray-500 mt-1">Manage your team profiles</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <Plus size={18} />Add Member
                </button>
            </div>

            {members.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Member</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Department</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Contact</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {members.map((member) => (
                                <tr key={member._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {member.photo?.url ? (
                                                <img src={member.photo.url} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"><User size={18} className="text-gray-400" /></div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.position}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-gray-600">{member.department}</span></td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <div className="flex items-center gap-2">
                                            {member.email && <a href={`mailto:${member.email}`} className="text-gray-400 hover:text-gray-600"><Mail size={16} /></a>}
                                            {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600"><Linkedin size={16} /></a>}
                                            {member.socialLinks?.github && <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900"><Github size={16} /></a>}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleActive(member)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${member.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {member.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {member.isActive ? 'Active' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(member)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                                            <button onClick={() => setDeleteConfirm(member._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No team members yet</h3>
                    <p className="text-gray-500 mb-4">Add your team to the website</p>
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Plus size={18} />Add Member</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{editingMember ? 'Edit Member' : 'Add Member'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

                            <div className="flex items-center gap-4">
                                {photoPreview ? <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" /> : <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border border-dashed border-gray-300"><User className="w-6 h-6 text-gray-400" /></div>}
                                <label className="cursor-pointer"><span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"><Upload size={16} />{photoFile ? 'Change' : 'Upload'}</span><input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" /></label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Position *</label><input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Developer" /></div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label><select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{departments.map((d) => <option key={d} value={d}>{d}</option>)}</select></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label><textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label><input type="url" value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label><input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{editingMember ? 'Save' : 'Add'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Member?</h3>
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

export default TeamPage;
