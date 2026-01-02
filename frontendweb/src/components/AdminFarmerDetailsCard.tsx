'use client';

import { useState } from 'react';
import {
    X,
    Edit2,
    Trash2,
    Save,
    Smartphone,
    MapPin,
    Languages,
    Cpu,
    Tractor,
    AlertTriangle,
    Loader2
} from 'lucide-react';

interface Farm {
    photo: string | null;
    location: string;
    sensor_id: string;
}

interface Farmer {
    _id: string;
    name: string;
    mobile_no: string;
    home_address: string;
    call_language: string;
    farms: Record<string, Farm>;
}

interface FarmerDetailsCardProps {
    farmer: Farmer;
    onClose: () => void;
    onUpdate: (updatedFarmer: Farmer) => void;
    onDelete: (farmerId: string) => void;
}

export default function FarmerDetailsCard({ farmer, onClose, onUpdate, onDelete }: FarmerDetailsCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Farmer>(farmer);

    // Reset form when entering/exiting edit mode
    const toggleEdit = () => {
        if (isEditing) {
            setFormData(farmer); // Reset on cancel
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field: keyof Farmer, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFarmChange = (farmKey: string, field: keyof Farm, value: string) => {
        setFormData(prev => ({
            ...prev,
            farms: {
                ...prev.farms,
                [farmKey]: {
                    ...prev.farms[farmKey],
                    [field]: value
                }
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminfarmerdata/${farmer._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Failed to update');

            onUpdate(formData); // Update parent state
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert('Failed to update farmer details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminfarmerdata/${farmer._id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Failed to delete');

            onDelete(farmer._id);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to delete farmer');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">

                {/* Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isEditing ? 'Edit Farmer Details' : 'Farmer Details'}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: {farmer._id}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {!isEditing && !isDeleting && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setIsDeleting(true)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8">

                    {isDeleting ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-500">
                                <AlertTriangle className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Farmer?</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-2">
                                    Are you sure you want to delete <strong>{farmer.name}</strong>? This action cannot be undone and all associated farm data will be lost.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsDeleting(false)}
                                    className="px-6 py-2 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium shadow-lg hover:shadow-red-500/20 transition-all flex items-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Personal Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{farmer.name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={formData.mobile_no}
                                                onChange={(e) => handleInputChange('mobile_no', e.target.value)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Smartphone className="w-4 h-4 text-blue-500" />
                                                {farmer.mobile_no}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Call Language</label>
                                        {isEditing ? (
                                            <select
                                                value={formData.call_language}
                                                onChange={(e) => handleInputChange('call_language', e.target.value)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="Hindi">Hindi</option>
                                                <option value="English">English</option>
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
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                <Languages className="w-4 h-4 text-green-500" />
                                                {farmer.call_language}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Home Address</label>
                                        {isEditing ? (
                                            <textarea
                                                value={formData.home_address}
                                                onChange={(e) => handleInputChange('home_address', e.target.value)}
                                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                                                rows={2}
                                            />
                                        ) : (
                                            <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                                <MapPin className="w-4 h-4 text-red-500 mt-1" />
                                                {farmer.home_address}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Farms List */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Tractor className="w-5 h-5 text-green-600" />
                                    Registered Farms ({Object.keys(formData.farms || {}).length})
                                </h3>

                                <div className="space-y-6">
                                    {Object.entries(formData.farms || {}).map(([key, farm], index) => (
                                        <div key={key} className="flex flex-col md:flex-row gap-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                            {/* Image */}
                                            <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                                                {farm.photo ? (
                                                    <img src={farm.photo} alt={`Farm ${index + 1}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <Tractor className="w-8 h-8 opacity-50" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-1 rounded">
                                                        Farm {index + 1}
                                                    </span>
                                                    {/* We could add delete individual farm here if needed */}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">Location / Landmark</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={farm.location}
                                                                onChange={(e) => handleFarmChange(key, 'location', e.target.value)}
                                                                className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:border-blue-500"
                                                            />
                                                        ) : (
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{farm.location || 'N/A'}</p>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-medium text-gray-500">Sensor ID</label>
                                                        {isEditing ? (
                                                            <input
                                                                type="text"
                                                                value={farm.sensor_id}
                                                                onChange={(e) => handleFarmChange(key, 'sensor_id', e.target.value)}
                                                                className="w-full p-2 text-sm rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 outline-none focus:border-blue-500 font-mono"
                                                            />
                                                        ) : (
                                                            <div className="flex items-center gap-2">
                                                                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                                                                <code className="text-sm bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">{farm.sensor_id || 'N/A'}</code>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Edit Actions Footer */}
                            {isEditing && (
                                <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                                    <button
                                        onClick={toggleEdit}
                                        disabled={loading}
                                        className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/20 transition-all flex items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Save Changes
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
