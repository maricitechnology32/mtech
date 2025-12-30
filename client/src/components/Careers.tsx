import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight, Loader2, Search, X, Upload, CheckCircle } from 'lucide-react';

interface Career {
    _id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description: string;
    skills: string[];
    isFeatured: boolean;
    isActive: boolean;
}

const experienceOptions = ['0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'];
const sourceOptions = ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Job Board', 'Other'];

export default function Careers() {
    const [careers, setCareers] = useState<Career[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('All');

    // Resume modal state
    const [showResumeModal, setShowResumeModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState('');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '',
        coverLetter: '', linkedIn: '', portfolio: '', experience: '',
        howDidYouHear: ''
    });

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const response = await fetch(`${apiUrl}/careers`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                if (data && Array.isArray(data) && data.length > 0) {
                    setCareers(data);
                } else {
                    setCareers([]);
                }
            } catch (error) {
                console.error('Error fetching careers:', error);
                setCareers([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCareers();
    }, []);

    const handleResumeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value) formDataToSend.append(key, value);
            });
            if (resumeFile) formDataToSend.append('resume', resumeFile);

            const response = await fetch(`${apiUrl}/applications/general`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit resume');
            }

            setSubmitSuccess(data.trackingId);
            setFormData({
                firstName: '', lastName: '', email: '', phone: '',
                coverLetter: '', linkedIn: '', portfolio: '', experience: '',
                howDidYouHear: ''
            });
            setResumeFile(null);
        } catch (err: any) {
            setSubmitError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowResumeModal(false);
        setSubmitSuccess(null);
        setSubmitError('');
    };

    if (!isLoading && careers.length === 0) return null;

    const departments = ['All', ...new Set(careers.map((c) => c.department))];
    const filteredCareers = selectedDepartment === 'All' ? careers : careers.filter((c) => c.department === selectedDepartment);

    if (isLoading) {
        return (
            <section id="careers" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section id="careers" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                    <div>
                        <p className="text-blue-600 font-medium text-sm uppercase tracking-wide mb-2">Join Our Team</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Career Opportunities</h2>
                        <p className="text-gray-600 mt-2">Be part of our mission to build amazing digital experiences.</p>
                    </div>
                    <Link
                        to="/track-application"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Search size={16} />
                        Track Application
                    </Link>
                </div>

                {/* Department Filter */}
                <div className="flex flex-wrap gap-2 mb-10">
                    {departments.map((dept) => (
                        <button
                            key={dept}
                            onClick={() => setSelectedDepartment(dept)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDepartment === dept
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {filteredCareers.map((career) => (
                        <Link
                            key={career._id}
                            to={`/careers/${career._id}`}
                            className="group block bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                                        <Briefcase className="text-blue-600" size={22} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{career.title}</h3>
                                            {career.isFeatured && (
                                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Featured</span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{career.description}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap items-center gap-3 mt-3">
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                <MapPin size={12} /> {career.location}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                <Clock size={12} /> {career.type}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">{career.department}</span>
                                            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">{career.experience}</span>
                                        </div>

                                        {/* Skills Preview */}
                                        {career.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {career.skills.slice(0, 4).map((skill, idx) => (
                                                    <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">{skill}</span>
                                                ))}
                                                {career.skills.length > 4 && (
                                                    <span className="text-xs text-gray-400">+{career.skills.length - 4} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                                        View & Apply <ArrowRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Don't see a good fit?</h3>
                        <p className="text-gray-600 mb-4">
                            We're always interested in meeting talented people. Send us your resume!
                        </p>
                        <button
                            onClick={() => setShowResumeModal(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Send Your Resume
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Submission Modal */}
            {showResumeModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl w-full max-w-lg max-h-[95vh] overflow-y-auto my-8">
                        {submitSuccess ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-green-600" size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">Resume Submitted!</h2>
                                <p className="text-gray-600 mb-4">Thank you for your interest. We'll reach out if there's a good fit.</p>
                                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                                    <p className="text-xs text-gray-500 mb-1">Your Tracking ID</p>
                                    <p className="text-xl font-mono font-bold text-blue-600">{submitSuccess}</p>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Save this ID to track your submission status.</p>
                                <button onClick={closeModal} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
                                    Done
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Submit Your Resume</h2>
                                        <p className="text-sm text-gray-500">We'd love to hear from you</p>
                                    </div>
                                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                                </div>
                                <form onSubmit={handleResumeSubmit} className="p-5 space-y-4">
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                                        <input type="url" value={formData.linkedIn} onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://linkedin.com/in/..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter / Message</label>
                                        <textarea value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Tell us about yourself and your interests..." />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={closeModal} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                                        <button type="submit" disabled={isSubmitting} className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Submit Resume
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}

