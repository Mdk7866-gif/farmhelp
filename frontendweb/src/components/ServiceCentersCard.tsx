import { MapPin, Phone, Clock, ExternalLink } from 'lucide-react';

interface ServiceCenterProps {
  name: string;
  address: string;
  phone: string;
  timing: string;
  image: string;
  googleMapsLink: string; // Added prop
}

const ServiceCentersCard = ({ name, address, phone, timing, image, googleMapsLink }: ServiceCenterProps) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      <div className="relative h-48 sm:h-56 w-full shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-grow space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
          {name}
        </h3>

        <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 flex-grow">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
            <span className="leading-snug">{address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0" />
            <a href={`tel:${phone}`} className="hover:text-green-700 dark:hover:text-green-400 font-medium">{phone}</a>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
            <span>{timing}</span>
          </div>
        </div>

        <div className="pt-4 mt-auto">
          <a
            href={googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-700 dark:bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-800 dark:hover:bg-green-500 transition-all shadow-md active:scale-95"
          >
            Get Directions <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCentersCard;