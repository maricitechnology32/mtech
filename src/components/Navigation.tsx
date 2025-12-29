import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
              TechVision
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
              Services
            </a>
            <a href="#why-us" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
              Why Choose Us
            </a>
            <a href="#partners" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
              Partners
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
              Testimonials
            </a>
            <a
              href="#contact"
              className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start Your Project
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <a
              href="#services"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Services
            </a>
            <a
              href="#why-us"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Why Choose Us
            </a>
            <a
              href="#partners"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Partners
            </a>
            <a
              href="#testimonials"
              className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 bg-blue-900 text-white rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Start Your Project
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
