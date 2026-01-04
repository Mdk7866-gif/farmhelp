'use client';

import { useState, useEffect } from 'react';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const auth = sessionStorage.getItem('isAdminAuthenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setCheckingAuth(false);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.detail || 'Invalid password');
            }

            sessionStorage.setItem('isAdminAuthenticated', 'true');
            setIsAuthenticated(true);
        } catch (err: unknown) {
            let message = 'Something went wrong';
            if (err instanceof Error) {
                message = err.message;
            }
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex flex-col">
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
                        <div className="text-center mb-10 space-y-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                Admin <span className="text-green-700 dark:text-green-500">Access</span>
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                This area is restricted. Please enter the administrator password to continue.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700 p-8">
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ml-1">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setError('');
                                            }}
                                            className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-lg"
                                            placeholder="Enter admin password"
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
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="-ml-1 mr-3 h-5 w-5" />
                                            Unlock Admin Panel
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return <>{children}</>;
}
