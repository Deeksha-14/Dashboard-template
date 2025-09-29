import { Icon } from "@mui/material";
import AdminDashboard from "./pages/admin/AdminDashboard"
import ParticipantDashboard from "./pages/participant/ParticipantDashboard"
import { HomeIcon, UserCircleIcon } from "@heroicons/react/24/solid";




export const dashboardRoutes = [
  // ADMIN-only
  { name: "Admin Dashboard", path: "admin", element: <AdminDashboard/>, roles: ["ADMIN"], icon: HomeIcon },

  // PARTICIPANT-only
  { name: "Participant Dashboard", path: "participant", element: <ParticipantDashboard/>, roles: ["PARTICIPANT"], icon: UserCircleIcon },

  // add more items later (profile, workshops, etc.)
];