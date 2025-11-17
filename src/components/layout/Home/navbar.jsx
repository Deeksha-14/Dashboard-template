import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-700">
  <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      {/* Logo Section - shifted more to the left */}
      <div className="flex items-center space-x-3 -ml-4 lg:-ml-6">
        <Link to="/" className="flex items-center space-x-3 -ml-4 lg:-ml-6 no-underline">
        <div className="flex items-center space-x-2">
          <img src="../../../../public/images/cdacblue.png" alt='CDAC Logo' className="w-8 h-8" />
        </div>
        <span className="text-xl font-bold text-white">QKaryashala</span>
        </Link>
      </div>

      {/* Search Bar - center section */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-gray-800 transition-all"
          />
          <svg 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Auth Buttons - shifted more to the right */}
      <div className="flex items-center space-x-3 -mr-4 lg:-mr-6">
        <Link
          to="/auth/sign-in"
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors"
        >
          Log In
        </Link>
        <Link
          to="/auth/sign-up"
          className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-gray-500 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
</nav>



     // ----------------------- first full screen navbar
    // <nav className="fixed top-0 left-0 right-0 z-50 border-b-blue-gray-900 backdrop-blur-md border-b border-b-gray-800">
    //   <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    //     <div className="flex justify-between items-center h-16">
    //       {/* Logo Section */}
    //       <div className="flex items-center space-x-3">
    //         <div className="flex items-center space-x-2">
    //           {/* Replace with your actual logo images */}
    //           {/* <div className="w-8 h-8 bg-blue-500 rounded"></div> */}
    //           <img src="../../../../public/img/cdacblue.png" alt='CDAC Logo' className="w-8 h-8" /> 
    //           {/* <div className="w-8 h-8 bg-purple-500 rounded"></div> */}
    //         </div>
    //         <span className="text-xl font-bold text-white">QKS</span>
    //       </div>

    //       {/* Auth Buttons */}
    //       <div className="flex items-center space-x-3">
    //         <Link
    //           to="/auth/sign-in"
    //           className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
    //         >
    //           Log In
    //         </Link>
    //         <Link
    //           to="/auth/sign-up"
    //           className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    //         >
    //           Sign Up
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </nav>


    // ----------------------------------------------------
//     <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md border border-gray-700 rounded-full shadow-lg">
//   <div className="px-8 sm:px-12">
//     <div className="flex justify-between items-center h-14 gap-8 sm:gap-16">
//       {/* Logo Section - shifted left */}
//       <div className="flex items-center space-x-3 -ml-2">
//         <div className="flex items-center space-x-2">
//           <img src="../../../../public/img/cdacblue.png" alt='CDAC Logo' className="w-8 h-8" />
//         </div>
//         <span className="text-xl font-bold text-white">QKS</span>
//       </div>

//       {/* Search Bar - center */}
//       <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
//         <div className="relative w-full">
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full px-4 py-1.5 bg-white/10 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white/20 transition-all"
//           />
//           <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>
//       </div>

//       {/* Auth Buttons - shifted right */}
//       <div className="flex items-center space-x-3 -mr-2">
//         <Link
//           to="/auth/sign-in"
//           className="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
//         >
//           Log In
//         </Link>
//         <Link
//           to="/auth/sign-up"
//           className="px-4 py-1.5 text-sm font-medium text-white bg-transparent border border-white rounded-full hover:bg-white/10 transition-colors"
//         >
//           Sign Up
//         </Link>
//       </div>
//     </div>
//   </div>
// </nav>
  );
};

export default Navbar;