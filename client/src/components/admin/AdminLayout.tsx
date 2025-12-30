import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LayoutDashboard,
    MessageSquare,
    Star,
    LogOut,
    Menu,
    X,
    ChevronDown,
    FolderKanban,
    Layers,
    Users,
    Building2,
    Briefcase,
    FileText,
    ClipboardList,
    Settings,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const { admin, logout } = useAuth();

    const navItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/admin/projects', icon: FolderKanban, label: 'Projects' },
        { path: '/admin/services', icon: Layers, label: 'Services' },
        { path: '/admin/blogs', icon: FileText, label: 'Blog' },
        { path: '/admin/team', icon: Users, label: 'Team' },
        { path: '/admin/clients', icon: Building2, label: 'Clients' },
        { path: '/admin/careers', icon: Briefcase, label: 'Careers' },
        { path: '/admin/applications', icon: ClipboardList, label: 'Applications' },
        { path: '/admin/testimonials', icon: Star, label: 'Testimonials' },
        { path: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
                <div className="flex items-center justify-between h-full px-4 lg:px-6">
                    {/* Left: Logo & Mobile Menu */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        <Link to="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">M</span>
                            </div>
                            <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                                Marici Technology Admin
                            </span>
                        </Link>
                    </div>

                    {/* Right: User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium text-sm">
                                    {admin?.username?.charAt(0).toUpperCase() || 'A'}
                                </span>
                            </div>
                            <span className="hidden sm:block font-medium">{admin?.username}</span>
                            <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">{admin?.username}</p>
                                        <p className="text-xs text-gray-500">{admin?.email}</p>
                                    </div>
                                    <div className="p-1">
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Sidebar */}
            <aside
                className={`
                    fixed top-16 left-0 bottom-0 w-60 bg-white border-r border-gray-200 z-40
                    transform transition-transform duration-200 ease-in-out
                    lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <nav className="p-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${isActive(item.path, item.exact)
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }
                            `}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* View Site Link */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        View Live Site →
                    </a>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="pt-16 lg:pl-60">
                <div className="p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
