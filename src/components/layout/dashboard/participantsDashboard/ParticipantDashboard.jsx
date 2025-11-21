import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Typography, Card, Spinner } from "@material-tailwind/react";
import { BookOpenIcon, CalendarIcon, CodeBracketSquareIcon, ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import axiosInstance from "../../../services/axiosConfig";

// Workshop Card Component
const WorkshopCard = ({ workshop, type, onViewDetails, onRegister }) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (type === "enrolled") {
      onViewDetails && onViewDetails(workshop);
    } else {
      setLoading(true);
      try {
        await onRegister(workshop);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Typography variant="h6" className="text-gray-900 font-bold flex-1">
          {workshop.title}
        </Typography>
        {type === "enrolled" && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Enrolled
          </span>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>{workshop.startDate || workshop.date}</span>
        </div>
        {workshop.startTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🕐</span>
            <span>{workshop.startTime}</span>
          </div>
        )}
      </div>

      {workshop.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {workshop.description}
        </p>
      )}

      {type === "enrolled" ? (
        <button
          onClick={handleAction}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group"
        >
          View Details
          <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      ) : (
        <button
          onClick={handleAction}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          {loading ? <Spinner className="h-4 w-4" /> : <ArrowRightIcon className="h-4 w-4" />}
          {loading ? "Registering..." : "Register"}
        </button>
      )}
    </Card>
  );
};

export default function ParticipantDashboard() {
  const { user } = useAuth();
  const [enrolledWorkshops, setEnrolledWorkshops] = useState([]);
  const [upcomingWorkshops, setUpcomingWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // DEBUG: Log user object to verify structure
  useEffect(() => {
    console.log("✅ ParticipantDashboard loaded for user:", user?.firstName || user?.email);
  }, [user]);

  // Fetch workshop data on component mount
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        setError(null);

        let enrolled = [];
        let upcoming = [];

        // Get userId - user object has id field
        const userId = user?.id;

        // Fetch enrolled workshops
        if (userId) {
          try {
            const response = await axiosInstance.get(`/workshops/participant/${userId}`);
            enrolled = response.data || [];
          } catch (err) {
            console.error("Error fetching enrolled workshops:", err.message);
            setError(`Failed to load enrolled workshops: ${err.message}`);
          }
        }

        // Fetch upcoming workshops
        try {
          const response = await axiosInstance.get("/workshops/upcoming");
          upcoming = response.data || [];
        } catch (err) {
          console.error("Error fetching upcoming workshops:", err.message);
          setError(`Failed to load upcoming workshops: ${err.message}`);
        }

        setEnrolledWorkshops(enrolled || []);
        setUpcomingWorkshops(upcoming || []);
      } catch (err) {
        console.error("Unexpected error in fetchWorkshops:", err);
        setError(`Unexpected error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, [user]);

  const handleViewDetails = (workshop) => {
    console.log("View details for workshop:", workshop);
    // TODO: Navigate to workshop detail page
  };

  const handleRegister = async (workshop) => {
    try {
      const userId = user?.id || user?.sub;
      if (!userId) {
        setError("User ID not available. Please log in again.");
        return;
      }
      console.log(`Registering userId ${userId} for workshop ${workshop.id}`);
      const response = await axiosInstance.post(`/workshops/${workshop.id}/participants`, { participantId: userId });
      console.log("✓ Successfully registered for workshop", response.data);
      // Refresh enrolled workshops
      const updated = await axiosInstance.get(`/workshops/participant/${userId}`);
      setEnrolledWorkshops(updated.data || []);
    } catch (err) {
      console.error("Error registering for workshop:", err);
      setError(`Failed to register: ${err.message}`);
    }
  };

  const handleHubLogin = () => {
    window.open("http://10.208.22.57:8000/hub/login", "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 mx-auto" />
          <Typography variant="paragraph">Loading your workshops...</Typography>
          <Typography variant="small" className="text-gray-500">
            If this spinner doesn't disappear, check console for errors
          </Typography>
        </div>
      </div>
    );
  }

  // FALLBACK: If not loading but no data, show this instead of blank screen
  if (!user) {
    return (
      <div className="w-full p-8">
        <Card className="p-8 bg-yellow-50 border border-yellow-200">
          <Typography variant="h6" className="text-yellow-900">
            Not Authenticated
          </Typography>
          <Typography className="text-yellow-700">
            You are not logged in. Please log in first.
          </Typography>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <ExclamationCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <Typography variant="h6" className="text-red-900">
              Error loading workshops
            </Typography>
            <Typography variant="small" className="text-red-700">
              {error}
            </Typography>
            <Typography variant="small" className="text-red-600 mt-2">
              Check your backend server logs for details (500 errors indicate backend issues).
            </Typography>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white shadow-lg">
        <Typography variant="h3" className="font-bold mb-2">
          Welcome back, {user?.firstName || user?.name || "Participant"}!
        </Typography>
        <Typography className="text-blue-100">
          Continue your learning journey with our interactive workshops and access our Jupyter Lab.
        </Typography>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium opacity-70">
                Enrolled Workshops
              </Typography>
              <Typography variant="h4" className="text-2xl font-bold text-blue-600 mt-2">
                {enrolledWorkshops.length}
              </Typography>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium opacity-70">
                Upcoming Events
              </Typography>
              <Typography variant="h4" className="text-2xl font-bold text-purple-600 mt-2">
                {upcomingWorkshops.length}
              </Typography>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="small" color="blue-gray" className="font-medium opacity-70">
                Jupyter Lab Access
              </Typography>
              <Typography variant="h4" className="text-2xl font-bold text-green-600 mt-2">
                Ready
              </Typography>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <CodeBracketSquareIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Your Workshops Section */}
      <section>
        <div className="mb-6">
          <Typography variant="h5" className="font-bold text-gray-900">
            Your Enrolled Workshops
          </Typography>
          <Typography variant="small" color="blue-gray">
            Continue where you left off
          </Typography>
        </div>
        {enrolledWorkshops.length === 0 ? (
          <Card className="p-8 text-center bg-blue-50">
            <BookOpenIcon className="h-12 w-12 mx-auto text-blue-300 mb-3" />
            <Typography variant="h6" className="text-blue-900">
              No enrolled workshops yet
            </Typography>
            <Typography variant="small" className="text-blue-700">
              Browse upcoming workshops and register to get started
            </Typography>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                type="enrolled"
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Workshops Section */}
      <section>
        <div className="mb-6">
          <Typography variant="h5" className="font-bold text-gray-900">
            Upcoming Workshops
          </Typography>
          <Typography variant="small" color="blue-gray">
            Discover new learning opportunities
          </Typography>
        </div>
        {upcomingWorkshops.length === 0 ? (
          <Card className="p-8 text-center bg-purple-50">
            <CalendarIcon className="h-12 w-12 mx-auto text-purple-300 mb-3" />
            <Typography variant="h6" className="text-purple-900">
              No upcoming workshops
            </Typography>
            <Typography variant="small" className="text-purple-700">
              Check back soon for new learning opportunities
            </Typography>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                type="upcoming"
                onRegister={handleRegister}
              />
            ))}
          </div>
        )}
      </section>

      {/* Hub Login CTA - Fixed Bottom Right */}
      <div className="fixed bottom-8 right-8 z-40">
        <button
          onClick={handleHubLogin}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
        >
          <CodeBracketSquareIcon className="h-5 w-5" />
          Run Code on Jupyter
        </button>
      </div>
    </div>
  );
}
