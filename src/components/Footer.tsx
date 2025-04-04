import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-16 py-6 relative z-10 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm justify-items-center mb-8">
          {/* Product Section */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-gray-400 uppercase mb-4">PRODUCT</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-500 hover:text-gray-900">Features</Link></li>
              <li><Link to="/pricing" className="text-gray-500 hover:text-gray-900">Pricing</Link></li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-gray-400 uppercase mb-4">SUPPORT</h3>
            <ul className="space-y-2">
              <li><Link to="/help" className="text-gray-500 hover:text-gray-900">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-gray-900">Contact Us</Link></li>
            </ul>
          </div>

          {/* Company Section */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-gray-400 uppercase mb-4">COMPANY</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-500 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-500 hover:text-gray-900">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-500 hover:text-gray-900">Blog</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="text-center w-full">
            <h3 className="font-semibold text-gray-400 uppercase mb-4">LEGAL</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-gray-500 hover:text-gray-900">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Logo centered */}
        <div className="flex justify-center my-6">
          <Logo className="text-2xl" />
        </div>

        {/* Social Links & Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Github className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          
          <p className="text-sm text-gray-400">
            © {currentYear} Purple Startups . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}