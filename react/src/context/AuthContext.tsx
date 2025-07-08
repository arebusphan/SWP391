import React, { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  UserId: number;
  Name: string;
  Phone: string;
  Email: string;
  Role: string;
};

type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  justLoggedIn: boolean;
  setJustLoggedIn: (value: boolean) => void;
  justLoggedOut: boolean;
  setJustLoggedOut: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  type DecodedToken = {
    UserId?: string;
    Name?: string;
    Phone?: string;
    Email?: string;
    Role?: string;
  };

  const decodeToken = (token: string): User => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        UserId: Number(decoded.UserId ?? 0),
        Name: decoded.Name ?? "",
        Phone: decoded.Phone ?? "",
        Email: decoded.Email ?? "",
        Role: decoded.Role ?? "",
      };
    } catch (err) {
      console.error("Failed to decode JWT:", err);
      return { UserId: 0, Name: "", Phone: "", Email: "", Role: "" };
    }
  };

  const token = localStorage.getItem("token");

  const [user, setUser] = useState<User | null>(() =>
    token ? decodeToken(token) : null
  );
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decodedUser = decodeToken(token);
    setUser(decodedUser);
    setJustLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setJustLoggedOut(true); // ✅ thêm dòng này
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        justLoggedIn,
        setJustLoggedIn,
        justLoggedOut,
        setJustLoggedOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
