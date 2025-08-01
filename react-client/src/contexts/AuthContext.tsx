import React from "react";
import { createContext, useContext, useState, useEffect } from 'react';
import * as types from '../types';
import { tokenUtils } from "../services/api";

const AuthContext = createContext<types.AuthContextType | undefined>(undefined);

export const useAuth = (): types.AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<types.AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<types.User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check if user is already logged in on app start
        const token = tokenUtils.getToken();
        const savedUser = tokenUtils.getUser();

        if (token && savedUser) {
            setIsAuthenticated(true);
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: types.User): void => {
        tokenUtils.setToken(token);
        tokenUtils.setUser(userData);
        setIsAuthenticated(true);
        setUser(userData);
    };

    const logout = (): void => {
        tokenUtils.removeToken();
        setIsAuthenticated(false);
        setUser(null);
    };

    const value: types.AuthContextType = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

