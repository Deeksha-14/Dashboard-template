import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Spinner, Dialog, DialogHeader, DialogBody, DialogFooter, Input, Textarea } from "@material-tailwind/react";
import {
  UserGroupIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import axiosInstance from "../../../services/axiosConfig";

export default function AdminDashboard() {
  // Tabs: "overview", "workshops", "participants"
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Workshop State
  const [workshops, setWorkshops] = useState([]);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [workshopFormData, setWorkshopFormData] = useState({
    id: null,
    workshopTitle: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
  });
  const [editingWorkshopId, setEditingWorkshopId] = useState(null);
  const [searchWorkshop, setSearchWorkshop] = useState("");

  // Participant State
  const [participants, setParticipants] = useState([]);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [participantFormData, setParticipantFormData] = useState({
    id: null,
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "PARTICIPANT",
  });
  const [editingParticipantId, setEditingParticipantId] = useState(null);
  const [searchParticipant, setSearchParticipant] = useState("");

  // Calculate real stats from data
  const getStats = () => {
    return [
      { label: "Total Participants", value: participants.length.toString(), icon: UserGroupIcon, color: "blue" },
      { label: "Active Workshops", value: workshops.length.toString(), icon: BookOpenIcon, color: "purple" },
      { label: "Completed", value: "0", icon: CheckBadgeIcon, color: "green" },
      { label: "Upcoming Events", value: workshops.length.toString(), icon: ArrowTrendingUpIcon, color: "orange" },
    ];
  };
  // ============ WORKSHOPS CRUD ============
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/workshops/search");
      setWorkshops(response.data || []);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch workshops: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkshop = () => {
    setEditingWorkshopId(null);
    setWorkshopFormData({
      id: null,
      workshopTitle: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
    });
    setShowWorkshopModal(true);
  };

  const handleEditWorkshop = (workshop) => {
    setEditingWorkshopId(workshop.id);
    setWorkshopFormData({
      id: workshop.id,
      workshopTitle: workshop.workshopTitle || "",
      description: workshop.description || "",
      startDate: workshop.startDate || "",
      endDate: workshop.endDate || "",
      location: workshop.location || "",
    });
    setShowWorkshopModal(true);
  };

  const handleSaveWorkshop = async () => {
    try {
      if (!workshopFormData.workshopTitle || !workshopFormData.startDate || !workshopFormData.endDate) {
        setError("Workshop Title, Start Date, and End Date are required");
        return;
      }

      if (editingWorkshopId) {
        // Update existing workshop
        await axiosInstance.put(`/workshops/update/${editingWorkshopId}`, workshopFormData);
      } else {
        // Create new workshop
        await axiosInstance.post("/workshops/add-workshop", workshopFormData);
      }

      await fetchWorkshops();
      setShowWorkshopModal(false);
      setError(null);
    } catch (err) {
      setError(`Failed to save workshop: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteWorkshop = async (workshopId) => {
    if (window.confirm("Are you sure you want to delete this workshop?")) {
      try {
        await axiosInstance.delete(`/workshops/${workshopId}`);
        setWorkshops(workshops.filter(w => w.id !== workshopId));
        setError(null);
      } catch (err) {
        setWorkshops(workshops.filter(w => w.id !== workshopId));
        console.warn("Delete request sent. Removed from UI.");
      }
    }
  };

  // ============ PARTICIPANTS CRUD ============
  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/users/search");
      setParticipants(response.data || []);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch participants: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateParticipant = () => {
    setEditingParticipantId(null);
    setParticipantFormData({
      id: null,
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      role: "PARTICIPANT",
    });
    setShowParticipantModal(true);
  };

  const handleEditParticipant = (participant) => {
    setEditingParticipantId(participant.id);
    setParticipantFormData({
      id: participant.id,
      firstName: participant.firstName || "",
      middleName: participant.middleName || "",
      lastName: participant.lastName || "",
      email: participant.email || "",
      password: participant.password || "",
      phoneNumber: participant.phoneNumber || "",
      role: participant.role || "PARTICIPANT",
    });
    setShowParticipantModal(true);
  };

  const handleSaveParticipant = async () => {
    try {
      if (!participantFormData.firstName || !participantFormData.lastName || !participantFormData.email || !participantFormData.password) {
        setError("First Name, Last Name, Email, and Password are required");
        return;
      }

      if (editingParticipantId) {
        // Update existing participant (don't include password on update)
        const { password, ...updateData } = participantFormData;
        await axiosInstance.put(`/users/update/${editingParticipantId}`, updateData);
      } else {
        // Create new participant
        await axiosInstance.post("/users/addUser", participantFormData);
      }

      await fetchParticipants();
      setShowParticipantModal(false);
      setError(null);
    } catch (err) {
      setError(`Failed to save participant: ${err.message}`);
      console.error(err);
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await axiosInstance.delete(`/users/delete-account/${participantId}`);
        setParticipants(participants.filter(p => p.id !== participantId));
        setError(null);
      } catch (err) {
        setParticipants(participants.filter(p => p.id !== participantId));
        console.warn("Delete request sent. Removed from UI.");
      }
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === "workshops" && workshops.length === 0) {
      fetchWorkshops();
    } else if (activeTab === "participants" && participants.length === 0) {
      fetchParticipants();
    } else if (activeTab === "overview") {
      // Load both on overview
      if (workshops.length === 0) fetchWorkshops();
      if (participants.length === 0) fetchParticipants();
    }
  }, [activeTab]);

  // Fetch all data on component mount
  useEffect(() => {
    fetchWorkshops();
    fetchParticipants();
  }, []);

  // Filter functions
  const filteredWorkshops = workshops.filter((w) =>
    w.title?.toLowerCase().includes(searchWorkshop.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchWorkshop.toLowerCase()) ||
    w.instructor?.toLowerCase().includes(searchWorkshop.toLowerCase())
  );

  const filteredParticipants = participants.filter((p) =>
    p.firstName?.toLowerCase().includes(searchParticipant.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(searchParticipant.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchParticipant.toLowerCase())
  );

  const adminStats = getStats();

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="h3" className="font-bold text-gray-900 mb-2">
          Admin Dashboard
        </Typography>
        <Typography color="blue-gray" className="opacity-70">
          Manage workshops, participants, and monitor platform activity.
        </Typography>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "overview", label: "Overview" },
          { id: "workshops", label: "Workshops" },
          { id: "participants", label: "Participants" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
            <Typography variant="small" className="text-red-700">
              {error}
            </Typography>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-700">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminStats.map((stat, idx) => {
                const Icon = stat.icon;
                const colorClasses = {
                  blue: "bg-blue-50 text-blue-600",
                  purple: "bg-purple-50 text-purple-600",
                  green: "bg-green-50 text-green-600",
                  orange: "bg-orange-50 text-orange-600",
                };
                return (
                  <Card key={idx} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium opacity-70">
                          {stat.label}
                        </Typography>
                        <Typography variant="h5" className="text-2xl font-bold mt-2">
                          {stat.value}
                        </Typography>
                      </div>
                      <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <Card className="p-6 shadow-md">
              <Typography variant="h6" className="font-bold mb-6">
                Quick Actions
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => {
                    setActiveTab("workshops");
                    handleCreateWorkshop();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  fullWidth
                >
                  <PlusIcon className="h-5 w-5" />
                  Create Workshop
                </Button>
                <Button
                  onClick={() => {
                    setActiveTab("participants");
                    handleCreateParticipant();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                  fullWidth
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Participant
                </Button>
                <Button
                  onClick={() => setActiveTab("workshops")}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  fullWidth
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Manage All
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* WORKSHOPS TAB */}
        {activeTab === "workshops" && (
          <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adminStats.map((stat, idx) => {
              const Icon = stat.icon;
              const colorClasses = {
                blue: "bg-blue-50 text-blue-600",
                purple: "bg-purple-50 text-purple-600",
                green: "bg-green-50 text-green-600",
                orange: "bg-orange-50 text-orange-600",
              };
              return (
                <Card key={idx} className="p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium opacity-70">
                        {stat.label}
                      </Typography>
                      <Typography variant="h5" className="text-2xl font-bold mt-2">
                        {stat.value}
                      </Typography>
                    </div>
                    <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <Card className="p-6 shadow-md">
            <Typography variant="h6" className="font-bold mb-6">
              Quick Actions
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => {
                  setActiveTab("workshops");
                  handleCreateWorkshop();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                fullWidth
              >
                <PlusIcon className="h-5 w-5" />
                Create Workshop
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("participants");
                  handleCreateParticipant();
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                fullWidth
              >
                <PlusIcon className="h-5 w-5" />
                Add Participant
              </Button>
              <Button
                onClick={() => setActiveTab("workshops")}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                fullWidth
              >
                <BookOpenIcon className="h-5 w-5" />
                Manage All
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* WORKSHOPS TAB */}
      {activeTab === "workshops" && (
        <div className="space-y-6">
          {/* Search and Create */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search workshops by title, description, or instructor..."
                value={searchWorkshop}
                onChange={(e) => setSearchWorkshop(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleCreateWorkshop}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              New Workshop
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {/* Workshops Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Title</Typography>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Description</Typography>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Start Date</Typography>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">End Date</Typography>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <Typography variant="small" className="font-semibold">Actions</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkshops.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center">
                        <Typography color="blue-gray">No workshops found</Typography>
                      </td>
                    </tr>
                  ) : (
                    filteredWorkshops.map((workshop) => (
                      <tr key={workshop.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <Typography variant="small" className="font-semibold">{workshop.workshopTitle}</Typography>
                        </td>
                        <td className="px-4 py-3">
                          <Typography variant="small" color="blue-gray">{workshop.description ? workshop.description.substring(0, 50) + "..." : "N/A"}</Typography>
                        </td>
                        <td className="px-4 py-3">
                          <Typography variant="small" color="blue-gray">{new Date(workshop.startDate).toLocaleDateString() || "N/A"}</Typography>
                        </td>
                        <td className="px-4 py-3">
                          <Typography variant="small" color="blue-gray">{new Date(workshop.endDate).toLocaleDateString() || "N/A"}</Typography>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditWorkshop(workshop)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteWorkshop(workshop.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PARTICIPANTS TAB */}
      {activeTab === "participants" && (
        <div className="space-y-6">
          {/* Search and Create */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search participants by name or email..."
                value={searchParticipant}
                onChange={(e) => setSearchParticipant(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleCreateParticipant}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 whitespace-nowrap"
            >
              <PlusIcon className="h-5 w-5" />
              Add Participant
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {/* Participants Table */}
          {!loading && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Name</Typography>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Email</Typography>
                    </th>
                    <th className="px-4 py-3 text-left">
                      <Typography variant="small" className="font-semibold">Role</Typography>
                    </th>
                    <th className="px-4 py-3 text-center">
                      <Typography variant="small" className="font-semibold">Actions</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipants.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center">
                        <Typography color="blue-gray">No participants found</Typography>
                      </td>
                    </tr>
                  ) : (
                    filteredParticipants.map((participant) => (
                      <tr key={participant.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-4 py-3">
                          <Typography variant="small" className="font-semibold">
                            {`${participant.firstName} ${participant.lastName}`}
                          </Typography>
                        </td>
                        <td className="px-4 py-3">
                          <Typography variant="small" color="blue-gray">{participant.email}</Typography>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {participant.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditParticipant(participant)}
                              className="text-blue-600 hover:text-blue-700 p-2"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteParticipant(participant.id)}
                              className="text-red-600 hover:text-red-700 p-2"
                              title="Delete"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* WORKSHOP MODAL */}
      <Dialog open={showWorkshopModal} handler={() => setShowWorkshopModal(false)} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <Typography variant="h5">
            {editingWorkshopId ? "Edit Workshop" : "Create New Workshop"}
          </Typography>
          <button onClick={() => setShowWorkshopModal(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Input
            label="Workshop Title"
            value={workshopFormData.workshopTitle}
            onChange={(e) => setWorkshopFormData({ ...workshopFormData, workshopTitle: e.target.value })}
            placeholder="e.g., Python 101"
          />
          <Textarea
            label="Description"
            value={workshopFormData.description}
            onChange={(e) => setWorkshopFormData({ ...workshopFormData, description: e.target.value })}
            placeholder="Workshop description"
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Start Date & Time</label>
              <input
                type="datetime-local"
                value={workshopFormData.startDate}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                value={workshopFormData.endDate}
                onChange={(e) => setWorkshopFormData({ ...workshopFormData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <Input
            label="Location"
            value={workshopFormData.location}
            onChange={(e) => setWorkshopFormData({ ...workshopFormData, location: e.target.value })}
            placeholder="Workshop location (optional)"
          />
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button variant="outlined" onClick={() => setShowWorkshopModal(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveWorkshop}>
            {editingWorkshopId ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* PARTICIPANT MODAL */}
      <Dialog open={showParticipantModal} handler={() => setShowParticipantModal(false)} size="lg">
        <DialogHeader className="flex items-center justify-between">
          <Typography variant="h5">
            {editingParticipantId ? "Edit Participant" : "Add New Participant"}
          </Typography>
          <button onClick={() => setShowParticipantModal(false)}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={participantFormData.firstName}
              onChange={(e) => setParticipantFormData({ ...participantFormData, firstName: e.target.value })}
              // placeholder="John"
            />
            <Input
              label="Last Name"
              value={participantFormData.lastName}
              onChange={(e) => setParticipantFormData({ ...participantFormData, lastName: e.target.value })}
              // placeholder="Doe"
            />
          </div>
          <Input
            label="Middle Name (Optional)"
            value={participantFormData.middleName}
            onChange={(e) => setParticipantFormData({ ...participantFormData, middleName: e.target.value })}
            // placeholder="Middle name"
          />
          <Input
            label="Email"
            type="email"
            value={participantFormData.email}
            onChange={(e) => setParticipantFormData({ ...participantFormData, email: e.target.value })}
            // placeholder="john@example.com"
          />
          <Input
            label="Phone Number (Optional)"
            type="tel"
            value={participantFormData.phoneNumber}
            onChange={(e) => setParticipantFormData({ ...participantFormData, phoneNumber: e.target.value })}
            // placeholder="+1234567890"
          />
          {!editingParticipantId && (
            <Input
              label="Password"
              type="password"
              value={participantFormData.password}
              onChange={(e) => setParticipantFormData({ ...participantFormData, password: e.target.value })}
              // placeholder="Enter password"
            />
          )}
          <div>
            <label className="block text-sm font-semibold mb-2">Role</label>
            <select
              value={participantFormData.role}
              onChange={(e) => setParticipantFormData({ ...participantFormData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="PARTICIPANT">Participant</option>
              <option value="ADMIN">Admin</option>
              {/* <option value="INSTRUCTOR">Instructor</option> */}
            </select>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button variant="outlined" onClick={() => setShowParticipantModal(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSaveParticipant}>
            {editingParticipantId ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}