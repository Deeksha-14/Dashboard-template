import { useLocation, Link } from "react-router-dom";
import {
  Navbar, Typography, Button, IconButton, Breadcrumbs, Input, Menu, MenuHandler, MenuList, MenuItem,
} from "@material-tailwind/react";
import { BellIcon, Bars3Icon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController, setOpenConfigurator, setOpenSidenav,
} from "../../context/index";
import { useAuth } from "../../context/AuthContext";

export default function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter(Boolean);
  const { user, logout } = useAuth();

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={[
        "rounded-xl transition-all",
        fixedNavbar ? "sticky top-4 z-40 py-3 shadow-md shadow-blue-gray-500/5" : "px-0 py-1",
      ].join(" ")}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs className={`bg-transparent p-0 ${fixedNavbar ? "mt-1" : ""}`}>
            <Link to={`/${layout || ""}`}>
              <Typography variant="small" color="blue-gray" className="font-normal opacity-60 hover:opacity-100">
                {layout || "dashboard"}
              </Typography>
            </Link>
            {page && (
              <Typography variant="small" color="blue-gray" className="font-normal">{page}</Typography>
            )}
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">{page || "home"}</Typography>
        </div>

        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label="Search" crossOrigin="" />
          </div>

          {/* mobile burger */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon className="h-6 w-6 text-blue-gray-500" />
          </IconButton>

          {/* auth area */}
          {user ? (
  <Menu>
    <MenuHandler>
      <Button variant="text" color="blue-gray" className="hidden xl:flex items-center gap-2 normal-case">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-gray-100 text-xs text-blue-gray-700">
          {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
        </span>
        {user.email}
      </Button>
    </MenuHandler>
    <MenuList className="border-0">
      {/* If you have a profile page, point to it here */}
      {/* <MenuItem onClick={() => navigate('/dashboard/profile')}>My Profile</MenuItem> */}
      <MenuItem onClick={logout}>Sign out</MenuItem>
    </MenuList>
  </Menu>
) : (
  <Link to="/auth/sign-in">
    <Button variant="text" color="blue-gray" className="hidden xl:flex normal-case">
      <UserCircleIcon className="h-5 w-5 text-blue-gray-500 mr-1" />
      Sign In
    </Button>
  </Link>
)}

          {/* notifications */}
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-blue-gray-500" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem>No new notifications</MenuItem>
            </MenuList>
          </Menu>

          {/* configurator gear */}
          <IconButton variant="text" color="blue-gray" onClick={() => setOpenConfigurator(dispatch, true)}>
            <Cog6ToothIcon className="h-5 w-5 text-blue-gray-500" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}
