'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' ? 'text-blue-600' : 'text-gray-700';
    }
    return pathname.startsWith(path) ? 'text-blue-600' : 'text-gray-700';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center h-16">
          <div className="flex items-center space-x-8">
            <Link 
              href="/"
              className={`text-xl font-bold hover:text-blue-700 transition duration-300 ${isActive('/')}`}
            >
              Tripro
            </Link>
            <Link 
              href="/how-it-works"
              className={`py-4 px-2 hover:text-blue-600 transition duration-300 ${isActive('/how-it-works')}`}
            >
              How It Works
            </Link>
            <Link 
              href="/passenger/proposal-dashboard"
              className={`py-4 px-2 hover:text-blue-600 transition duration-300 ${isActive('/passenger')}`}
            >
              Passenger
            </Link>
            <Link 
              href="/airline/proposal-dashboard"
              className={`py-4 px-2 hover:text-blue-600 transition duration-300 ${isActive('/airline')}`}
            >
              Airline
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 