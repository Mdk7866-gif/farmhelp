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
    Loader2,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    RotateCcw
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

    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Derive images from farms (use formData to reflect any potential local state changes, although photos aren't editable here)
    const farmImages = Object.values(formData.farms || {})
        .map(f => f.photo)
        .filter((p): p is string => p !== null && p !== undefined && p !== '');

    const openLightbox = (url: string) => {
        const index = farmImages.indexOf(url);
        if (index >= 0) {
            setCurrentImageIndex(index);
            setLightboxOpen(true);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const showNextImage = () => {
        setCurrentImageIndex(prev => (prev + 1) % farmImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const showPrevImage = () => {
        setCurrentImageIndex(prev => (prev - 1 + farmImages.length) % farmImages.length);
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleWheel = (e: React.WheelEvent) => {
        // Support zoom with wheel
        // Only if lightbox is open
        if (!lightboxOpen) return;

        // e.preventDefault(); // React synthetic events might not need this for logic but good for browser behavior
        const delta = -Math.sign(e.deltaY) * 0.25;
        const newScale = Math.min(Math.max(1, scale + delta), 4); // Max 4x zoom

        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
            e.preventDefault(); // Prevent text selection etc
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

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
        <>
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
                                                <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden group relative">
                                                    {farm.photo ? (
                                                        <div className="w-full h-full relative cursor-pointer" onClick={() => openLightbox(farm.photo!)}>
                                                            <img
                                                                src={farm.photo}
                                                                alt={`Farm ${index + 1}`}
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                                <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
                                                            </div>
                                                        </div>
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

            {/* Enhanced Lightbox Overlay - Rotated out to Body level logically via portal or just fixed z-max */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col"
                    onKeyDown={(e) => {
                        if (e.key === 'Escape') closeLightbox();
                        if (e.key === 'ArrowLeft') showPrevImage();
                        if (e.key === 'ArrowRight') showNextImage();
                    }}
                    tabIndex={0}
                    autoFocus
                >
                    {/* Lightbox Toolbar */}
                    <div className="flex items-center justify-between px-6 py-4 z-50 bg-gradient-to-b from-black/80 to-transparent">
                        <div className="text-white/90 font-medium drop-shadow-md">
                            {farmImages.length > 0 && `Image ${currentImageIndex + 1} of ${farmImages.length}`}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-gray-800/80 backdrop-blur rounded-lg p-1 border border-gray-700/50">
                                <button onClick={() => setScale(s => Math.max(1, s - 0.5))} className="p-2 hover:bg-white/10 rounded-md text-white transition disabled:opacity-50" disabled={scale <= 1}>
                                    <ZoomOut size={18} />
                                </button>
                                <span className="px-3 text-xs font-mono text-white min-w-[3.5rem] text-center select-none">{Math.round(scale * 100)}%</span>
                                <button onClick={() => setScale(s => Math.min(4, s + 0.5))} className="p-2 hover:bg-white/10 rounded-md text-white transition disabled:opacity-50" disabled={scale >= 4}>
                                    <ZoomIn size={18} />
                                </button>
                                <div className="w-px h-4 bg-gray-600 mx-1"></div>
                                <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-2 hover:bg-white/10 rounded-md text-white transition" title="Reset View">
                                    <RotateCcw size={16} />
                                </button>
                            </div>

                            <button onClick={closeLightbox} className="p-2 bg-white/10 hover:bg-red-500/20 rounded-full text-white hover:text-red-400 transition ml-4">
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Main Stage */}
                    <div
                        className="flex-1 relative overflow-hidden flex items-center justify-center w-full h-full select-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                    >
                        {/* Nav Buttons */}
                        {farmImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); showPrevImage(); }}
                                    className="absolute left-4 z-50 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); showNextImage(); }}
                                    className="absolute right-4 z-50 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all hover:scale-110 active:scale-95 group"
                                >
                                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </>
                        )}

                        <div
                            className="transition-transform duration-0 ease-linear origin-center"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                            }}
                        >
                            <img
                                src={farmImages[currentImageIndex]}
                                className="max-h-[85vh] max-w-[90vw] object-contain shadow-2xl"
                                draggable={false}
                                alt="Farm Detail"
                            />
                        </div>
                    </div>

                    {/* Instructions footer */}
                    <div className="py-4 text-center text-white/40 text-sm pointer-events-none bg-gradient-to-t from-black/80 to-transparent pb-6">
                        {scale === 1 ? 'Scroll to zoom • Click buttons' : 'Drag to pan • Scroll to zoom'}
                    </div>
                </div>
            )}
        </>
    );
}
