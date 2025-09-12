import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// const AuthContext = createContext(null);

interface User {
  id: string;
  name: string;
  role: "ADMIN" | "PARTICIPANT";  // adjust based on your backend
  jwt: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("user");

    if (token && userInfo) {
      try {
        const parsedUser: User = JSON.parse(userInfo);
        setUser(parsedUser);
        setIsAdmin(parsedUser.role === "ADMIN");
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAdmin(false);
      }
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("token", userData.jwt);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAdmin(userData.role === "ADMIN");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
  };

  const value: AuthContextType = {
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;