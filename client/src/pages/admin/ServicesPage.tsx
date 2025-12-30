import React, { useState, useEffect } from 'react';
import {
    Layers,
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    Eye,
    EyeOff,
    Code2,
    Smartphone,
    Brain,
    Palette,
    ShoppingCart,
    Globe,
    Settings,
    Zap,
} from 'lucide-react';
import { servicesAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Service {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    icon: string;
    features: string[];
    gradient: string;
    isActive: boolean;
    order: number;
    createdAt: string;
}

const iconOptions = [
    { name: 'Code2', icon: Code2 },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Brain', icon: Brain },
    { name: 'Palette', icon: Palette },
    { name: 'ShoppingCart', icon: ShoppingCart },
    { name: 'Globe', icon: Globe },
    { name: 'Settings', icon: Settings },
    { name: 'Zap', icon: Zap },
    { name: 'Layers', icon: Layers },
];

const ServicesPage: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        icon: 'Code2',
        features: '',
        gradient: 'from-blue-500 to-blue-700',
        order: 0,
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await servicesAPI.getAll();
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                title: service.title,
                description: service.description,
                shortDescription: service.shortDescription || '',
                icon: service.icon || 'Code2',
                features: service.features.join(', '),
                gradient: service.gradient || 'from-blue-500 to-blue-700',
                order: service.order,
            });
        } else {
            setEditingService(null);
            setFormData({
                title: '',
                description: '',
                shortDescription: '',
                icon: 'Code2',
                features: '',
                gradient: 'from-blue-500 to-blue-700',
                order: 0,
            });
        }
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setError('');
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

            if (editingService) {
                await servicesAPI.update(editingService._id, formDataToSend);
            } else {
                await servicesAPI.create(formDataToSend);
            }

            await fetchServices();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await servicesAPI.delete(id);
            await fetchServices();
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting service:', err);
        }
    };

    const toggleActive = async (service: Service) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!service.isActive));
            await servicesAPI.update(service._id, formData);
            await fetchServices();
        } catch (err) {
            console.error('Error toggling active status:', err);
        }
    };

    const getIconComponent = (iconName: string) => {
        const iconObj = iconOptions.find((i) => i.name === iconName);
        return iconObj ? iconObj.icon : Code2;
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
                    <p className="text-gray-500 mt-1">Manage your service offerings</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Service
                </button>
            </div>

            {/* Services Table */}
            {services.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Service</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Features</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => {
                                const IconComponent = getIconComponent(service.icon);
                                return (
                                    <tr key={service._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center`}>
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{service.title}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-xs">{service.shortDescription || service.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {service.features.slice(0, 3).map((f, i) => (
                                                    <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{f}</span>
                                                ))}
                                                {service.features.length > 3 && (
                                                    <span className="text-xs text-gray-400">+{service.features.length - 3}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => toggleActive(service)}
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${service.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                                                    }`}
                                            >
                                                {service.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {service.isActive ? 'Active' : 'Draft'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openModal(service)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                                                    <Pencil size={16} />
                                                </button>
                                                <button onClick={() => setDeleteConfirm(service._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No services yet</h3>
                    <p className="text-gray-500 mb-4">Add services to display on your website</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Service
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingService ? 'Edit Service' : 'Add Service'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
                            )}

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {iconOptions.map((opt) => {
                                        const IconComp = opt.icon;
                                        return (
                                            <button
                                                key={opt.name}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon: opt.name })}
                                                className={`p-3 rounded-lg border transition-all flex items-center justify-center ${formData.icon === opt.name
                                                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                                                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                    }`}
                                            >
                                                <IconComp size={20} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Web Development"
                                />
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    maxLength={150}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description"
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Features (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Responsive, SEO, Fast"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Detailed description..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editingService ? 'Save Changes' : 'Add Service'}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Service?</h3>
                        <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ServicesPage;
