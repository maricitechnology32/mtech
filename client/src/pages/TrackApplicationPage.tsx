import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, CheckCircle, Clock, Calendar, Briefcase, MapPin, ArrowLeft, AlertCircle } from 'lucide-react';

interface Application {
    trackingId: string;
    status: string;
    position: string;
    department: string;
    location: string;
    appliedAt: string;
    interviewDate?: string;
}

const statusColors: Record<string, string> = {
    submitted: 'bg-blue-100 text-blue-700',
    reviewing: 'bg-yellow-100 text-yellow-700',
    shortlisted: 'bg-purple-100 text-purple-700',
    interview: 'bg-cyan-100 text-cyan-700',
    offered: 'bg-green-100 text-green-700',
    hired: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
    submitted: 'Application Submitted',
    reviewing: 'Under Review',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    offered: 'Offer Extended',
    hired: 'Hired',
    rejected: 'Not Selected',
};

export default function TrackApplicationPage() {
    const [mode, setMode] = useState<'single' | 'all'>('single');
    const [trackingId, setTrackingId] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [singleResult, setSingleResult] = useState<Application | null>(null);
    const [allResults, setAllResults] = useState<Application[]>([]);

    const handleTrackSingle = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSingleResult(null);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/applications/track`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackingId, email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Application not found');
            }

            setSingleResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGetAll = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setAllResults([]);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/applications/my-applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to retrieve applications');
            }

            if (data.length === 0) {
                setError('No applications found for this email address.');
            } else {
                setAllResults(data);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <Link to="/#careers" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm">
                        <ArrowLeft size={16} /> Back to Careers
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="text-blue-600" size={28} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Application</h1>
                    <p className="text-gray-600">Enter your details to check the status of your job application</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center gap-2 mb-8">
                    <button
                        onClick={() => { setMode('single'); setError(''); setSingleResult(null); setAllResults([]); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'single' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Track by ID
                    </button>
                    <button
                        onClick={() => { setMode('all'); setError(''); setSingleResult(null); setAllResults([]); }}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${mode === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        All My Applications
                    </button>
                </div>

                {/* Track Single Form */}
                {mode === 'single' && (
                    <form onSubmit={handleTrackSingle} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID *</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                    required
                                    placeholder="APP-XXXXXXXX-XXXXXX"
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={18} />}
                                Track Application
                            </button>
                        </div>
                    </form>
                )}

                {/* Get All Applications Form */}
                {mode === 'all' && (
                    <form onSubmit={handleGetAll} className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={18} />}
                                Find My Applications
                            </button>
                        </div>
                    </form>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Single Result */}
                {singleResult && (
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
                                    <p className="font-mono font-medium text-gray-900">{singleResult.trackingId}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[singleResult.status]}`}>
                                    {statusLabels[singleResult.status]}
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Briefcase size={16} />
                                    <span className="text-sm font-medium">{singleResult.position}</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{singleResult.department}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} />{singleResult.location}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Calendar size={14} />
                                    Applied: {new Date(singleResult.appliedAt).toLocaleDateString()}
                                </div>
                                {singleResult.interviewDate && (
                                    <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                                        <Clock size={14} />
                                        Interview: {new Date(singleResult.interviewDate).toLocaleDateString()} at {new Date(singleResult.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* All Results */}
                {allResults.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Your Applications ({allResults.length})</h3>
                        {allResults.map((app) => (
                            <div key={app.trackingId} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{app.position}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span>{app.department}</span>
                                            <span className="flex items-center gap-1"><MapPin size={12} />{app.location}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                                        {statusLabels[app.status]}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">ID: {app.trackingId}</p>
                                    <p className="text-xs text-gray-500">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
