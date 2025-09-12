import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { useAuth } from '../../context/AuthContext';

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axiosInstance.get('/workshops/search');
        setWorkshops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch workshops');
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  if (loading) return <div>Loading workshops...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Available Workshops</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workshops.map((workshop) => (
          <div key={workshop.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-2">{workshop.title}</h3>
            <p className="text-gray-600 mb-4">{workshop.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Date: {new Date(workshop.date).toLocaleDateString()}
              </span>
              <button 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => {/* Implement enrollment logic */}}
              >
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkshopList;