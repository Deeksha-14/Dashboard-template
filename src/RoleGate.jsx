import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function readRole(user) {
  if (!user) return null;
  // common shapes: "ADMIN" or { name: "ADMIN" } or { role: "ADMIN" }
  if (typeof user.role === "string") return user.role;
  if (user.role && typeof user.role.name === "string") return user.role.name;
  return null;
}

export default function RoleGate({ roles, children }) {
  const { user } = useAuth();
  const role = readRole(user);

  if (!user) return <Navigate to="/auth/sign-in" replace />;

  if (roles && role && !roles.includes(role)) {
    const fallback =
      role === "ADMIN" ? "/dashboard/admin" : "/dashboard/participant";
    return <Navigate to={fallback} replace />;
  }

  return children;
}