"use client";

import { useState, useEffect } from "react";
import { AUTH_KEY, VALID_USERNAME, VALID_PASSWORD } from "../utils/constants";

// ============================================
// AUTHENTICATION HOOK
// ============================================

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check localStorage on mount for persistent login
    useEffect(() => {
        const authStatus = localStorage.getItem(AUTH_KEY);
        if (authStatus === "true") {
            setIsAuthenticated(true);
        }
        setIsCheckingAuth(false);
    }, []);

    const login = (username: string, password: string): boolean => {
        if (username === VALID_USERNAME && password === VALID_PASSWORD) {
            localStorage.setItem(AUTH_KEY, "true");
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem(AUTH_KEY);
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        isCheckingAuth,
        login,
        logout,
    };
}
