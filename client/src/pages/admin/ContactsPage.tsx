import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2, X, Loader2, Mail, Phone, Calendar, Eye, EyeOff, Search, Check } from 'lucide-react';
import { contactsAPI } from '../../api';
import AdminLayout from '../../components/admin/AdminLayout';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    isRead: boolean;
    notes: string;
    createdAt: string;
}

const ContactsPage: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [search, setSearch] = useState('');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [isSavingNotes, setIsSavingNotes] = useState(false);

    useEffect(() => { fetchContacts(); }, []);

    const fetchContacts = async () => {
        try { const response = await contactsAPI.getAll(); setContacts(response.data); }
        catch (error) { console.error('Error:', error); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async (id: string) => {
        try {
            await contactsAPI.delete(id);
            await fetchContacts();
            setDeleteConfirm(null);
            if (selectedContact?._id === id) setSelectedContact(null);
        } catch (err) { console.error('Error:', err); }
    };

    const toggleRead = async (contact: Contact) => {
        try {
            await contactsAPI.toggleRead(contact._id);
            await fetchContacts();
            if (selectedContact?._id === contact._id) {
                setSelectedContact({ ...contact, isRead: !contact.isRead });
            }
        } catch (err) { console.error('Error:', err); }
    };

    const saveNotes = async () => {
        if (!selectedContact) return;
        setIsSavingNotes(true);
        try {
            await contactsAPI.updateNotes(selectedContact._id, notes);
            await fetchContacts();
        } catch (err) { console.error('Error:', err); }
        finally { setIsSavingNotes(false); }
    };

    const openContact = (contact: Contact) => {
        setSelectedContact(contact);
        setNotes(contact.notes || '');
        if (!contact.isRead) toggleRead(contact);
    };

    const filteredContacts = contacts
        .filter((c) => filter === 'all' || (filter === 'unread' ? !c.isRead : c.isRead))
        .filter((c) => search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

    const unreadCount = contacts.filter((c) => !c.isRead).length;

    if (isLoading) {
        return (<AdminLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 text-blue-600 animate-spin" /></div></AdminLayout>);
    }

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Contact Submissions</h1>
                    <p className="text-gray-500 mt-1">Manage inquiries from your contact form {unreadCount > 0 && <span className="text-blue-600">({unreadCount} unread)</span>}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contacts List */}
                <div className="lg:col-span-2">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search contacts..."
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                            {(['all', 'unread', 'read'] as const).map((f) => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium capitalize ${filter === f ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    {filteredContacts.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
                            {filteredContacts.map((contact) => (
                                <button
                                    key={contact._id}
                                    onClick={() => openContact(contact)}
                                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedContact?._id === contact._id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${contact.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-sm truncate ${contact.isRead ? 'text-gray-700' : 'text-gray-900 font-medium'}`}>{contact.name}</p>
                                                <span className="text-xs text-gray-400 flex-shrink-0">{new Date(contact.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                                            <p className="text-xs text-gray-400 mt-1 truncate">{contact.message}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">No contacts found</h3>
                            <p className="text-gray-500">{search ? 'Try a different search term' : 'No inquiries yet'}</p>
                        </div>
                    )}
                </div>

                {/* Contact Detail */}
                <div className="lg:col-span-1">
                    {selectedContact ? (
                        <div className="bg-white border border-gray-200 rounded-lg sticky top-24">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900">Details</h3>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => toggleRead(selectedContact)} className={`p-2 rounded-lg hover:bg-gray-100 ${selectedContact.isRead ? 'text-gray-400' : 'text-blue-600'}`}>
                                        {selectedContact.isRead ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                    <button onClick={() => setDeleteConfirm(selectedContact._id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100">
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => setSelectedContact(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 lg:hidden">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <p className="text-lg font-medium text-gray-900">{selectedContact.name}</p>
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <Mail size={14} />
                                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">{selectedContact.email}</a>
                                    </div>
                                    {selectedContact.phone && (
                                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                            <Phone size={14} />
                                            <span>{selectedContact.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                        <Calendar size={14} />
                                        <span>{new Date(selectedContact.createdAt).toLocaleString()}</span>
                                    </div>
                                </div>

                                {selectedContact.service && (
                                    <div>
                                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">Service</p>
                                        <p className="text-sm text-gray-700">{selectedContact.service}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Message</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Admin Notes</p>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Add internal notes..."
                                    />
                                    <button
                                        onClick={saveNotes}
                                        disabled={isSavingNotes || notes === (selectedContact.notes || '')}
                                        className="mt-2 w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSavingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check size={16} />}
                                        Save Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500 text-sm">Select a contact to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Contact?</h3>
                        <p className="text-gray-500 text-sm mb-4">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ContactsPage;
