// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-gray-800 text-white">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="text-xl font-bold">
//             Workshop Portal
//           </Link>

//           <div className="flex items-center gap-6">
//             {user ? (
//               <>
//                 {user.role === 'ADMIN' && (
//                   <Link
//                     to="/admin"
//                     className="text-gray-300 hover:text-white"
//                   >
//                     Admin Dashboard
//                   </Link>
//                 )}
//                 <Link
//                   to="/workshops"
//                   className="text-gray-300 hover:text-white"
//                 >
//                   Workshops
//                 </Link>
//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-300">
//                     Welcome, {user.firstName}
//                   </span>
//                   <button
//                     onClick={handleLogout}
//                     className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <div className="space-x-4">
//                 <Link
//                   to="/login"
//                   className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/register"
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;