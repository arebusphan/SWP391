import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


type User = {
    Name: string;
    Phone: string;
    Email: string;
    Role: string;
};

type AuthContextType = {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
   
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    type DecodedToken = {
        Name?: string;
        Phone?: string;
        Email?: string;
        Role?: string;
    };

    const decodeToken = (token: string): User => {
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            return {
                Name: decoded.Name ?? "",
                Phone: decoded.Phone ?? "",
                Email: decoded.Email ?? "",
                Role: decoded.Role ?? "",
            };
        } catch (err) {
            console.error("Failed to decode JWT:", err);
            return { Name: "", Phone:"", Email: "", Role: "" };
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decodedUser = decodeToken(token);
            setUser(decodedUser);
        }
    }, []);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
