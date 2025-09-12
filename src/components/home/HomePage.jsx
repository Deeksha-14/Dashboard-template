import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Workshop Portal
        </h1>
        {user ? (
          <div className="text-center">
            <p className="text-xl mb-4">Welcome back, {user.name}!</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">My Workshops</h2>
                <p>View and manage your workshop enrollments</p>
                {/* Add workshop list component here */}
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Available Workshops</h2>
                <p>Discover and enroll in new workshops</p>
                {/* Add workshop search component here */}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">Join our workshop community today!</p>
            <div className="space-x-4">
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;