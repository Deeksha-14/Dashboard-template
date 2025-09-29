import { Outlet } from "react-router-dom";
import Sidenav from "./Sidenav";
import DashboardNavbar from "./DashboardNavbar";
import Footer from "./Footer";
import Configurator from "./Configurator";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen w-full flex bg-gray-50">
      <Sidenav />
      <div className="flex-1 flex flex-col gap-4 p-4">
        <DashboardNavbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* gear + panel */}
      <Configurator />
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
