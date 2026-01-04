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



            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-center gap-8 pt-10 md:pt-20">

                {/* Left Side: Dummy Numbers Card */}
                <div className="w-full md:w-1/3 order-2 md:order-1">
                    <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 p-8 h-full">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Available Farmers
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            Use these numbers to test the search functionality.
                        </p>

                        {/* CHANGED: grid-cols-2 instead of grid-cols-1 */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                "9958043690", "9876543210",
                                "9123456789", "9988776655",
                                "9898989898", "9191919191",
                                "9000000001", "9000000002"
                            ].map((num, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setMobileNumber(num)}
                                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 text-center cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 transition-all font-mono text-gray-700 dark:text-gray-300 font-medium select-all text-sm md:text-base"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-center text-gray-400">
                                Click any number to auto-fill the search box.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Search Form */}
                <div className="w-full md:w-1/2 lg:w-2/5 order-1 md:order-2 flex flex-col">
                    <div className="w-full">
                        {/* Header Section */}
                        <div className="text-center mb-8 space-y-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                My <span className="text-green-700 dark:text-green-500">Farms</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                Enter your registered mobile number to view details.
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
                                Not registered yet? <Link href="/" className="text-green-600 hover:text-green-700 font-semibold hover:underline">Apply here</Link>
                            </p>
                            <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                                Our sensors monitor soil moisture and water levels in real-time. Predict top crops for the season!
                            </p>
                        </div>
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