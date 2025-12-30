import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/admin" replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">M</span>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
                    <p className="text-gray-500 mt-1">Sign in to manage your website</p>
                </div>

                {/* Form */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border border-gray-300 rounded-lg py-2.5 px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                        >
                            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Protected area. Authorized access only.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
