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
    if (typeof user.role === 'string') {
      // Strip ROLE_ prefix if present (e.g., ROLE_PARTICIPANT -> PARTICIPANT)
      return user.role.replace(/^ROLE_/, '');
    }
    if (user.role && typeof user.role.name === 'string') {
      return user.role.name.replace(/^ROLE_/, '');
    }
  }
  // fallback: try token in localStorage
  const token = localStorage.getItem('token');
  if (token) {
    const payload = decodeJwtPayload(token);
    if (!payload) return null;
    if (typeof payload.role === 'string') {
      return payload.role.replace(/^ROLE_/, '');
    }
    if (payload.role && typeof payload.role.name === 'string') {
      return payload.role.name.replace(/^ROLE_/, '');
    }
    if (Array.isArray(payload.roles) && payload.roles.length) {
      const role = payload.roles[0];
      return (typeof role === 'string' ? role : null)?.replace(/^ROLE_/, '');
    }
    if (Array.isArray(payload.authorities) && payload.authorities.length) {
      const auth = payload.authorities[0];
      return (typeof auth === 'string' ? auth : null)?.replace(/^ROLE_/, '');
    }
    if (typeof payload.roleName === 'string') {
      return payload.roleName.replace(/^ROLE_/, '');
    }
  }
  return null;
}

export default function RoleGate({ roles, children }) {
  const { user } = useAuth();
  const role = readRole(user);
  const token = localStorage.getItem('token');

  // if there's no token nor user, redirect to sign-in
  if (!user && !token) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (roles && role && !roles.includes(role)) {
    const fallback = role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/participant';
    return <Navigate to={fallback} replace />;
  }

  return children;
}