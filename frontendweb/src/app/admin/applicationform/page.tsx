'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    Smartphone,
    MapPin,
    User,
    FileText,
} from 'lucide-react';
import Pagination from '@/components/Pagination';
import AdminApplicationPopUpCard from '@/components/AdminApplicationPopUpCard';

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
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal State
    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchApplications();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

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

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminapplicationfoamdata/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setApplications(prev => prev.filter(app => app._id !== id));
                setSelectedApplication(null); // Close modal
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

    // Pagination Logic
    const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
    const paginatedApps = filteredApps.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        Application Forms
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Manage incoming farmer applications and requests. Click a card to view details.
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
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white transition-all"
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
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="w-10 h-10 text-gray-300 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Applications Found</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchTerm ? "No results matching your search" : "Wait for new farmers to submit their forms."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedApps.map((app) => (
                                <div
                                    key={app._id}
                                    onClick={() => setSelectedApplication(app)}
                                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all group cursor-pointer transform hover:-translate-y-1"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{app.name}</h3>
                                                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">New</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                                <Smartphone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium">{app.mobile_no}</span>
                                            </div>
                                            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                <span className="text-sm leading-relaxed line-clamp-1">{app.home_address}</span>
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

            {/* Application Detail Modal */}
            {selectedApplication && (
                <AdminApplicationPopUpCard
                    application={selectedApplication}
                    onClose={() => setSelectedApplication(null)}
                    onDelete={handleDelete}
                    isDeleting={isDeleting}
                />
            )}
        </div>
    );
}
