'use client';

import { useState } from 'react';
import { Search, MapPinned } from 'lucide-react';
import ServiceCentersCard from '@/components/ServiceCentersCard';

const indiaServiceCenters = [
  { id: 1, name: "Amaravati Krishi Seva", address: "Amaravati, Andhra Pradesh 522002", phone: "+91 863 223 4455", timing: "9:00 AM - 6:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767448117/amaravati_hdysps.jpg", googleMapsLink: "https://www.google.com/maps/search/Amaravati+Andhra+Pradesh" },
  { id: 2, name: "Tawang Agri-Support", address: "Tawang, Arunachal Pradesh 790104", phone: "+91 3794 222 111", timing: "8:30 AM - 5:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767461236/tawrang_agree_support_xu1xk3.jpg", googleMapsLink: "https://www.google.com/maps/search/Tawang+Arunachal+Pradesh" },
  { id: 3, name: "Brahmaputra Farmer Hub", address: "Guwahati, Assam 781005", phone: "+91 361 245 6789", timing: "9:00 AM - 7:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767461074/brahamaputrafarminghub_tpbfry.jpg", googleMapsLink: "https://www.google.com/maps/search/Guwahati+Assam" },
  { id: 4, name: "Pataliputra Kisan Kendra", address: "Patna, Bihar 800001", phone: "+91 612 222 3344", timing: "10:00 AM - 6:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767461236/tawrang_agree_support_xu1xk3.jpg", googleMapsLink: "https://www.google.com/maps/search/Patna+Bihar" },
  { id: 5, name: "Raipur Agrotech", address: "Raipur, Chhattisgarh 492001", phone: "+91 771 405 6000", timing: "9:30 AM - 6:30 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767461593/Screenshot_2026-01-03_230710_plr4sc.png", googleMapsLink: "https://www.google.com/maps/search/Raipur+Chhattisgarh" },
  { id: 6, name: "Goa Coastal Farmers", address: "Panjim, Goa 403001", phone: "+91 832 242 1234", timing: "9:00 AM - 5:30 PM", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Panjim+Goa" },
  { id: 7, name: "Saurashtra Krishi Seva", address: "Ahmedabad, Gujarat 380015", phone: "+91 79 2685 0000", timing: "9:00 AM - 8:00 PM", image: "https://images.unsplash.com/photo-1495539406979-bf61750d38ad?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Ahmedabad+Gujarat" },
  { id: 8, name: "Karnal Farm Connect", address: "Karnal, Haryana 132001", phone: "+91 184 226 7788", timing: "8:00 AM - 6:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767448117/amaravati_hdysps.jpg", googleMapsLink: "https://www.google.com/maps/search/Karnal+Haryana" },
  { id: 9, name: "Shimla Apple Support", address: "Shimla, Himachal Pradesh 171001", phone: "+91 177 265 1122", timing: "10:00 AM - 5:00 PM", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Shimla+Himachal+Pradesh" },
  { id: 10, name: "Ranchi Gramin Kendra", address: "Ranchi, Jharkhand 834001", phone: "+91 651 233 0011", timing: "9:00 AM - 6:00 PM", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Ranchi+Jharkhand" },
  { id: 11, name: "Bengaluru Tech Farm", address: "Bengaluru, Karnataka 560068", phone: "+91 80 4112 3456", timing: "9:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1535090467336-9501f96eef89?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Bengaluru+Karnataka" },
  { id: 12, name: "Kerala Spices Hub", address: "Kochi, Kerala 682016", phone: "+91 484 235 6677", timing: "8:30 AM - 6:30 PM", image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Kochi+Kerala" },
  { id: 13, name: "Indore Malwa Center", address: "Indore, Madhya Pradesh 452001", phone: "+91 731 243 5566", timing: "10:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Indore+Madhya+Pradesh" },
  { id: 14, name: "Sahyadri Agrotech", address: "Pune, Maharashtra 411005", phone: "+91 20 2553 4455", timing: "9:00 AM - 8:00 PM", image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Pune+Maharashtra" },
  { id: 15, name: "Imphal Valley Support", address: "Imphal, Manipur 795001", phone: "+91 385 244 1122", timing: "9:00 AM - 5:00 PM", image: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Imphal+Manipur" },
  { id: 16, name: "Meghalaya Organic Hub", address: "Shillong, Meghalaya 793001", phone: "+91 364 222 3344", timing: "9:30 AM - 5:30 PM", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Shillong+Meghalaya" },
  { id: 17, name: "Aizawl Hill Farming", address: "Aizawl, Mizoram 796001", phone: "+91 389 232 5566", timing: "9:00 AM - 5:00 PM", image: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Aizawl+Mizoram" },
  { id: 18, name: "Naga Farmer Station", address: "Kohima, Nagaland 797001", phone: "+91 370 224 1122", timing: "8:30 AM - 4:30 PM", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Kohima+Nagaland" },
  { id: 19, name: "Utkal Krishi Kendra", address: "Bhubaneswar, Odisha 751001", phone: "+91 674 253 4455", timing: "10:00 AM - 6:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767448117/amaravati_hdysps.jpg", googleMapsLink: "https://www.google.com/maps/search/Bhubaneswar+Odisha" },
  { id: 20, name: "Ludhiana Tractor Hub", address: "Ludhiana, Punjab 141001", phone: "+91 161 240 1234", timing: "8:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Ludhiana+Punjab" },
  { id: 21, name: "Rajasthan Desert Agri", address: "Jaipur, Rajasthan 302015", phone: "+91 141 274 5566", timing: "9:00 AM - 7:30 PM", image: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Jaipur+Rajasthan" },
  { id: 22, name: "Sikkim Green Station", address: "Gangtok, Sikkim 737101", phone: "+91 3592 202 121", timing: "9:00 AM - 5:00 PM", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Gangtok+Sikkim" },
  { id: 23, name: "Chennai Kaveri Center", address: "Chennai, Tamil Nadu 600002", phone: "+91 44 2852 4455", timing: "9:00 AM - 8:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767448117/amaravati_hdysps.jpg", googleMapsLink: "https://www.google.com/maps/search/Chennai+Tamil+Nadu" },
  { id: 24, name: "Deccan Farmer Support", address: "Hyderabad, Telangana 500081", phone: "+91 40 2311 6677", timing: "9:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1595113316349-9fa4eb24f884?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Hyderabad+Telangana" },
  { id: 25, name: "Agartala Rubber Hub", address: "Agartala, Tripura 799001", phone: "+91 381 232 4455", timing: "9:00 AM - 6:00 PM", image: "https://res.cloudinary.com/ddya4o2yl/image/upload/v1767448117/amaravati_hdysps.jpg", googleMapsLink: "https://www.google.com/maps/search/Agartala+Tripura" },
  { id: 26, name: "Lucknow Awadh Kendra", address: "Lucknow, Uttar Pradesh 226001", phone: "+91 522 262 5566", timing: "10:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Lucknow+Uttar+Pradesh" },
  { id: 27, name: "Doon Valley Agri", address: "Dehradun, Uttarakhand 248001", phone: "+91 135 271 2233", timing: "9:00 AM - 6:00 PM", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Dehradun+Uttarakhand" },
  { id: 28, name: "Bengal Delta Support", address: "Kolkata, West Bengal 700091", phone: "+91 33 2357 0000", timing: "10:00 AM - 7:00 PM", image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=400&q=60", googleMapsLink: "https://www.google.com/maps/search/Kolkata+West+Bengal" }
];

export default function ServiceCentersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCenters = indiaServiceCenters.filter((center) =>
    center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    center.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Our <span className="text-green-700 dark:text-green-500">Service Network</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
            Find agricultural expert support across 28 Indian states.
          </p>
        </div>

        {/* Search Bar Section */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by state, city, or center..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl focus:outline-none focus:border-green-600 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Results Grid */}
        {filteredCenters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {filteredCenters.map((center) => (
              <ServiceCentersCard
                key={center.id}
                {...center}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200">
            <MapPinned className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold">No Centers Found</h3>
            <button onClick={() => setSearchQuery('')} className="mt-4 text-green-700 font-bold hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}