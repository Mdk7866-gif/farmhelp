'use client';

import { useState, useEffect } from 'react';
import {
    Search,
    Smartphone,
    MapPin,
    Languages,
    RefreshCw,
    User,
    Tractor
} from 'lucide-react';
import FarmerDetailsCard from '@/components/AdminFarmerDetailsCard';
import Pagination from '@/components/Pagination';

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

export default function ActiveFarmersPage() {
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal State
    const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);

    const fetchFarmers = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/adminfarmerdata`);
            if (!res.ok) {
                throw new Error('Failed to fetch farmers');
            }
            const data = await res.json();
            setFarmers(data || []);
        } catch (err) {
            console.error(err);
            setError('Could not load farmer data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Handlers for modal updates
    const handleUpdateFarmer = (updatedFarmer: Farmer) => {
        setFarmers(prev => prev.map(f => f._id === updatedFarmer._id ? updatedFarmer : f));
        setSelectedFarmer(updatedFarmer); // Update the modal view too
    };

    const handleDeleteFarmer = (farmerId: string) => {
        setFarmers(prev => prev.filter(f => f._id !== farmerId));
        setSelectedFarmer(null); // Close modal
    };

    // Filter logic
    const filteredFarmers = farmers.filter(farmer => {
        return (
            farmer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            farmer.mobile_no?.includes(searchQuery)
        );
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredFarmers.length / itemsPerPage);
    const paginatedFarmers = filteredFarmers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                            Active Farmers
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
                            Monitor and manage registered farmers. Click a card for details.
                        </p>
                    </div>
                    <button
                        onClick={fetchFarmers}
                        className="self-start md:self-auto p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-all text-gray-600 dark:text-gray-300"
                        title="Refresh Data"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Search */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or mobile number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                        <p className="text-red-500 font-medium">{error}</p>
                    </div>
                ) : filteredFarmers.length === 0 ? (
                    <div className="text-center py-20">
                        <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No farmers found</h3>
                        <p className="text-gray-500 dark:text-gray-500">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedFarmers.map(farmer => (
                                <div
                                    key={farmer._id}
                                    onClick={() => setSelectedFarmer(farmer)}
                                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-green-100 dark:bg-green-900/30 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                            {farmer.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                                            <Tractor className="w-3 h-3" />
                                            {Object.keys(farmer.farms || {}).length}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 truncate">
                                        {farmer.name}
                                    </h3>

                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Smartphone className="w-4 h-4 text-gray-400" />
                                            {farmer.mobile_no}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4 text-gray-400" />
                                            <span className="truncate">{farmer.home_address}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Languages className="w-4 h-4 text-gray-400" />
                                            {farmer.call_language}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Details Modal */}
            {selectedFarmer && (
                <FarmerDetailsCard
                    farmer={selectedFarmer}
                    onClose={() => setSelectedFarmer(null)}
                    onUpdate={handleUpdateFarmer}
                    onDelete={handleDeleteFarmer}
                />
            )}
        </div>
    );
}
