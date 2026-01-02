'use client';

import { useState } from 'react';
import { Search, Smartphone, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import FarmerDetailsCard from '@/components/FarmerDetailsCard';

interface Farmer {
    _id: string;
    name: string;
    mobile_no: string;
    home_address: string;
    call_language: string;
    farms: Record<string, any>;
}

export default function FarmsPage() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [farmerData, setFarmerData] = useState<Farmer | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!mobileNumber.trim() || mobileNumber.length < 10) {
            setError('Please enter a valid mobile number');
            return;
        }

        setLoading(true);
        setError('');
        setFarmerData(null);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/farmerdata`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mobile_no: mobileNumber }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Farmer not found. Please check the number.');
            }

            setFarmerData(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">

            {/* Navigation - Simple back to home */}
            <div className="p-6">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-400 transition-colors font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>

            <main className="flex-1 flex flex-col items-center justify-center p-4 -mt-20">

                <div className="w-full max-w-lg">
                    {/* Header Section */}
                    <div className="text-center mb-10 space-y-3">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            My <span className="text-green-700 dark:text-green-500">Farms</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            Enter your registered mobile number to view your farm details and crop status.
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 p-8">
                        <form onSubmit={handleSearch} className="space-y-6">

                            <div className="space-y-2">
                                <label htmlFor="mobile" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                    Mobile Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                                    </div>
                                    <input
                                        type="tel"
                                        id="mobile"
                                        value={mobileNumber}
                                        onChange={(e) => {
                                            // Only allow numbers
                                            const val = e.target.value.replace(/\D/g, '');
                                            setMobileNumber(val);
                                            setError('');
                                        }}
                                        className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-lg"
                                        placeholder="Enter 10-digit number"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center animate-in fade-in slide-in-from-top-2">
                                    <span className="mr-2">⚠️</span> {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="-ml-1 mr-3 h-5 w-5" />
                                        Find Your Farms
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            Not registered yet? <Link href="/" onClick={() => {
                                // In a real app we might want to trigger the form open state on the home page via context or url param
                                // For now just redirecting to home where the button is visible
                            }} className="text-green-600 hover:text-green-700 font-semibold hover:underline">Apply here</Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Details Modal */}
            {farmerData && (
                <FarmerDetailsCard
                    farmer={farmerData}
                    onClose={() => setFarmerData(null)}
                />
            )}

        </div>
    );
}
