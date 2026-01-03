'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    Smartphone,
    MessageSquare,
    User,
    Inbox,
} from 'lucide-react';
import Pagination from '@/components/Pagination';
import AdminContactPopUpCard from '@/components/AdminContactPopUpCard';

interface ContactSubmission {
    _id: string;
    name: string;
    mobile_no: string;
    problem: string;
}

export default function ContactFormsPage() {
    const [messages, setMessages] = useState<ContactSubmission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal State
    const [selectedMessage, setSelectedMessage] = useState<ContactSubmission | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchMessages();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admincontactfoamdata`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch contact messages", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admincontactfoamdata/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setMessages(prev => prev.filter(msg => msg._id !== id));
                setSelectedMessage(null); // Close modal
            } else {
                alert('Failed to delete message');
            }
        } catch (error) {
            console.error("Error deleting message", error);
            alert('Error deleting message');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredMessages = messages.filter(msg =>
        msg.mobile_no.includes(searchTerm)
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
    const paginatedMessages = filteredMessages.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Inbox className="w-8 h-8 text-amber-500" />
                        Contact Messages
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Review and manage help requests and inquiries from farmers. Click a card to view details.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by mobile no."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-gray-900 dark:text-white transition-all"
                        />
                    </div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Messages: <span className="text-gray-900 dark:text-white font-bold">{messages.length}</span>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Inbox className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Messages Found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? "No results matching your search" : "Your inbox is currently empty."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    onClick={() => setSelectedMessage(msg)}
                                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group flex flex-col cursor-pointer transform hover:-translate-y-1"
                                >
                                    <div className="p-6 flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{msg.name}</h3>
                                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">Inquiry</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                <Smartphone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium">{msg.mobile_no}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                <p className="text-sm leading-relaxed italic line-clamp-2">"{msg.problem}"</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Contact PopUp Card */}
            {selectedMessage && (
                <AdminContactPopUpCard
                    message={selectedMessage}
                    onClose={() => setSelectedMessage(null)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
