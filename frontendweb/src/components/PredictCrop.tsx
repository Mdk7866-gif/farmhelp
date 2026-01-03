'use client';

import { useState, useEffect } from 'react';
import { X, Sprout, Loader2, Leaf, AlertTriangle } from 'lucide-react';

interface Prediction {
    crop: string;
    percentage: number;
}

interface PredictCropProps {
    coordinates: string;
    onClose: () => void;
}

export default function PredictCrop({ coordinates, onClose }: PredictCropProps) {
    const [loading, setLoading] = useState(true);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                // Ensure backend expects { coordinates: "lat, long" }
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/democropprediction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        coordinates
                    }),
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch predictions');
                }

                const data: Prediction[] = await res.json();
                setPredictions(data);
            } catch (err) {
                console.error(err);
                setError('Unable to get crop predictions at this time.');
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, [coordinates]);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-700">

                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-white">
                        <Sprout className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Crop Prediction</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[200px] flex flex-col justify-center">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center space-y-4 text-center py-6">
                            <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                            <p className="text-gray-600 dark:text-gray-300 font-medium">
                                Analyzing soil & weather data...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center space-y-3 text-center py-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <p className="text-gray-900 dark:text-white font-medium">{error}</p>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Based on location ({coordinates})
                                </p>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                                    Top 3 Recommended Crops
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {predictions.map((item, index) => (
                                    <div
                                        key={item.crop}
                                        className="relative p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600 overflow-hidden"
                                    >
                                        <div
                                            className="absolute left-0 top-0 bottom-0 bg-green-500/10 dark:bg-green-500/20"
                                            style={{ width: `${item.percentage}%` }}
                                        />

                                        <div className="relative flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center
                                                    ${index === 0 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                                    ${index === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}
                                                    ${index === 2 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                                                `}>
                                                    <span className="font-bold text-sm">#{index + 1}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                                    {item.crop}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-bold">
                                                <Leaf className="w-4 h-4" />
                                                {item.percentage}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
                                Recommendation engine powered by real-time climate analysis.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
