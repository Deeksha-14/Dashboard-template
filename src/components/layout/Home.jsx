import React from 'react';
import Hero from './Home/HeroContent';
import Navbar from './Home/navbar';
import Footer from './Home/footer';
import Features from './Home/features'

export default function Home() {


return(
  <div> 
    <Navbar />
    <main>
      <Hero />
       {/* Features Section */}
      <div className="relative z-10">
        <Features />
      </div>
    </main>
    <Footer/>
  </div>

);


}













//-------------------------- working
// src/pages/public/Home.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import Particles from "../bits/Particles";
// import Typed from 'typed.js';
// import React, { useEffect, useRef } from 'react';
 
// export default function Home() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
  
//   const typedRef = useRef(null);
// const typed = useRef(null);

// useEffect(() => {
//   const options = {
//     strings: ['Computing', 'Learning', 'Experience'],
//     typeSpeed: 100,
//     backSpeed: 70,
//     backDelay: 2000,
//     loop: true,
//   };

//   if (typedRef.current) {
//     typed.current = new Typed(typedRef.current, options);
//   }

//   return () => {
//     if (typed.current) {
//       typed.current.destroy();
//     }
//   };
// }, []);

//   return (
//      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
//       {/* Particles Background */}
//       <div className="absolute inset-0 z-0">
//         <Particles
//           particleCount={300}
//           particleSpread={5}
//           speed={0.5}
//           particleColors={['#ffffff', '#b6d7a8', '#1abc9c', '#20124d', '#ffff55', '#134f5c']}
//           moveParticlesOnHover={true}
//           particleHoverFactor={2}
//           alphaParticles={false}
//           particleBaseSize={100}
//           sizeRandomness={1}
//           cameraDistance={25}
//           disableRotation={false}
//           className="w-full h-full"
//         />
//       </div>

//       {/* Hero Content - Foreground */}
//       <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
//           Welcome to Quantum 
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
//             <span ref={typedRef}></span>
//           </span>
//         </h1>
//         <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
//           Discover the power of quantum computing through our interactive workshops and hands-on learning experiences.
//         </p>
//         <div className="flex flex-col sm:flex-row gap-4 justify-center">
//           <button className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">
//             Get Started
//           </button>
//           <button className="px-8 py-3 text-lg font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
//             Learn More
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }




// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// export default function Home() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const goToDashboard = () => {
//     // send logged-in users straight to their dashboard
//     const role = typeof user?.role === "string" ? user.role : user?.role?.name;
//     navigate(role === "ADMIN" ? "/dashboard/admin" : "/dashboard/participant", { replace: true });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="max-w-2xl w-full bg-white rounded-2xl shadow p-8 text-center space-y-6">
//         <h1 className="text-3xl font-bold">Welcome to QACC</h1>
//         <p className="text-gray-600">
//           This is a placeholder Home. Choose an action to continue.
//         </p>

//         {/* If already logged in, show a single-click action to finish */}
//         {user ? (
//           <button
//             onClick={goToDashboard}
//             className="w-full sm:w-auto px-5 py-2.5 rounded-lg border bg-gray-900 text-white hover:opacity-90"
//           >
//             Go to Dashboard
//           </button>
//         ) : (
//           <div className="flex flex-col sm:flex-row gap-3 justify-center">
//             <Link
//               to="/auth/sign-in"
//               className="px-5 py-2.5 rounded-lg border bg-gray-900 text-white text-center hover:opacity-90"
//             >
//               Log In
//             </Link>
//             <Link
//               to="/auth/sign-up"
//               className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-900 text-center hover:bg-gray-50"
//             >
//               Sign Up
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
