import React, { useState, useEffect } from 'react';
import {
    FolderKanban,
    Plus,
    Pencil,
    Trash2,
    X,
    Loader2,
    Upload,
    ExternalLink,
    Github,
    Star,
    Eye,
    EyeOff,
} from 'lucide-react';
import { projectsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Project {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    client: string;
    category: string;
    technologies: string[];
    featuredImage: { url: string; publicId: string };
    liveUrl: string;
    githubUrl: string;
    isFeatured: boolean;
    isActive: boolean;
    order: number;
    createdAt: string;
}

const categories = ['Web Development', 'Mobile App', 'AI/ML', 'UI/UX Design', 'E-Commerce', 'Other'];

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        client: '',
        category: 'Web Development',
        technologies: '',
        liveUrl: '',
        githubUrl: '',
        isFeatured: false,
        order: 0,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (project?: Project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                shortDescription: project.shortDescription || '',
                client: project.client || '',
                category: project.category,
                technologies: project.technologies.join(', '),
                liveUrl: project.liveUrl || '',
                githubUrl: project.githubUrl || '',
                isFeatured: project.isFeatured,
                order: project.order,
            });
            setImagePreview(project.featuredImage?.url || '');
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                shortDescription: '',
                client: '',
                category: 'Web Development',
                technologies: '',
                liveUrl: '',
                githubUrl: '',
                isFeatured: false,
                order: 0,
            });
            setImagePreview('');
        }
        setImageFile(null);
        setError('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProject(null);
        setError('');
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
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

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            if (editingProject) {
                await projectsAPI.update(editingProject._id, formDataToSend);
            } else {
                await projectsAPI.create(formDataToSend);
            }

            await fetchProjects();
            closeModal();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await projectsAPI.delete(id);
            await fetchProjects();
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting project:', err);
        }
    };

    const toggleActive = async (project: Project) => {
        try {
            const formData = new FormData();
            formData.append('isActive', String(!project.isActive));
            await projectsAPI.update(project._id, formData);
            await fetchProjects();
        } catch (err) {
            console.error('Error toggling active status:', err);
        }
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
                    <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
                    <p className="text-gray-500 mt-1">Manage your portfolio and case studies</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={18} />
                    Add Project
                </button>
            </div>

            {/* Projects Table */}
            {projects.length > 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Project</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden md:table-cell">Category</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3 hidden lg:table-cell">Client</th>
                                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {projects.map((project) => (
                                <tr key={project._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            {project.featuredImage?.url ? (
                                                <img src={project.featuredImage.url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <FolderKanban size={18} className="text-gray-400" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                    {project.title}
                                                    {project.isFeatured && <Star size={14} className="text-amber-500 fill-amber-500" />}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate max-w-xs">{project.shortDescription || project.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span className="text-sm text-gray-600">{project.category}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden lg:table-cell">
                                        <span className="text-sm text-gray-600">{project.client || '-'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => toggleActive(project)}
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${project.isActive
                                                    ? 'bg-green-50 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {project.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            {project.isActive ? 'Active' : 'Draft'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                    <ExternalLink size={16} />
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                                    <Github size={16} />
                                                </a>
                                            )}
                                            <button onClick={() => openModal(project)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100">
                                                <Pencil size={16} />
                                            </button>
                                            <button onClick={() => setDeleteConfirm(project._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                    <FolderKanban className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Showcase your work by adding projects</p>
                    <button
                        onClick={() => openModal()}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Add Project
                    </button>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {editingProject ? 'Edit Project' : 'Add Project'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Featured Image</label>
                                <div className="flex items-center gap-4">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-20 h-14 rounded-lg object-cover border border-gray-200" />
                                    ) : (
                                        <div className="w-20 h-14 bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
                                            <FolderKanban className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                    <label className="cursor-pointer">
                                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                            <Upload size={16} />
                                            {imageFile ? 'Change' : 'Upload'}
                                        </span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                </div>
                            </div>

                            {/* Title & Category */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Project Title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Client & Technologies */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Client</label>
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Client name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Technologies</label>
                                    <input
                                        type="text"
                                        value={formData.technologies}
                                        onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="React, Node.js, MongoDB"
                                    />
                                </div>
                            </div>

                            {/* URLs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            {/* Short Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description</label>
                                <input
                                    type="text"
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    maxLength={200}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief description for cards"
                                />
                            </div>

                            {/* Full Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={3}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Detailed project description..."
                                />
                            </div>

                            {/* Featured */}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Mark as featured project</span>
                            </label>

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
                                    {editingProject ? 'Save Changes' : 'Add Project'}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project?</h3>
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

export default ProjectsPage;
