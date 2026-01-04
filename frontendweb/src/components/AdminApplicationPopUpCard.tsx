import React from 'react';
import {
    X,
    User,
    Smartphone,
    MapPin,
    Trash2,
    Loader2,
} from 'lucide-react';

interface Application {
    _id: string;
    name: string;
    mobile_no: string;
    home_address: string;
}

interface AdminApplicationPopUpCardProps {
    application: Application;
    onClose: () => void;
    onDelete: (id: string) => void;
    isDeleting?: boolean;
}

export default function AdminApplicationPopUpCard({
    application,
    onClose,
    onDelete,
    isDeleting = false
}: AdminApplicationPopUpCardProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-800">

                {/* Header with gradient background */}
                <div className="relative h-24 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="absolute -bottom-10 left-8">
                        <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-2xl p-2 shadow-xl border-4 border-white dark:border-gray-900">
                            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <User className="w-8 h-8" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 px-8 pb-8 space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {application.name}
                                </h2>
                                <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider rounded-full">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    New Application
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl shrink-0">
                                <Smartphone className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Mobile Number
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium mt-0.5">
                                    {application.mobile_no}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    Home Address
                                </label>
                                <p className="text-gray-900 dark:text-white mt-1 leading-relaxed">
                                    {application.home_address}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onDelete(application._id)}
                            disabled={isDeleting}
                            className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            {isDeleting ? 'Deleting...' : 'Delete Application'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
