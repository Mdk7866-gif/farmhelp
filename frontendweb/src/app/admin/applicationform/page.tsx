'use client';

import { useState, useEffect } from 'react';
import {
    Trash2,
    Search,
    Loader2,
    Smartphone,
    MapPin,
    User,
    FileText,
    AlertTriangle,
    X,
    CheckCircle2
} from 'lucide-react';

interface Application {
    _id: string;
    name: string;
    mobile_no: string;
    home_address: string;
}

export default function ApplicationFormsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminapplicationfoamdata`);
            if (res.ok) {
                const data = await res.json();
                setApplications(data);
            }
        } catch (error) {
            console.error("Failed to fetch applications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminapplicationfoamdata/${deleteId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setApplications(prev => prev.filter(app => app._id !== deleteId));
                setDeleteId(null);
            } else {
                alert('Failed to delete application');
            }
        } catch (error) {
            console.error("Error deleting application", error);
            alert('Error deleting application');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredApps = applications.filter(app =>
        app.mobile_no.includes(searchTerm)
    );

    return (
        <div className="p-6 md:p-8 space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    Application Forms
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Manage incoming farmer applications and requests.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by mobile no."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    />
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Applications: <span className="text-gray-900 dark:text-white font-bold">{applications.length}</span>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading applications...</p>
                </div>
            ) : filteredApps.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Applications Found</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchTerm ? "No results matching your search" : "Wait for new farmers to submit their forms."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApps.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all group"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{app.name}</h3>
                                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">New</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setDeleteId(app._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete Application"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Smartphone className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium">{app.mobile_no}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <span className="text-sm leading-relaxed">{app.home_address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => !isDeleting && setDeleteId(null)}
                    />
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Application?</h3>
                                <p className="text-gray-500 dark:text-gray-400 mt-2">
                                    Are you sure you want to remove this application? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex gap-3 w-full pt-2">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}