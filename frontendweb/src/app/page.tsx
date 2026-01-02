'use client';

import { useState } from 'react';
import ApplicationForm from '@/components/ApplicationForm';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-4rem)] flex items-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center gap-10">

          {/* Left Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              Smart Farming <br />
              <span className="text-green-700 dark:text-green-500">Made Simple</span>
            </h1>

            <p className="mt-6 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
              Monitor your farms remotely, get instant alerts, and receive
              AI-based crop recommendations — all using your mobile phone.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/farms"
                className="px-8 py-4 bg-green-700 dark:bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-green-800 dark:hover:bg-green-500 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                View My Farms
              </a>

              <button
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-4 border-2 border-green-700 dark:border-green-500 text-green-700 dark:text-green-400 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
              >
                Application Form
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
              📞 Not educated? Visit our nearest service center.
            </p>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-lg aspect-square">
              {/* Abstract Background Blob (Optional, makes it look premium) */}
              <div className="absolute inset-0 bg-green-200 dark:bg-green-900/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>

              <img
                src="/hero-farm.png"
                alt="Smart farming monitoring dashboard on mobile and tablet"
                className="relative z-10 w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  );
}
