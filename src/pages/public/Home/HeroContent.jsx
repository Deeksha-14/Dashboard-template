import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Particles from "../../bits/Particles";
import Typed from 'typed.js';
import React, { useEffect, useRef } from 'react';
 
export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const typedRef = useRef(null);
const typed = useRef(null);

useEffect(() => {
  const options = {
    strings: ['Computing', 'Learning', 'Experience'],
    typeSpeed: 100,
    backSpeed: 70,
    backDelay: 2000,
    loop: true,
  };

  if (typedRef.current) {
    typed.current = new Typed(typedRef.current, options);
  }

  return () => {
    if (typed.current) {
      typed.current.destroy();
    }
  };
}, []);

  return (
     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={300}
          particleSpread={5}
          speed={0.5}
          particleColors={['#ffffff', '#b6d7a8', '#1abc9c', '#20124d', '#ffff55', '#134f5c', '#6fa8dc', '#ff5733']}
          moveParticlesOnHover={true}
          particleHoverFactor={2}
          alphaParticles={false}
          particleBaseSize={100}
          sizeRandomness={1}
          cameraDistance={25}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      {/* Hero Content - Foreground */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Welcome to Quantum 
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            <span ref={typedRef}></span>
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover the power of quantum computing through our interactive workshops and hands-on learning experiences.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition-opacity">
            <Link
                          to="/auth/sign-in"
                          
                        >
                          Get Started
                        </Link>
          </button>
          <button className="px-8 py-3 text-lg font-medium text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}