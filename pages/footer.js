import Link from 'next/link';
import React from 'react';
import { FaGithubAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-300 pt-14 pb-10 px-4 md:px-20 mt-20">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-blue-700 pb-12">
  
        {/* Logo & Mission */}
        <div>
          <h2 className="text-2xl font-bold text-white">HealConnect</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-400">
            Bridging healthcare and technology to deliver smarter, faster, and secure patient solutions.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-white">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="#" className="hover:text-white">How it Works</Link></li>
            <li><Link href="#" className="hover:text-white">Open Source</Link></li>
            <li><Link href="#" className="hover:text-white">Contributors</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-white">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white">Terms & Conditions</Link></li>
            <li><a href="mailto:dipanitamondal@gmail.com" className="hover:text-white">Contact Support</a></li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="text-lg font-semibold mb-5 text-white">Connect With Us</h4>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/Dipanita45/HEALCONNECT"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaGithubAlt size={24} />
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">Have feedback or ideas? Reach out — we’d love to hear from you!</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center mt-8 text-xs text-gray-500">
        © {new Date().getFullYear()} HealConnect Inc. All rights reserved.
      </div>
    </footer>
  );
}
