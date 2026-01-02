'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Farms', href: '/farms' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin', href: '/admin' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-green-700 dark:text-green-500 flex items-center gap-2">
              <span>FarmHelp</span>
              <span className="text-2xl">🌱</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex items-baseline space-x-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                        ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle Button */}
            <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
                      ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                      : 'text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
