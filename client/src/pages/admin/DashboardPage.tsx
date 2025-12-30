import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Star,
    MessageSquare,
    FolderKanban,
    Layers,
    Users,
    Building2,
    ArrowUpRight,
    Loader2,
    Plus,
} from 'lucide-react';
import { testimonialsAPI, contactsAPI, projectsAPI, servicesAPI, teamAPI, clientsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Stats {
    testimonials: { total: number; average: number };
    contacts: { total: number; unread: number };
    projects: { total: number; featured: number };
    services: { total: number; active: number };
    team: { total: number; active: number };
    clients: { total: number; featured: number };
}

interface Contact {
    _id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
    isRead: boolean;
}

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<Stats>({
        testimonials: { total: 0, average: 0 },
        contacts: { total: 0, unread: 0 },
        projects: { total: 0, featured: 0 },
        services: { total: 0, active: 0 },
        team: { total: 0, active: 0 },
        clients: { total: 0, featured: 0 },
    });
    const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [
                testimonialStats,
                contactStats,
                projectStats,
                serviceStats,
                teamStats,
                clientStats,
                contacts,
            ] = await Promise.all([
                testimonialsAPI.getStats(),
                contactsAPI.getStats(),
                projectsAPI.getStats(),
                servicesAPI.getStats(),
                teamAPI.getStats(),
                clientsAPI.getStats(),
                contactsAPI.getAll(),
            ]);

            setStats({
                testimonials: {
                    total: testimonialStats.data.total || 0,
                    average: testimonialStats.data.averageRating || 0,
                },
                contacts: {
                    total: contactStats.data.total || 0,
                    unread: contactStats.data.unread || 0,
                },
                projects: {
                    total: projectStats.data.total || 0,
                    featured: projectStats.data.featured || 0,
                },
                services: {
                    total: serviceStats.data.total || 0,
                    active: serviceStats.data.active || 0,
                },
                team: {
                    total: teamStats.data.total || 0,
                    active: teamStats.data.active || 0,
                },
                clients: {
                    total: clientStats.data.total || 0,
                    featured: clientStats.data.featured || 0,
                },
            });

            setRecentContacts(contacts.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Projects',
            value: stats.projects.total,
            subtitle: `${stats.projects.featured} featured`,
            icon: FolderKanban,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            link: '/admin/projects',
        },
        {
            title: 'Services',
            value: stats.services.total,
            subtitle: `${stats.services.active} active`,
            icon: Layers,
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            link: '/admin/services',
        },
        {
            title: 'Team',
            value: stats.team.total,
            subtitle: `${stats.team.active} active`,
            icon: Users,
            color: 'text-violet-600',
            bgColor: 'bg-violet-50',
            link: '/admin/team',
        },
        {
            title: 'Clients',
            value: stats.clients.total,
            subtitle: `${stats.clients.featured} featured`,
            icon: Building2,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            link: '/admin/clients',
        },
        {
            title: 'Testimonials',
            value: stats.testimonials.total,
            subtitle: `${stats.testimonials.average.toFixed(1)} avg rating`,
            icon: Star,
            color: 'text-rose-600',
            bgColor: 'bg-rose-50',
            link: '/admin/testimonials',
        },
        {
            title: 'Inquiries',
            value: stats.contacts.total,
            subtitle: `${stats.contacts.unread} unread`,
            icon: MessageSquare,
            color: 'text-cyan-600',
            bgColor: 'bg-cyan-50',
            link: '/admin/contacts',
        },
    ];

    const quickActions = [
        { label: 'Add Project', icon: FolderKanban, link: '/admin/projects', color: 'text-blue-600' },
        { label: 'Add Service', icon: Layers, link: '/admin/services', color: 'text-emerald-600' },
        { label: 'Add Team Member', icon: Users, link: '/admin/team', color: 'text-violet-600' },
        { label: 'Add Client', icon: Building2, link: '/admin/clients', color: 'text-amber-600' },
    ];

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
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Overview of your website content</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        to={card.link}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                <card.icon className={card.color} size={20} />
                            </div>
                            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                        <p className="text-sm text-gray-500">{card.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{card.subtitle}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Quick Actions</h2>
                    <div className="space-y-2">
                        {quickActions.map((action) => (
                            <Link
                                key={action.label}
                                to={action.link}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                    <Plus size={16} className={action.color} />
                                </div>
                                <span className="text-sm text-gray-700 font-medium">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Inquiries */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Recent Inquiries</h2>
                        <Link to="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentContacts.length > 0 ? (
                            recentContacts.map((contact) => (
                                <div key={contact._id} className="px-5 py-3 flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${contact.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{contact.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-400 flex-shrink-0">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="px-5 py-8 text-center">
                                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No inquiries yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default DashboardPage;
