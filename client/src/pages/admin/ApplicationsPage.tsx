import React, { useState, useEffect } from 'react';
import { ClipboardList, Search, Filter, Loader2, Eye, Trash2, X, Calendar, Mail, Phone, Briefcase, MapPin, FileText, ExternalLink, Clock } from 'lucide-react';
import { applicationsAPI, careersAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
}

interface Application {
    _id: string;
    career: Career;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resume?: {
        url: string;
        filename: string;
    };
    coverLetter?: string;
    linkedIn?: string;
    portfolio?: string;
    experience?: string;
    currentCompany?: string;
    noticePeriod?: string;
    expectedSalary?: string;
    howDidYouHear?: string;
    additionalNotes?: string;
    status: string;
    trackingId: string;
    adminNotes?: string;
    interviewDate?: string;
    isGeneralSubmission?: boolean;
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    total: number;
    submitted: number;
    reviewing: number;
    shortlisted: number;
    interview: number;
    offered: number;
    hired: number;
    rejected: number;
}

const statusOptions = [
    { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
    { value: 'reviewing', label: 'Reviewing', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-100 text-purple-700' },
    { value: 'interview', label: 'Interview', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'offered', label: 'Offered', color: 'bg-green-100 text-green-700' },
    { value: 'hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
];

const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-700';
};

const getStatusLabel = (status: string) => {
    return statusOptions.find(s => s.value === status)?.label || status;
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [careers, setCareers] = useState<Career[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCareer, setFilterCareer] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Modal states
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Update form
    const [updateForm, setUpdateForm] = useState({
        status: '',
        adminNotes: '',
        interviewDate: '',
    });

    useEffect(() => {
        fetchData();
    }, [filterStatus, filterCareer]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const params: { status?: string; career?: string } = {};
            if (filterStatus) params.status = filterStatus;
            if (filterCareer) params.career = filterCareer;

            const [appsRes, careersRes, statsRes] = await Promise.all([
                applicationsAPI.getAll(params),
                careersAPI.getAll(),
                applicationsAPI.getStats(),
            ]);

            setApplications(appsRes.data);
            setCareers(careersRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openDetailModal = (app: Application) => {
        setSelectedApplication(app);
        setShowDetailModal(true);
    };

    const openUpdateModal = (app: Application) => {
        setSelectedApplication(app);
        setUpdateForm({
            status: app.status,
            adminNotes: app.adminNotes || '',
            interviewDate: app.interviewDate ? new Date(app.interviewDate).toISOString().slice(0, 16) : '',
        });
        setShowUpdateModal(true);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedApplication) return;

        try {
            setIsUpdating(true);
            await applicationsAPI.update(selectedApplication._id, {
                status: updateForm.status,
                adminNotes: updateForm.adminNotes,
                interviewDate: updateForm.interviewDate || null,
            });
            setShowUpdateModal(false);
            fetchData();
        } catch (error) {
            console.error('Failed to update application:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            return;
        }

        try {
            await applicationsAPI.delete(id);
            fetchData();
        } catch (error) {
            console.error('Failed to delete application:', error);
        }
    };

    const filteredApplications = applications.filter(app => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            app.firstName.toLowerCase().includes(search) ||
            app.lastName.toLowerCase().includes(search) ||
            app.email.toLowerCase().includes(search) ||
            app.trackingId.toLowerCase().includes(search) ||
            app.career?.title?.toLowerCase().includes(search)
        );
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
                        <p className="text-gray-500 mt-1">Manage and review candidate applications</p>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                        <div className="bg-white border border-gray-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-blue-700">{stats.submitted}</p>
                            <p className="text-xs text-blue-600">Submitted</p>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-yellow-700">{stats.reviewing}</p>
                            <p className="text-xs text-yellow-600">Reviewing</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-purple-700">{stats.shortlisted}</p>
                            <p className="text-xs text-purple-600">Shortlisted</p>
                        </div>
                        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-cyan-700">{stats.interview}</p>
                            <p className="text-xs text-cyan-600">Interview</p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-green-700">{stats.offered}</p>
                            <p className="text-xs text-green-600">Offered</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-emerald-700">{stats.hired}</p>
                            <p className="text-xs text-emerald-600">Hired</p>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
                            <p className="text-xs text-red-600">Rejected</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or tracking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={18} className="text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                {statusOptions.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Career Filter */}
                        <select
                            value={filterCareer}
                            onChange={(e) => setFilterCareer(e.target.value)}
                            className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Positions</option>
                            {careers.map(c => (
                                <option key={c._id} value={c._id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Applications List */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No applications found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredApplications.map((app) => (
                            <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-blue-600 font-medium">
                                                    {app.firstName.charAt(0)}{app.lastName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{app.firstName} {app.lastName}</h3>
                                                <p className="text-sm text-gray-500">{app.email}</p>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase size={14} />
                                                        {app.isGeneralSubmission ? (
                                                            <span className="text-purple-600 font-medium">General Submission</span>
                                                        ) : (
                                                            app.career?.title || 'Unknown Position'
                                                        )}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={14} />
                                                        {new Date(app.createdAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                        {app.trackingId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                                            {getStatusLabel(app.status)}
                                        </span>
                                        <button
                                            onClick={() => openDetailModal(app)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => openUpdateModal(app)}
                                            className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            Update Status
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app._id)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetailModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Application Details</h2>
                                <p className="text-sm text-gray-500 font-mono">{selectedApplication.trackingId}</p>
                            </div>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-6">
                            {/* Applicant Info */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Applicant Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{selectedApplication.firstName} {selectedApplication.lastName}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                                            {getStatusLabel(selectedApplication.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} />
                                        <a href={`mailto:${selectedApplication.email}`} className="text-blue-600 hover:underline">{selectedApplication.email}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone size={14} />
                                        <span>{selectedApplication.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Position Info */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Position Applied</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {selectedApplication.isGeneralSubmission ? (
                                        <div className="flex items-center gap-2 text-purple-600">
                                            <Briefcase size={14} />
                                            <span className="font-medium">General Submission</span>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 text-gray-900">
                                                <Briefcase size={14} />
                                                <span className="font-medium">{selectedApplication.career?.title}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                                                <span>{selectedApplication.career?.department}</span>
                                                <span className="flex items-center gap-1"><MapPin size={12} />{selectedApplication.career?.location}</span>
                                                <span>{selectedApplication.career?.type}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Professional Details */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Professional Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedApplication.experience && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Experience</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedApplication.experience}</p>
                                        </div>
                                    )}
                                    {selectedApplication.currentCompany && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Current Company</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedApplication.currentCompany}</p>
                                        </div>
                                    )}
                                    {selectedApplication.noticePeriod && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Notice Period</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedApplication.noticePeriod}</p>
                                        </div>
                                    )}
                                    {selectedApplication.expectedSalary && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500">Expected Salary</p>
                                            <p className="text-sm font-medium text-gray-900">{selectedApplication.expectedSalary}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Links */}
                            <div className="flex flex-wrap gap-3">
                                {selectedApplication.resume?.url && (
                                    <a
                                        href={selectedApplication.resume.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                    >
                                        <FileText size={16} />
                                        View Resume
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {selectedApplication.linkedIn && (
                                    <a
                                        href={selectedApplication.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                    >
                                        LinkedIn
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                                {selectedApplication.portfolio && (
                                    <a
                                        href={selectedApplication.portfolio}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                                    >
                                        Portfolio
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>

                            {/* Cover Letter */}
                            {selectedApplication.coverLetter && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Cover Letter</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 whitespace-pre-line">
                                        {selectedApplication.coverLetter}
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes */}
                            {selectedApplication.adminNotes && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-3">Admin Notes</h3>
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line">
                                        {selectedApplication.adminNotes}
                                    </div>
                                </div>
                            )}

                            {/* Interview Date */}
                            {selectedApplication.interviewDate && (
                                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                                    <Calendar size={16} />
                                    Interview scheduled: {new Date(selectedApplication.interviewDate).toLocaleDateString()} at {new Date(selectedApplication.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            )}

                            {/* Timestamps */}
                            <div className="flex gap-6 text-xs text-gray-400 pt-4 border-t border-gray-100">
                                <span>Applied: {new Date(selectedApplication.createdAt).toLocaleString()}</span>
                                <span>Last Updated: {new Date(selectedApplication.updatedAt).toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 p-5 border-t border-gray-200">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => { setShowDetailModal(false); openUpdateModal(selectedApplication); }}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                            >
                                Update Status
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Update Modal */}
            {showUpdateModal && selectedApplication && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Update Application</h2>
                                <p className="text-sm text-gray-500">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                            </div>
                            <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statusOptions.map(s => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={updateForm.interviewDate}
                                    onChange={(e) => setUpdateForm({ ...updateForm, interviewDate: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Internal)</label>
                                <textarea
                                    value={updateForm.adminNotes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, adminNotes: e.target.value })}
                                    rows={4}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Add internal notes about this candidate..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowUpdateModal(false)}
                                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
