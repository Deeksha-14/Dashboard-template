import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardRoutes } from "../../routes.config";
import { HomeIcon, UserCircleIcon, UserGroupIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

// Icon mapping for routes
const iconMap = {
  admin: UserGroupIcon,
  participant: UserCircleIcon,
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  // Get visible nav items based on user role
  const navItems = dashboardRoutes.filter(
    (r) => !r.roles || r.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    window.location.href = "/home";
  };

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || "User";
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-white shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HomeIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">QACC</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = iconMap[item.path] || HomeIcon;
            const isActive =
              pathname === `/dashboard/${item.path}` ||
              pathname.startsWith(`/dashboard/${item.path}/`);

            return (
              <NavLink
                key={item.path}
                to={`/dashboard/${item.path}`}
                className={({ isActive: active }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                    active || isActive
                      ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all group"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 flex-shrink-0 group-hover:text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-2 md:hidden">
            <HomeIcon className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">QACC</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {getUserDisplayName()}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {user?.role || "User"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}





// // src/layouts/DashboardLayout.jsx
// import { Outlet, NavLink, useLocation } from "react-router-dom";
// import { useAuth } from "@/context/AuthContext";
// import { dashboardRoutes } from "../../routes.config";






// export default function DashboardLayout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen w-full flex">
//       <aside className="w-64 border-r p-4 hidden md:block">
//         <div className="font-bold mb-4">QACC Dashboard</div>
//         <nav className="space-y-2">
//           {dashboardRoutes
//             .filter(r => !r.path.includes(":"))
//             .map(r => (
//               <NavLink
//                 key={r.path}
//                 to={`/dashboard/${r.path}`}
//                 className={({ isActive }) =>
//                   `block rounded px-3 py-2 ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
//                 }
//               >
//                 {r.name}
//               </NavLink>
//             ))}
//         </nav>
//       </aside>

//       <div className="flex-1 flex flex-col">
//         <header className="h-14 border-b flex items-center justify-between px-4">
//           <div />
//           <div className="flex items-center gap-3">
//             <span className="text-sm text-gray-600">{user?.email}</span>
//             <button onClick={logout} className="border rounded px-3 py-1 text-sm hover:bg-gray-50">Logout</button>
//           </div>
//         </header>
//         <main className="p-4">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }

// // if you already use material-tailwind's ThemeProvider, keep it high in the tree (index.jsx)
// // export default function DashboardLayout() {
// //   const { user, logout } = useAuth();
// //   const role = readRole(user);
// //   const { pathname } = useLocation();

// //   // menu items visible for this role
// //   const navItems = useMemo(() => {
// //     return dashboardRoutes
// //       .filter(r => !r.roles || r.roles.includes(role))
// //       .filter(r => !r.path.includes(":")); // hide details pages from the menu
// //   }, [role]);

// //   return (
// //     <div className="min-h-screen w-full flex bg-gray-50">
// //       {/* SIDENAV */}
// //       <aside className="hidden md:flex w-64 flex-col border-r bg-white">
// //         <div className="h-16 flex items-center px-4 text-xl font-semibold">
// //           {/* Brand / Logo */}
// //           QACC Dashboard
// //         </div>
// //         <nav className="flex-1 px-2 py-4 space-y-1">
// //           {navItems.map(item => (
// //             <NavLink
// //               key={item.path}
// //               to={`/dashboard/${item.path}`}
// //               className={({ isActive }) =>
// //                 [
// //                   "flex items-center gap-3 rounded-md px-3 py-2 transition",
// //                   isActive || pathname.startsWith(`/dashboard/${item.path}`)
// //                     ? "bg-gray-100 text-gray-900"
// //                     : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
// //                 ].join(" ")
// //               }
// //               end={item.path.split("/").length === 1}
// //             >
// //               {/* optional: icons later; keep clean for now */}
// //               <span className="text-sm font-medium">{item.name}</span>
// //             </NavLink>
// //           ))}
// //         </nav>
// //         <div className="p-4 text-xs text-gray-400">v1</div>
// //       </aside>

// //       {/* MAIN */}
// //       <div className="flex-1 flex flex-col">
// //         <Topbar />
// //         <main className="p-4">
// //           <Outlet />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // }

// function Topbar() {
//   const { user, logout } = useAuth();
//   const role = readRole(user);
//   return (
//     <header className="h-16 bg-white border-b flex items-center justify-between px-4">
//       <div className="md:hidden text-lg font-semibold">QACC</div>
//       <div className="flex-1" />
//       <div className="flex items-center gap-3">
//         <span className="text-sm text-gray-600 hidden sm:inline-block">
//           {user?.firstName ? `${user.firstName}` : user?.email}
//           {role ? ` · ${role}` : ""}
//         </span>
//         <button
//           className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
//           onClick={logout}
//         >
//           Logout
//         </button>
//       </div>
//     </header>
//   );
// }

// function readRole(user) {
//   if (!user) return null;
//   if (typeof user.role === "string") return user.role;
//   if (user.role && typeof user.role.name === "string") return user.role.name;
//   return null;
// }
