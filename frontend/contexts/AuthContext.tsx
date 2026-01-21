// contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import type { UserCreate, UserLogin } from '@/lib/types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (data: UserLogin) => Promise<void>;
    signup: (data: UserCreate) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.getMe()
                .then((userData) => {
                    setUser(userData);
                    setIsAuthenticated(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: UserLogin) => {
        const tokenData = await api.login(data);
        localStorage.setItem('token', tokenData.access_token);
        const userData = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
    };

    const signup = async (data: UserCreate) => {
        const tokenData = await api.signup(data);
        localStorage.setItem('token', tokenData.access_token);
        const userData = await api.getMe();
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout, loading }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}