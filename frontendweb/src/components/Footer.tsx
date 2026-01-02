import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-50 dark:bg-gray-900 border-t border-green-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Main Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">

          {/* Brand */}
          <div>
            <h2 className="text-lg font-semibold text-green-700 dark:text-green-500">
              FarmHelp 🌱
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">
              Smart farming services using IoT sensors, real-time monitoring,
              and AI-based crop recommendations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><Link href="/" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link href="/farms" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">Farms</Link></li>
              <li><Link href="/about" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-green-700 dark:hover:text-green-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Services
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Soil Moisture Monitoring</li>
              <li>Water Tank Level Alerts</li>
              <li>Call Alert System</li>
              <li>AI Crop Prediction</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Contact
            </h3>
            <p className="text-gray-600 dark:text-gray-400">📞 +91 XXXXX XXXXX</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">📍 Visit nearest service center</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">🕒 9 AM – 6 PM</p>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="mt-10 pt-4 border-t border-green-200 dark:border-gray-800 text-center text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FarmHelp. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
