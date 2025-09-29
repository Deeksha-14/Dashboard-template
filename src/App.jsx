import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import RoleGate from "./RoleGate";
import { dashboardRoutes } from "./routes.config";
import DashboardLayout from "./components/layout/DashboardLayout";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./pages/public/Home";

function RoleLanding() {
  const { user } = useAuth();
  const role = typeof user?.role === "string" ? user.role : user?.role?.name;
  const to = role === "ADMIN" ? "/dashboard/admin" : "/dashboard/participant";
  return <Navigate to={to} replace />;
}

export default function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<Navigate to="/home" replace />} />



      {/* All app pages (with sidebar/navbar) live under /dashboard/* */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        {dashboardRoutes.map(({ path, roles, element }) => (
          <Route key={path} path={path} element={<RoleGate roles={roles}>{element}</RoleGate>} />
        ))}

        {/* /dashboard -> redirect to role home */}
        <Route index element={<RoleGate roles={["ADMIN","PARTICIPANT"]}><RoleLanding /></RoleGate>} />
      </Route>

      {/* Auth routes (Project 1 originals)
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> */}

      {/* Compat for Project 2 links: */}
      <Route path="/auth/sign-in" element={<Login />} />
      <Route path="/auth/sign-up" element={<Register />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}



// import { Routes, Route, Navigate } from "react-router-dom";
// import RoleGate from "./RoleGate";
// import { dashboardRoutes } from "./routes.config";
// import { useAuth } from "./context/AuthContext";
// import DashboardLayout from "../src/components/layout/DashboardLayout"

// // Temporary login placeholder (replace later)
// function LoginPlaceholder() { return <h2>Login Page (placeholder)</h2>; }




// function RoleLanding() {
//   const { user } = useAuth();
//   const role = (typeof user?.role === "string" ? user.role : user?.role?.name) || null;
//   const to = role === "ADMIN" ? "/dashboard/admin" : "/dashboard/participant";
//   return <Navigate to={to} replace />;
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* All app pages that show sidebar/navbar will live under /dashboard/* */}
//       <Route path="/dashboard/*" element={<DashboardLayout />}>
//         {dashboardRoutes.map(({ path, roles, element}) => (
//           <Route
//             key={path}
//             path={path}  // "admin" or "participant"
//             element={
//               <RoleGate roles={roles}>{element}</RoleGate>
//             }
//           />
//         ))}

//         {/* /dashboard redirects to the correct home by role */}
//         <Route
//           index
//           element={
//             <RoleGate roles={["ADMIN", "PARTICIPANT"]}>
//               <RoleLanding />
//             </RoleGate>
//           }
//         />
//       </Route>

//       {/* Auth route (you can keep your current Login component later) */}
//       <Route path="/login" element={<LoginPlaceholder />} />

//       {/* Catch-all */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }


// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// // import Layout from "./components/layout/Layout";
// import { routes } from "./routes";
// import { useAuth } from "./context/AuthContext";

// const ProtectedRoute = ({ children, roles }) => {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/login" replace />;
//   if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
//   return children;
// };

// function App() {
//   return (
//     // <Layout>
//       <Routes>
//         {routes.map((group) =>
//           group.pages.map(({ path, element, roles }) => (
//             <Route
//               key={path}
//               path={path}
//               element={
//                 roles ? (
//                   <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
//                 ) : (
//                   element
//                 )
//               }
//             />
//           ))
//         )}
//         {/* Default redirect */}
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     // </Layout>
//   );
// }

// export default App;
