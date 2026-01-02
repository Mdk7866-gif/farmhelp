'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Camera, Loader2, MapPin, Cpu } from 'lucide-react';

interface FarmData {
    id: string; // for internal React key
    location: string;
    sensor_id: string;
    photoFile: File | null;
}

interface AddFarmersFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddFarmersForm({ isOpen, onClose }: AddFarmersFormProps) {
    const [name, setName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [homeAddress, setHomeAddress] = useState('');
    const [callLanguage, setCallLanguage] = useState('Hindi');
    const [farms, setFarms] = useState<FarmData[]>([
        { id: '1', location: '', sensor_id: '', photoFile: null }
    ]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'submitting_data' | 'uploading' | 'success' | 'error'>('idle');
    const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });

    if (!isOpen) return null;

    const handleAddFarm = () => {
        setFarms([
            ...farms,
            { id: Date.now().toString(), location: '', sensor_id: '', photoFile: null }
        ]);
    };

    const handleRemoveFarm = (id: string) => {
        if (farms.length > 1) {
            setFarms(farms.filter(f => f.id !== id));
        }
    };

    const updateFarm = (id: string, field: keyof FarmData, value: string | File | null) => {
        setFarms(farms.map(f => (f.id === id ? { ...f, [field]: value } : f)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('submitting_data');

        try {
            const formData = new FormData();

            // Construct the farms dictionary for the JSON payload
            const farmsPayload: Record<string, any> = {};
            const uploadTasks: { farmKey: string; file: File }[] = [];

            farms.forEach((farm, index) => {
                const farmKey = `farm_${index + 1}`;

                // Add to payload - send filename but NO file yet
                farmsPayload[farmKey] = {
                    location: farm.location,
                    sensor_id: farm.sensor_id,
                    photo: farm.photoFile ? farm.photoFile.name : null
                };

                // Queue file for upload
                if (farm.photoFile) {
                    uploadTasks.push({ farmKey, file: farm.photoFile });
                }
            });

            const farmerData = {
                name: name,
                mobile_no: mobileNo,
                home_address: homeAddress,
                call_language: callLanguage,
                farms: farmsPayload
            };

            // 1. Submit Data Only
            formData.append('farmer_data', JSON.stringify(farmerData));

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminaddfarmerdata`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to add farmer data');
            }

            const responseData = await response.json();
            const farmerId = responseData.farmer_id;

            // 2. Upload Images in Parallel
            if (uploadTasks.length > 0) {
                setStatus('uploading');
                setUploadProgress({ current: 0, total: uploadTasks.length });

                let completed = 0;

                // Use a concurrency limit if needed, but for now Promise.all is fine for reasonable numbers
                await Promise.all(uploadTasks.map(async (task) => {
                    const imageFormData = new FormData();
                    imageFormData.append('farmer_id', farmerId);
                    imageFormData.append('farm_key', task.farmKey);
                    imageFormData.append('file', task.file);

                    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminaddfarmerdata/upload-image`, {
                        method: 'POST',
                        body: imageFormData,
                    });

                    completed++;
                    setUploadProgress(prev => ({ ...prev, current: completed }));
                }));
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                // Reset form
                setName('');
                setMobileNo('');
                setHomeAddress('');
                setCallLanguage('Hindi');
                setFarms([{ id: '1', location: '', sensor_id: '', photoFile: null }]);
                setUploadProgress({ current: 0, total: 0 });
            }, 2000);

        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Farmer</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Farmer Added Successfully!</h3>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Personal Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="e.g. Ramesh Kumar"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            required
                                            value={mobileNo}
                                            onChange={(e) => setMobileNo(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="e.g. 9876543210"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Home Address</label>
                                        <input
                                            type="text"
                                            required
                                            value={homeAddress}
                                            onChange={(e) => setHomeAddress(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="e.g. Village Rampur, Dist XYZ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Call Language</label>
                                        <select
                                            value={callLanguage}
                                            onChange={(e) => setCallLanguage(e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                        >
                                            <option value="English">English</option>
                                            <option value="Hindi">Hindi</option>
                                            <option value="Bengali">Bengali</option>
                                            <option value="Marathi">Marathi</option>
                                            <option value="Telugu">Telugu</option>
                                            <option value="Tamil">Tamil</option>
                                            <option value="Gujarati">Gujarati</option>
                                            <option value="Kannada">Kannada</option>
                                            <option value="Odia (Oriya)">Odia (Oriya)</option>
                                            <option value="Malayalam">Malayalam</option>
                                            <option value="Punjabi">Punjabi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Farms Section */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Farm Details</h3>
                                </div>

                                {farms.map((farm, index) => (
                                    <div key={farm.id} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                                        <div className="absolute top-4 right-4">
                                            {farms.length > 1 && (
                                                <button type="button" onClick={() => handleRemoveFarm(farm.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        <h4 className="text-md font-medium text-green-700 dark:text-green-500 mb-4 flex items-center gap-2">
                                            <span className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-sm">Farm {index + 1}</span>
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    <MapPin className="w-4 h-4" /> Location/Landmark
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={farm.location}
                                                    onChange={(e) => updateFarm(farm.id, 'location', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="e.g. Google Map Location URL"
                                                />
                                            </div>
                                            <div>
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    <Cpu className="w-4 h-4" /> Sensor ID
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={farm.sensor_id}
                                                    onChange={(e) => updateFarm(farm.id, 'sensor_id', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="e.g. SENSOR_001"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    <Camera className="w-4 h-4" /> Farm Photo
                                                </label>
                                                <div className="flex items-center gap-4">
                                                    <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">Choose File</span>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => updateFarm(farm.id, 'photoFile', e.target.files?.[0] || null)}
                                                        />
                                                    </label>
                                                    {farm.photoFile ? (
                                                        <span className="text-sm text-green-600 dark:text-green-400 truncate max-w-xs">{farm.photoFile.name}</span>
                                                    ) : (
                                                        <span className="text-sm text-gray-400 italic">No file chosen</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={handleAddFarm}
                                    className="w-full py-3 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl text-green-700 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    <Plus className="w-5 h-5" /> Add Another Farm
                                </button>
                            </div>

                            {status === 'error' && (
                                <p className="text-red-500 text-center bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">Error submitting. Please check your data and try again.</p>
                            )}

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-3 sticky bottom-0 bg-white dark:bg-gray-900 py-4">

                                {status === 'uploading' && (
                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                                            <span>Uploading Images...</span>
                                            <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                            {uploadProgress.current} of {uploadProgress.total} images uploaded
                                        </p>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-2.5 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px] justify-center"
                                    >
                                        {status === 'submitting_data' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving Data...</>
                                        ) : status === 'uploading' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                                        ) : (
                                            'Save Farmer Data'
                                        )}
                                    </button>
                                </div>
                            </div>

                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
