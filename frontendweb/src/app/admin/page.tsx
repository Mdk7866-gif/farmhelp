'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, FileText, MessageSquare, Plus } from 'lucide-react';
import AddFarmersForm from '@/components/AddFarmersForm';

export default function AdminPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <>
            <main className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    <div className="flex justify-between items-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Admin Dashboard
                        </h1>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold"
                        >
                            <Plus className="w-5 h-5" />
                            Add Farmers
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Active Farmers Card */}
                        <Link
                            href="/admin/activefarmers"
                            className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1 block p-8 h-64 flex flex-col justify-center items-center text-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent group-hover:from-green-500/20 transition-all duration-500" />
                            <div className="relative z-10 w-16 h-16 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Users className="w-8 h-8" />
                            </div>
                            <h2 className="relative z-10 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
                                Active Farmers
                            </h2>
                            <p className="relative z-10 mt-2 text-gray-500 dark:text-gray-400">View and manage farmer profiles</p>
                        </Link>

                        {/* Application Forms Card */}
                        <Link
                            href="/admin/applicationfoam"
                            className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1 block p-8 h-64 flex flex-col justify-center items-center text-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent group-hover:from-blue-500/20 transition-all duration-500" />
                            <div className="relative z-10 w-16 h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FileText className="w-8 h-8" />
                            </div>
                            <h2 className="relative z-10 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                                Application Forms
                            </h2>
                            <p className="relative z-10 mt-2 text-gray-500 dark:text-gray-400">Review new service requests</p>
                        </Link>

                        {/* Contact Forms Card */}
                        <Link
                            href="/admin/contect"
                            className="group relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1 block p-8 h-64 flex flex-col justify-center items-center text-center"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent group-hover:from-amber-500/20 transition-all duration-500" />
                            <div className="relative z-10 w-16 h-16 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h2 className="relative z-10 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                                Contact Forms
                            </h2>
                            <p className="relative z-10 mt-2 text-gray-500 dark:text-gray-400">User inquiries and messages</p>
                        </Link>

                    </div>
                </div>
            </main>

            <AddFarmersForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
        </>
    );
}
