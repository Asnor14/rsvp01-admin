"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { LayoutDashboard, LogOut, Download, Moon, Sun, History } from "lucide-react";

// ============================================
// HEADER COMPONENT
// ============================================

interface HeaderProps {
    onLogout: () => void;
    onDownload: () => void;
    activeView: "dashboard" | "history";
    onViewChange: (view: "dashboard" | "history") => void;
}

export function Header({ onLogout, onDownload, activeView, onViewChange }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => setMounted(true), []);

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <header className="bg-wedding-pearl dark:bg-zinc-900 border-b border-wedding-champagne/30 dark:border-wedding-gold/10 px-6 md:px-12 py-6 shadow-md shadow-wedding-champagne/10 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div
                    className="flex items-center gap-4 w-full sm:w-auto cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onViewChange("dashboard")}
                >
                    <div className="bg-wedding-champagne/30 dark:bg-wedding-gold/10 p-2 rounded-lg">
                        <LayoutDashboard className="w-8 h-8 text-wedding-gold" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif text-wedding-charcoal dark:text-wedding-ivory">
                            Wedding Dashboard
                        </h1>
                        <p className="text-sm text-wedding-slate dark:text-wedding-dove tracking-wide">
                            {currentDate}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-end flex-wrap">
                    {/* View History Button */}
                    <button
                        onClick={() => onViewChange(activeView === "dashboard" ? "history" : "dashboard")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border border-wedding-gold/30 transition-all ${activeView === "history"
                            ? "bg-wedding-gold text-white"
                            : "text-wedding-gold hover:bg-wedding-gold/10"
                            }`}
                        title={activeView === "history" ? "Back to Dashboard" : "View History"}
                    >
                        {activeView === "history" ? (
                            <>
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </>
                        ) : (
                            <>
                                <History className="w-4 h-4" />
                                <span className="hidden sm:inline">History</span>
                            </>
                        )}
                    </button>

                    {/* Download Button */}
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-lg border border-wedding-gold/30 text-wedding-gold hover:bg-wedding-gold/10 transition-colors"
                            aria-label="Toggle Theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5" />
                            ) : (
                                <Moon className="w-5 h-5" />
                            )}
                        </button>
                    )}

                    {/* Logout */}
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2.5 border border-wedding-gold/50 text-wedding-slate dark:text-wedding-dove rounded-lg hover:bg-wedding-gold hover:text-white transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
