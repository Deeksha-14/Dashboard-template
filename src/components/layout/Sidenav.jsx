import React from "react";
import { NavLink } from "react-router-dom";
import { Card, Typography, IconButton, Button } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenSidenav,
} from "../../context/index";
import { useAuth } from "../../context/AuthContext";
import { dashboardRoutes } from "../../routes.config";

export default function Sidenav() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { openSidenav, sidenavType, sidenavColor } = controller;
  const { user } = useAuth();
  const role = typeof user?.role === "string" ? user.role : user?.role?.name;

  // bg + text based on configurator
  const bg =
    sidenavType === "transparent"
      ? "bg-transparent"
      : sidenavType === "white"
      ? "bg-white"
      : sidenavColor === "blue"
      ? "bg-blue-900"
      : sidenavColor === "green"
      ? "bg-green-900"
      : sidenavColor === "red"
      ? "bg-red-900"
      : "bg-gray-900";

  const text = sidenavType === "dark" ? "text-white" : "text-blue-gray-800";

  // only show routes allowed for this role; hide dynamic :id pages
  const visibleRoutes = dashboardRoutes
    .filter((r) => !r.roles || r.roles.includes(role))
    .filter((r) => !r.path.includes(":"));

  // button color mapping for active gradient state
  const activeColor =
    sidenavColor === "white" || sidenavType !== "dark" ? "blue-gray" : sidenavColor;

  // render a single nav item as a Material Tailwind Button (matches P2 feel)
  const NavItem = ({ r }) => (
    <NavLink to={`/dashboard/${r.path}`} end={r.path.split("/").length === 1}>
      {({ isActive }) => (
        <Button
          variant={isActive ? "gradient" : "text"}
          color={isActive ? activeColor : sidenavType === "dark" ? "white" : "blue-gray"}
          className="flex items-center gap-3 px-4 py-2 capitalize w-full justify-start"
          fullWidth
        >
          {/* optional icon support: put `icon: SomeHeroIcon` on your route item */}
          {r.icon ? React.createElement(r.icon, { className: "h-5 w-5 opacity-70" }) : null}
          <Typography color="inherit" className="font-medium">{r.name}</Typography>
        </Button>
      )}
    </NavLink>
  );

  return (
    <>
      {/* desktop sidenav */}
      <Card className={`hidden md:block h-[calc(100vh-2rem)] w-64 m-4 p-4 ${bg} ${text} border`}>
        <Typography variant="h6" className="mb-6">QACC</Typography>
        <nav className="space-y-1">
          {visibleRoutes.map((r) => (
            <NavItem key={r.path} r={r} />
          ))}
        </nav>
      </Card>

      {/* mobile drawer */}
      <div
        className={[
          "fixed inset-0 z-50 md:hidden transition",
          openSidenav ? "visible opacity-100" : "invisible opacity-0",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setOpenSidenav(dispatch, false)}
        />
        <Card className={`absolute left-0 top-0 h-full w-72 p-4 ${bg} ${text} rounded-none`}>
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h6">QACC</Typography>
            <IconButton variant="text" onClick={() => setOpenSidenav(dispatch, false)}>
              <XMarkIcon className="h-5 w-5" />
            </IconButton>
          </div>
          <nav className="space-y-1">
            {visibleRoutes.map((r) => (
              <div key={r.path} onClick={() => setOpenSidenav(dispatch, false)}>
                <NavItem r={r} />
              </div>
            ))}
          </nav>
        </Card>
      </div>
    </>
  );
}
