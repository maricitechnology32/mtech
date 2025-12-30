import React, { useState, useEffect } from 'react';
import { Building2, Plus, Pencil, Trash2, X, Loader2, Upload, Eye, EyeOff, Star, ExternalLink } from 'lucide-react';
import { clientsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Client {
    _id: string;
    name: string;
    industry: string;
    logo: { url: string; publicId: string };
    website: string;
    description: string;
    isFeatured: boolean;
    isActive: boolean;
    order: number;
}

const industries = ['Technology', 'Financial Services', 'Healthcare', 'Retail', 'Education', 'Logistics', 'Energy', 'Media', 'Manufacturing', 'Real Estate', 'Other'];

const ClientsPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', industry: 'Technology', website: '', description: '', isFeatured: false, order: 0 });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');

    useEffect(() => { fetchClients(); }, []);

    const fetchClients = async () => {
        try { const response = await clientsAPI.getAll(); setClients(response.data); }
        catch (error) { console.error('Error:', error); }
        finally { setIsLoading(false); }
    };

    const openModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setFormData({ name: client.name, industry: client.industry || 'Technology', website: client.website || '', description: client.description || '', isFeatured: client.isFeatured, order: client.order });
            setLogoPreview(client.logo?.url || '');
        } else {
            setEditingClient(null);
            setFormData({ name: '', industry: 'Technology', website: '', description: '', isFeatured: false, order: 0 });
            setLogoPreview('');
        }
        setLogoFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingClient(null); setError(''); };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) { setLogoFile(file); setLogoPreview(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, String(value)));
            if (logoFile) formDataToSend.append('logo', logoFile);
            if (editingClient) await clientsAPI.update(editingClient._id, formDataToSend);
            else await clientsAPI.create(formDataToSend);
            await fetchClients();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id: string) => {
        try { await clientsAPI.delete(id); await fetchClients(); setDeleteConfirm(null); } catch (err) { console.error('Error:', err); }
    };

    const toggleActive = async (client: Client) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!client.isActive));
            await clientsAPI.update(client._id, formData);
            await fetchClients();
        } catch (err) { console.error('Error:', err); }
    };

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Clients & Partners</h1>
                    <p className="text-gray-500 mt-1">Manage your client logos and partnerships</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                    <Plus size={18} />Add Client
                </button>
            </div>

            {clients.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Client</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Industry</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Featured</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {clients.map((client) => (
                                <tr key={client._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {client.logo?.url ? (
                                                <img src={client.logo.url} alt="" className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center"><Building2 size={18} className="text-gray-400" /></div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{client.name}</p>
                                                {client.website && <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1"><ExternalLink size={10} />Website</a>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-gray-600">{client.industry}</span></td>
                                    <td className="px-4 py-3 text-center">
                                        {client.isFeatured ? <Star size={16} className="text-amber-500 fill-amber-500 mx-auto" /> : <span className="text-gray-300">-</span>}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => toggleActive(client)} className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${client.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {client.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {client.isActive ? 'Active' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => openModal(client)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100"><Pencil size={16} /></button>
                                            <button onClick={() => setDeleteConfirm(client._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No clients yet</h3>
                    <p className="text-gray-500 mb-4">Add your clients and partners</p>
                    <button onClick={() => openModal()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"><Plus size={18} />Add Client</button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">{editingClient ? 'Edit Client' : 'Add Client'}</h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

                            <div className="flex items-center gap-4">
                                {logoPreview ? <img src={logoPreview} alt="Preview" className="w-16 h-12 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1" /> : <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300"><Building2 className="w-5 h-5 text-gray-400" /></div>}
                                <label className="cursor-pointer"><span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg"><Upload size={16} />{logoFile ? 'Change' : 'Upload Logo'}</span><input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" /></label>
                            </div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Acme Inc." /></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label><select value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">{industries.map((i) => <option key={i} value={i}>{i}</option>)}</select></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Website</label><input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://example.com" /></div>

                            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>

                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-gray-700">Mark as featured client</span></label>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">{isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}{editingClient ? 'Save' : 'Add Client'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Client?</h3>
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

export default ClientsPage;
