import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../api';

interface Admin {
    _id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    admin: Admin | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on mount
        const storedToken = localStorage.getItem('adminToken');
        const storedAdmin = localStorage.getItem('adminUser');

        if (storedToken && storedAdmin) {
            setToken(storedToken);
            setAdmin(JSON.parse(storedAdmin));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token: newToken, ...adminData } = response.data;

            localStorage.setItem('adminToken', newToken);
            localStorage.setItem('adminUser', JSON.stringify(adminData));

            setToken(newToken);
            setAdmin(adminData);
        } catch (error: any) {
            throw new Error(
                error.response?.data?.message || 'Login failed. Please try again.'
            );
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setToken(null);
        setAdmin(null);
    };

    const value = {
        admin,
        token,
        isLoading,
        isAuthenticated: !!token && !!admin,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
