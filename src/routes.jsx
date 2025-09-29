import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

import AdminHome from "./components/admin/AdminHome";
import ParticipantHome from "./components/participant/ParticipantHome";
import ParticipantProfile from "./components/participant/ParticipantProfile";
import WorkshopForm from "./components/workshops/WorkshopForm";
import WorkshopDetails from "./components/participant/WorkshopDetails";
import EnrolledWorkshops from "./components/participant/EnrolledWorkshops";
import WorkshopParticipants from "./components/admin/WorkshopParticipants";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import { Home, Profile, Tables, Notifications } from "../src/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Admin Dashboard",
        path: "/admin",
        element: <AdminHome />,
        roles: ["ADMIN"],
      },
      {
        icon: <HomeIcon {...icon} />,
        name: "Participant Dashboard",
        path: "/dashboard",
        element: <ParticipantHome />,
        roles: ["PARTICIPANT"],
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/participant/profile",
        element: <ParticipantProfile />,
        roles: ["PARTICIPANT"],
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "Enrolled Workshops",
        path: "/enrolled-workshops",
        element: <EnrolledWorkshops />,
        roles: ["PARTICIPANT"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Workshop Participants",
        path: "/admin/workshops/:workshopId/participants",
        element: <WorkshopParticipants />,
        roles: ["ADMIN"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Create Workshop",
        path: "/workshops/create",
        element: <WorkshopForm />,
        roles: ["ADMIN"],
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "Workshop Details",
        path: "/workshops/:id",
        element: <WorkshopDetails />,
        roles: ["PARTICIPANT", "ADMIN"], // both can see details
      },{
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "Auth Pages",
    layout: "auth",
    pages: [
      {
        name: "Login",
        path: "/login",
        element: <Login />,
      },
      {
        name: "Register",
        path: "/register",
        element: <Register />,
      },
    ],
  },
];


export default routes;