import { Navigate } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";

// minimal jwt decode used only for role extraction
function decodeJwtPayload(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    const padded = pad ? payload + '='.repeat(4 - pad) : payload;
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

function readRole(user) {
  if (user) {
    if (typeof user.role === 'string') return user.role;
    if (user.role && typeof user.role.name === 'string') return user.role.name;
  }
  // fallback: try token in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    if (typeof payload.role === 'string') return payload.role;
    if (payload.role && typeof payload.role.name === 'string') return payload.role.name;
    if (Array.isArray(payload.roles) && payload.roles.length) return payload.roles[0];
    if (Array.isArray(payload.authorities) && payload.authorities.length) return payload.authorities[0];
    if (typeof payload.roleName === 'string') return payload.roleName;
  }
  return null;
}

export default function RoleGate({ roles, children }) {
  const { user } = useAuth();
  const role = readRole(user);

  // if there's no token nor user, redirect to sign-in
  const token = localStorage.getItem('token');
  if (!user && !token) return <Navigate to="/auth/sign-in" replace />;

  if (roles && role && !roles.includes(role)) {
    const fallback = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/participant';
    return <Navigate to={fallback} replace />;
  }

  return children;
}