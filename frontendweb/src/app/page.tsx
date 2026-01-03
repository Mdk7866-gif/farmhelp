'use client';

import { useState } from 'react';
import Link from 'next/link'; // Import Link
import ApplicationForm from '@/components/ApplicationForm';

export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-4rem)] flex items-center transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col-reverse md:flex-row items-center gap-12">

          {/* LEFT CONTENT */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              Smart Farming <br />
              <span className="text-green-700 dark:text-green-500">
                Made Simple
              </span>
            </h1>

            <p className="mt-6 text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
              Monitor your farms remotely, get instant alerts, and receive
              AI-based crop recommendations — all using your mobile phone.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/farms"
                className="px-8 py-4 bg-green-700 dark:bg-green-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:bg-green-800 dark:hover:bg-green-500 transform hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                View My Farms
              </Link>

              <button
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-4 border-2 border-green-700 dark:border-green-500 text-green-700 dark:text-green-400 rounded-xl font-semibold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
              >
                Application Form
              </button>
            </div>

            {/* UPDATED LINK SECTION */}
            <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-medium">
              📞 Not educated?{' '}
              <Link 
                href="/service-centers" 
                className="text-green-700 dark:text-green-500 hover:underline font-bold transition-colors"
              >
                Visit our nearest service center.
              </Link>
            </p>
          </div>

          {/* RIGHT IMAGE – ENHANCED & MOBILE FIRST */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">

              {/* Gradient Glow Background */}
              <div className="absolute -inset-6 bg-gradient-to-tr from-green-300 via-emerald-200 to-green-100 
                              dark:from-green-900/40 dark:via-emerald-800/30 dark:to-green-700/20
                              rounded-[2.5rem] blur-3xl opacity-70" />

              {/* Image Card */}
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl">

                <img
                  src="/hero-farm.png"
                  alt="Smart farming monitoring via mobile"
                  className="w-full h-auto object-cover"
                />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />
              </div>

              {/* Floating Badge – Sensor */}
              <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-900 shadow-lg rounded-xl px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400">
                🌱 Soil Sensors
              </div>

              {/* Floating Badge – AI */}
              <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-900 shadow-lg rounded-xl px-3 py-2 text-xs font-semibold text-green-700 dark:text-green-400">
                🤖 AI Crop Advice
              </div>
            </div>
          </div>

        </div>
      </section>

      <ApplicationForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}