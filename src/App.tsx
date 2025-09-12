import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { routes } from "./routes";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Layout>
      <Routes>
        {routes.map((group) =>
          group.pages.map(({ path, element, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                roles ? (
                  <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          ))
        )}
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
