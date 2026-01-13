"use client";

import { useState } from "react";
import { Crown } from "lucide-react";

// ============================================
// LOGIN FORM COMPONENT
// ============================================

interface LoginFormProps {
    onLogin: (username: string, password: string) => boolean;
}

export function LoginForm({ onLogin }: LoginFormProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onLogin(username, password);
        if (!success) {
            setError("Invalid username or password");
            setShake(true);
            setPassword("");
            setTimeout(() => setShake(false), 500);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-cream via-wedding-blush to-wedding-champagne dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 transition-colors duration-500">
            <div
                className={`w-full max-w-md bg-wedding-pearl/90 dark:bg-zinc-900/90 backdrop-blur-md border-2 border-wedding-gold/30 p-10 rounded-2xl shadow-2xl shadow-wedding-champagne/20 animate-fadeIn ${shake ? "animate-shake" : ""}`}
            >
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-wedding-champagne/30 dark:bg-wedding-gold/20 p-4 rounded-full animate-pulse-slow">
                        <Crown className="w-14 h-14 text-wedding-gold" />
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-3xl md:text-4xl text-center text-wedding-charcoal dark:text-wedding-ivory mb-2 font-serif">
                    Admin Login
                </h1>
                <p className="text-sm text-center text-wedding-slate/70 dark:text-wedding-dove tracking-widest uppercase mb-6">
                    Wedding RSVP Dashboard
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-wedding-gold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            placeholder="Enter username"
                            className="w-full bg-transparent border-b-2 border-wedding-champagne/40 dark:border-wedding-gold/30 focus:border-wedding-gold focus:outline-none py-3 text-wedding-charcoal dark:text-wedding-ivory placeholder:text-wedding-dove/50 transition-colors duration-300"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-wedding-gold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="••••"
                            className="w-full bg-transparent border-b-2 border-wedding-champagne/40 dark:border-wedding-gold/30 focus:border-wedding-gold focus:outline-none py-3 text-wedding-charcoal dark:text-wedding-ivory placeholder:text-wedding-dove/50 transition-colors duration-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-4 bg-wedding-gold text-wedding-charcoal font-semibold tracking-widest px-12 py-4 rounded-lg transition-all duration-300 hover:bg-wedding-antique hover:scale-105 hover:shadow-lg"
                    >
                        LOGIN
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <p className="text-red-400 text-sm text-center mt-4 animate-fadeIn">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}
