'use client';

import { useState, useEffect } from 'react';
import {
    X,
    Smartphone,
    MapPin,
    Languages,
    Cpu,
    Tractor,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Droplets,
    Waves,
    Sprout
} from 'lucide-react';
import PredictCrop from './PredictCrop';
import Image from 'next/image';

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
}

export default function FarmerDetailsCard({ farmer, onClose }: FarmerDetailsCardProps) {
    // Lightbox State
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Predict Crop State
    const [predictModalOpen, setPredictModalOpen] = useState(false);
    const [selectedCoordinates, setSelectedCoordinates] = useState<string>('');

    // Sensor Data State (Map sensor_id -> Data)
    const [sensorDataMap, setSensorDataMap] = useState<Record<string, { soil_moisture: number; water_tank_level: number }>>({});
    const [loadingSensor, setLoadingSensor] = useState(true);

    // Fetch Sensor Data on Mount
    useEffect(() => {
        const fetchSensorData = async () => {
            try {
                const farmsWithSensors = Object.values(farmer.farms || {}).filter(f => f.sensor_id);

                if (farmsWithSensors.length === 0) {
                    setLoadingSensor(false);
                    return;
                }

                // Fetch data for all sensors in parallel
                const promises = farmsWithSensors.map(async (farm) => {
                    try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/demosenserdata?sensor_id=${farm.sensor_id}`);
                        if (res.ok) {
                            const data = await res.json();
                            return { sensor_id: farm.sensor_id, data };
                        }
                    } catch (err) {
                        console.error(`Failed to fetch data for sensor ${farm.sensor_id}`, err);
                    }
                    return null;
                });

                const results = await Promise.all(promises);

                const newSensorMap: Record<string, { soil_moisture: number; water_tank_level: number }> = {};
                results.forEach(result => {
                    if (result) {
                        newSensorMap[result.sensor_id] = result.data;
                    }
                });

                setSensorDataMap(newSensorMap);

            } catch (error) {
                console.error('Failed to fetch sensor data', error);
            } finally {
                setLoadingSensor(false);
            }
        };

        fetchSensorData();
    }, [farmer]);


    // Derive images from farms
    const farmImages = Object.values(farmer.farms || {})
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
        if (!lightboxOpen) return;
        const delta = -Math.sign(e.deltaY) * 0.25;
        const newScale = Math.min(Math.max(1, scale + delta), 4);
        setScale(newScale);
        if (newScale === 1) setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
            e.preventDefault();
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

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-in fade-in zoom-in duration-200">

                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Farmer Details
                            </h2>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                Verified Farmer
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{farmer.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Mobile Number</label>
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Smartphone className="w-4 h-4 text-blue-500" />
                                        {farmer.mobile_no}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Call Language</label>
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                        <Languages className="w-4 h-4 text-green-500" />
                                        {farmer.call_language}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Home Address</label>
                                    <div className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                                        <MapPin className="w-4 h-4 text-red-500 mt-1" />
                                        {farmer.home_address}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Farms List */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Tractor className="w-5 h-5 text-green-600" />
                                Registered Farms ({Object.keys(farmer.farms || {}).length})
                            </h3>

                            <div className="space-y-6">
                                {Object.entries(farmer.farms || {}).map(([key, farm], index) => {
                                    const farmSensorData = farm.sensor_id ? sensorDataMap[farm.sensor_id] : null;

                                    return (
                                        <div key={key} className="flex flex-col gap-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Image */}
                                                <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden group relative">
                                                    {farm.photo ? (
                                                        <div className="w-full h-full relative cursor-pointer" onClick={() => openLightbox(farm.photo!)}>
                                                            <Image
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
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{farm.location || 'N/A'}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-medium text-gray-500">Sensor ID</label>
                                                            <div className="flex items-center gap-2">
                                                                <Cpu className="w-3.5 h-3.5 text-blue-500" />
                                                                <code className="text-sm bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded">{farm.sensor_id || 'N/A'}</code>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => {
                                                        const coords = farm.location;
                                                        if (coords) {
                                                            setSelectedCoordinates(coords);
                                                            setPredictModalOpen(true);
                                                        } else {
                                                            alert("No location coordinates found for this farm.");
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                                                >
                                                    <Sprout className="w-4 h-4" />
                                                    Predict Crop
                                                </button>
                                            </div>

                                            {/* Live Sensor Data Section */}
                                            {farm.sensor_id && (
                                                <div className="mt-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                        Live Sensor Status
                                                    </h4>

                                                    {loadingSensor ? (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                                                            <div className="h-16 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse" />
                                                        </div>
                                                    ) : farmSensorData ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            {/* Soil Moisture */}
                                                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 flex items-center gap-3 transition-transform hover:scale-[1.02]">
                                                                <div className="p-2 bg-blue-100 dark:bg-blue-800/40 rounded-lg text-blue-600 dark:text-blue-400">
                                                                    <Droplets className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-blue-600 dark:text-blue-300 font-medium uppercase tracking-wide">Soil Moisture</div>
                                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{farmSensorData.soil_moisture}%</div>
                                                                </div>
                                                            </div>

                                                            {/* Water Level */}
                                                            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl border border-cyan-100 dark:border-cyan-800/30 flex items-center gap-3 transition-transform hover:scale-[1.02]">
                                                                <div className="p-2 bg-cyan-100 dark:bg-cyan-800/40 rounded-lg text-cyan-600 dark:text-cyan-400">
                                                                    <Waves className="w-5 h-5" />
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-cyan-600 dark:text-cyan-300 font-medium uppercase tracking-wide">Water Tank</div>
                                                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{farmSensorData.water_tank_level}%</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-500 text-center italic">
                                                            Sensor data momentarily unavailable.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lightbox Overlay */}
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
                    {/* Toolbar */}
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
                            <Image
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
            {/* Predict Crop Modal */}
            {predictModalOpen && selectedCoordinates && (
                <PredictCrop
                    coordinates={selectedCoordinates}
                    onClose={() => {
                        setPredictModalOpen(false);
                        setSelectedCoordinates('');
                    }}
                />
            )}
        </>
    );
}
