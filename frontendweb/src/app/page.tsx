'use client';

import { useState } from 'react';
import Link from 'next/link';
import ApplicationForm from '@/components/ApplicationForm';


export default function HomePage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const videoId = "dQw4w9WgXcQ"; 

  return (
    <>
      <section className="bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-4rem)] flex items-center transition-colors duration-300">
        {/* CHANGED: Increased max-w-screen-2xl to provide more horizontal space */}
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-20 flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">

          {/* LEFT CONTENT - Slightly narrower to make room for video */}
          <div className="w-full md:w-[45%] text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
              Smart Farming <br />
              <span className="text-green-700 dark:text-green-500">
                Made Simple
              </span>
            </h1>

            <p className="mt-8 text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0">
              Monitor your farms remotely, get instant alerts, and receive
              AI-based crop recommendations — all using your mobile phone.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <Link
                href="/farms"
                className="px-10 py-4 bg-green-700 dark:bg-green-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:bg-green-800 dark:hover:bg-green-500 transform hover:-translate-y-1 transition-all duration-200 text-center"
              >
                View My Farms
              </Link>

              <button
                onClick={() => setIsFormOpen(true)}
                className="px-10 py-4 border-2 border-green-700 dark:border-green-500 text-green-700 dark:text-green-400 rounded-2xl font-bold hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
              >
                Application Form
              </button>
            </div>

            <p className="mt-10 text-sm text-gray-500 dark:text-gray-400 font-medium">
              📞 Not educated?{' '}
              <Link 
                href="/service-centers" 
                className="text-green-700 dark:text-green-500 hover:underline font-bold transition-colors"
              >
                Visit our nearest service center.
              </Link>
            </p>
          </div>

          {/* RIGHT SIDE – VIDEO SECTION */}
<div className="w-full md:w-[55%] flex justify-center">
  <div className="relative w-full max-w-4xl lg:max-w-5xl">

    {/* 1. Added pointer-events-none so the glow never blocks a touch */}
    <div className="absolute -inset-10 bg-gradient-to-tr from-green-300/40 via-emerald-200/30 to-green-100/20 
                    dark:from-green-900/40 dark:via-emerald-800/30 dark:to-green-700/20
                    rounded-[3rem] blur-3xl opacity-80 pointer-events-none" />
{/* Video Player Card */}
<div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-white/40 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl aspect-video z-10">
  
  <iframe
    className="w-full h-full"
    src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`}
    title="Smart Farming Demo"
    frameBorder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowFullScreen
  ></iframe>

  {/* Gradient Overlay - Must have pointer-events-none to allow clicking the video below */}
  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
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