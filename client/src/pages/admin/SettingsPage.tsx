import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, Loader2, Building2, Mail, Phone, MapPin, Globe, Clock } from 'lucide-react';
import { settingsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        companyName: '',
        tagline: '',
        email: '',
        phone: '',
        address: '',
        businessHours: '',
        googleMapsUrl: '',
        footerText: '',
        seoTitle: '',
        seoDescription: '',
        socialLinks: {
            linkedin: '',
            github: '',
            twitter: '',
            facebook: '',
            instagram: '',
        },
        stats: {
            projectsCount: '',
            projectsLabel: '',
            clientsCount: '',
            clientsLabel: '',
            experienceCount: '',
            experienceLabel: '',
            ratingCount: '',
            ratingLabel: '',
        },
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const response = await settingsAPI.get();
            setFormData({
                companyName: response.data.companyName || '',
                tagline: response.data.tagline || '',
                email: response.data.email || '',
                phone: response.data.phone || '',
                address: response.data.address || '',
                businessHours: response.data.businessHours || '',
                googleMapsUrl: response.data.googleMapsUrl || '',
                footerText: response.data.footerText || '',
                seoTitle: response.data.seoTitle || '',
                seoDescription: response.data.seoDescription || '',
                socialLinks: {
                    linkedin: response.data.socialLinks?.linkedin || '',
                    github: response.data.socialLinks?.github || '',
                    twitter: response.data.socialLinks?.twitter || '',
                    facebook: response.data.socialLinks?.facebook || '',
                    instagram: response.data.socialLinks?.instagram || '',
                },
                stats: {
                    projectsCount: response.data.stats?.projectsCount || '500+',
                    projectsLabel: response.data.stats?.projectsLabel || 'Projects Delivered',
                    clientsCount: response.data.stats?.clientsCount || '200+',
                    clientsLabel: response.data.stats?.clientsLabel || 'Happy Clients',
                    experienceCount: response.data.stats?.experienceCount || '15+',
                    experienceLabel: response.data.stats?.experienceLabel || 'Years Experience',
                    ratingCount: response.data.stats?.ratingCount || '4.9',
                    ratingLabel: response.data.stats?.ratingLabel || 'Client Rating',
                },
            });
        } catch (err) {
            console.error('Failed to fetch settings:', err);
            setError('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSaveSuccess(false);

        try {
            await settingsAPI.update(formData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to save settings:', err);
            setError('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateSocialLink = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value },
        }));
    };

    const updateStats = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            stats: { ...prev.stats, [field]: value },
        }));
    };

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
                        <p className="text-gray-500 mt-1">Manage your website's general settings and information</p>
                    </div>
                </div>

                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        Settings saved successfully!
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Building2 size={20} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Company Information</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => updateFormData('companyName', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => updateFormData('tagline', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail size={20} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-1"><Mail size={14} /> Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateFormData('email', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-1"><Phone size={14} /> Phone</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => updateFormData('phone', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> Address</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateFormData('address', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <span className="flex items-center gap-1"><Clock size={14} /> Business Hours</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessHours}
                                        onChange={(e) => updateFormData('businessHours', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
                                    <input
                                        type="url"
                                        value={formData.googleMapsUrl}
                                        onChange={(e) => updateFormData('googleMapsUrl', e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://maps.google.com/..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Globe size={20} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.linkedin}
                                    onChange={(e) => updateSocialLink('linkedin', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.github}
                                    onChange={(e) => updateSocialLink('github', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) => updateSocialLink('twitter', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.facebook}
                                    onChange={(e) => updateSocialLink('facebook', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                <input
                                    type="url"
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => updateSocialLink('instagram', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Stats */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <SettingsIcon size={20} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Company Stats</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">These stats are displayed in the Hero section and Partners section of your website.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Projects Count</label>
                                <input
                                    type="text"
                                    value={formData.stats.projectsCount}
                                    onChange={(e) => updateStats('projectsCount', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="500+"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Projects Label</label>
                                <input
                                    type="text"
                                    value={formData.stats.projectsLabel}
                                    onChange={(e) => updateStats('projectsLabel', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Projects Delivered"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clients Count</label>
                                <input
                                    type="text"
                                    value={formData.stats.clientsCount}
                                    onChange={(e) => updateStats('clientsCount', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="200+"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Clients Label</label>
                                <input
                                    type="text"
                                    value={formData.stats.clientsLabel}
                                    onChange={(e) => updateStats('clientsLabel', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Happy Clients"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Count</label>
                                <input
                                    type="text"
                                    value={formData.stats.experienceCount}
                                    onChange={(e) => updateStats('experienceCount', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="15+"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Label</label>
                                <input
                                    type="text"
                                    value={formData.stats.experienceLabel}
                                    onChange={(e) => updateStats('experienceLabel', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Years Experience"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating Count</label>
                                <input
                                    type="text"
                                    value={formData.stats.ratingCount}
                                    onChange={(e) => updateStats('ratingCount', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="4.9"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating Label</label>
                                <input
                                    type="text"
                                    value={formData.stats.ratingLabel}
                                    onChange={(e) => updateStats('ratingLabel', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Client Rating"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SEO Settings */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <SettingsIcon size={20} className="text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">SEO & Footer</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                                <input
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={(e) => updateFormData('seoTitle', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                                <textarea
                                    value={formData.seoDescription}
                                    onChange={(e) => updateFormData('seoDescription', e.target.value)}
                                    rows={2}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Text</label>
                                <input
                                    type="text"
                                    value={formData.footerText}
                                    onChange={(e) => updateFormData('footerText', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
