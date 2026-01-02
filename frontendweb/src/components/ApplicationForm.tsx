'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface ApplicationFormData {
    name: string;
    mobile_no: string;
    home_address: string;
}

interface ApplicationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApplicationForm({ isOpen, onClose }: ApplicationFormProps) {
    const [formData, setFormData] = useState<ApplicationFormData>({
        name: '',
        mobile_no: '',
        home_address: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const response = await fetch('http://127.0.0.1:8000/submitapplicationfoamdata', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit');
            }

            setStatus('success');
            // Reset form after a delay or let user close
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setFormData({ name: '', mobile_no: '', home_address: '' });
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 p-6 sm:p-8 transform transition-all scale-100">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Application Form
                    </h2>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Fill in your details to get started with our services.
                    </p>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-500">
                            Submitted Successfully!
                        </h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            We will contact you shortly.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex. Mujahid"
                            />
                        </div>

                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                required
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number"
                                value={formData.mobile_no}
                                onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                placeholder="Ex. 8511274216"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Home Address
                            </label>
                            <textarea
                                id="address"
                                required
                                rows={3}
                                value={formData.home_address}
                                onChange={(e) => setFormData({ ...formData, home_address: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="Ex. C.207 marjan residency..."
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-500 text-sm text-center">
                                Something went wrong. Please try again.
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
