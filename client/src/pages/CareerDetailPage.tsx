import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowLeft, Users, CheckCircle, Loader2, Upload, X, DollarSign } from 'lucide-react';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    salary?: { min?: number; max?: number; currency: string; isVisible: boolean };
    description: string;
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
    skills: string[];
    applicationEmail: string;
    applicationUrl: string;
    deadline: string;
    isFeatured: boolean;
}

const experienceOptions = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
const sourceOptions = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'Other'];

export default function CareerDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [career, setCareer] = useState<Career | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState('');

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        coverLetter: '', linkedIn: '', portfolio: '', experience: '',
        currentCompany: '', noticePeriod: '', expectedSalary: '',
        howDidYouHear: '', additionalNotes: ''
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchCareer = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/careers/${id}`);
                if (!response.ok) throw new Error('Career not found');
                const data = await response.json();
                setCareer(data);
            } catch (err) {
                setError('Position not found');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchCareer();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const formDataToSend = new FormData();
            formDataToSend.append('careerId', id!);
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });
            if (resumeFile) formDataToSend.append('resume', resumeFile);

            const response = await fetch(`${apiUrl}/applications`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            setSubmitSuccess(data.trackingId);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                coverLetter: '', linkedIn: '', portfolio: '', experience: '',
                currentCompany: '', noticePeriod: '', expectedSalary: '',
                howDidYouHear: '', additionalNotes: ''
            });
            setResumeFile(null);
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !career) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Position Not Found</h1>
                    <p className="text-gray-600 mb-4">This job posting may have been removed or is no longer available.</p>
                    <Link to="/#careers" className="text-blue-600 hover:text-blue-700 font-medium">← Back to Careers</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <Link to="/#careers" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                        <ArrowLeft size={16} /> Back to all positions
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Briefcase className="text-blue-600" size={24} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{career.title}</h1>
                                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1"><Users size={14} /> {career.department}</span>
                                        <span className="flex items-center gap-1"><MapPin size={14} /> {career.location}</span>
                                        <span className="flex items-center gap-1"><Clock size={14} /> {career.type}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">{career.experience}</span>
                                        {career.salary?.isVisible && career.salary.min && (
                                            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded flex items-center gap-1">
                                                <DollarSign size={10} />
                                                {career.salary.min.toLocaleString()}{career.salary.max ? ` - ${career.salary.max.toLocaleString()}` : '+'} {career.salary.currency}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">About the Role</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{career.description}</p>
                        </div>

                        {/* Requirements */}
                        {career.requirements?.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
                                <ul className="space-y-2">
                                    {career.requirements.map((req, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                            <CheckCircle size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                                            {req}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Responsibilities */}
                        {career.responsibilities?.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h2>
                                <ul className="space-y-2">
                                    {career.responsibilities.map((resp, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            {resp}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Benefits */}
                        {career.benefits?.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
                                <div className="flex flex-wrap gap-2">
                                    {career.benefits.map((benefit, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                            {benefit}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
                            <button
                                onClick={() => setShowApplyModal(true)}
                                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Apply for this Position
                            </button>

                            {career.deadline && (
                                <p className="text-center text-sm text-gray-500 mt-3">
                                    Application deadline: {new Date(career.deadline).toLocaleDateString()}
                                </p>
                            )}

                            {career.skills?.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-900 mb-2">Required Skills</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {career.skills.map((skill, idx) => (
                                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <Link to="/track-application" className="text-sm text-blue-600 hover:text-blue-700">
                                    Already applied? Track your application →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Apply Modal */}
            {showApplyModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] overflow-y-auto my-8">
                        {submitSuccess ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                                <p className="text-gray-600 mb-4">Your application has been received. Save your tracking ID:</p>
                                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                    <p className="text-2xl font-mono font-bold text-blue-600">{submitSuccess}</p>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Use this ID along with your email to track your application status.</p>
                                <button onClick={() => { setShowApplyModal(false); setSubmitSuccess(null); }} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Apply for {career.title}</h2>
                                        <p className="text-sm text-gray-500">{career.department} • {career.location}</p>
                                    </div>
                                    <button onClick={() => setShowApplyModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                    {submitError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{submitError}</div>}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                            <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                            <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Resume *</label>
                                        <label className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 rounded-lg py-4 cursor-pointer hover:border-blue-400">
                                            <Upload size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">{resumeFile ? resumeFile.name : 'Upload resume (PDF, DOC, DOCX)'}</span>
                                            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} required className="hidden" />
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                            <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select</option>
                                                {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                                            <select value={formData.howDidYouHear} onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option value="">Select</option>
                                                {sourceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                            <input type="url" value={formData.linkedIn} onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/..." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio/Website</label>
                                            <input type="url" value={formData.portfolio} onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://..." />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
                                        <textarea value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} rows={4} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Why are you interested in this role?" />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setShowApplyModal(false)} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Submit Application
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
