'use client';

import { useState } from 'react';
import { Loader2, MapPin, Phone, Clock, Send } from 'lucide-react';

interface ContactFormData {
    name: string;
    mobile_no: string;
    problem: string;
}

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        mobile_no: '',
        problem: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submitcontactfoamdata`, {
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
            setFormData({ name: '', mobile_no: '', problem: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
                        Have questions about your farm? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Contact Information */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Contact Information
                        </h2>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
                                    <Phone className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Phone</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    +91 85112 74216
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    Mon-Fri 9am to 6pm
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
                                    <MapPin className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Service Center</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    123 Farm Road, Green Valley<br />
                                    Ahmedabad, Gujarat
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-500">
                                    <Clock className="h-6 w-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hours</h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    Monday - Saturday: 9am - 6pm<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Send us a Message
                        </h2>

                        {status === 'success' ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">Message Sent!</h3>
                                <p className="text-green-700 dark:text-green-300">
                                    Thank you for contacting us. We will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-6 text-sm font-medium text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter your mobile number"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Your Problem / Query
                                    </label>
                                    <textarea
                                        id="problem"
                                        required
                                        rows={4}
                                        value={formData.problem}
                                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Describe your problem or what you need help with..."
                                    />
                                </div>

                                {status === 'error' && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                        Something went wrong. Please try again later.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
