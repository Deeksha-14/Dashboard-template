import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Helper: safely decode a JWT and return its payload object or null
function decodeJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length < 2) return null;
  try {
    // JWT payload is the second part (base64url)
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    // Add padding if necessary
    const pad = payload.length % 4;
    const padded = pad ? payload + '='.repeat(4 - pad) : payload;
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (e) {
    return null;
  }
}

// Helper: extract a role string from various token/user shapes
function extractRoleFromPayload(payload) {
  if (!payload) return null;
  // Common shapes
  if (typeof payload.role === 'string') return payload.role;
  if (payload.role && typeof payload.role.name === 'string') return payload.role.name;
  if (Array.isArray(payload.roles) && payload.roles.length) {
    // roles might be array of strings or objects
    const first = payload.roles[0];
    if (typeof first === 'string') return first;
    if (first && typeof first.name === 'string') return first.name;
  }
  // Some backends use `authorities` or `roles` under different keys
  if (Array.isArray(payload.authorities) && payload.authorities.length) {
    return typeof payload.authorities[0] === 'string' ? payload.authorities[0] : null;
  }
  // custom claim names
  if (typeof payload['roleName'] === 'string') return payload['roleName'];
  return null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // On mount, read token and user from localStorage. Prefer token as source-of-truth
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');

    if (token) {
      const payload = decodeJwt(token);
      // Try to recover role from token payload
      const roleFromToken = extractRoleFromPayload(payload);

      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          // If stored user doesn't have role, or token role is present, normalize
          const finalRole = roleFromToken || parsedUser.role || parsedUser?.role?.name || null;
          const normalizedUser = { ...parsedUser, role: finalRole };
          setUser(normalizedUser);
          setIsAdmin(finalRole === 'ADMIN');
          return;
        } catch (e) {
          // fall through and try to use token payload only
        }
      }

      // No user in storage or parsing failed: build a minimal user object from token payload
      if (payload) {
        const role = extractRoleFromPayload(payload);
        const minimalUser = {
          id: payload.sub || payload.id || null,
          name: payload.name || payload.username || null,
          role: role,
          // keep the token available where callers expect `jwt` field
          jwt: token,
        };
        setUser(minimalUser);
        setIsAdmin(role === 'ADMIN');
        // persist a normalized user object for quicker subsequent loads
        try {
          localStorage.setItem('user', JSON.stringify(minimalUser));
        } catch (e) {
          // ignore storage errors
        }
        return;
      }
    }

    // No valid token: clear state
    setUser(null);
    setIsAdmin(false);
  }, []);

  // login: accept various shapes from backend and normalize
  const login = (userData) => {
    // token might be named `jwt`, `token`, or `accessToken`
    const token = userData?.jwt || userData?.token || userData?.accessToken || null;

    // role can come from backend user payload or from JWT
    let role = null;
    if (userData) {
      if (typeof userData.role === 'string') role = userData.role;
      else if (userData.role && typeof userData.role.name === 'string') role = userData.role.name;
    }

    // if token present, prefer role from token payload
    if (token) {
      const payload = decodeJwt(token);
      const roleFromToken = extractRoleFromPayload(payload);
      if (roleFromToken) role = roleFromToken;
    }

    const normalizedUser = { ...userData, role };

    try {
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (e) {
      // ignore storage errors
    }

    setUser(normalizedUser);
    setIsAdmin(role === 'ADMIN');
  };

  const logout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) {
      // ignore
    }
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

// .tsx
// import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// // const AuthContext = createContext(null);

// interface User {
//   id: string;
//   name: string;
//   role: "ADMIN" | "PARTICIPANT";  // adjust based on your backend
//   jwt: string;
// }

// interface AuthContextType {
//   user: User | null;
//   setUser: React.Dispatch<React.SetStateAction<User | null>>;
//   isAdmin: boolean;
//   setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
//   login: (userData: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const userInfo = localStorage.getItem("user");

//     if (token && userInfo) {
//       try {
//         const parsedUser: User = JSON.parse(userInfo);
//         setUser(parsedUser);
//         setIsAdmin(parsedUser.role === "ADMIN");
//       } catch (error) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//         setIsAdmin(false);
//       }
//     }
//   }, []);

//   const login = (userData: User) => {
//     localStorage.setItem("token", userData.jwt);
//     localStorage.setItem("user", JSON.stringify(userData));
//     setUser(userData);
//     setIsAdmin(userData.role === "ADMIN");
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setIsAdmin(false);
//   };

//   const value: AuthContextType = {
//     user,
//     setUser,
//     isAdmin,
//     setIsAdmin,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export default AuthContext;