import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-self-center">
          {/* About Section */}
          <div className='place-items-center'>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-gray-400 text-justify leading-relaxed">
              Quantum Accelerator is a cutting-edge research group focused on advancing quantum acceleration technologies. Leveraging the power of GPUs, FPGAs, and supercomputers, we drive innovation in computational efficiency and performance, pushing the boundaries of quantum computing for real-world applications.
            </p>
          </div>

          {/* Quick Links */}
          <div className='place-items-center'>
            <h3 className="text-xl font-bold mb-4 ">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className='place-items-center'>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: qacc@cdac.in<br />
              Phone: +91-020-25503487 
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 QACC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;