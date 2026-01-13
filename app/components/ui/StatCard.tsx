"use client";

import { useState, useEffect } from "react";

// ============================================
// STAT CARD COMPONENT
// ============================================

interface StatCardProps {
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    value: number;
    label: string;
    subtext?: string;
    valueColor?: string;
    delay?: number;
}

export function StatCard({
    icon: Icon,
    iconBg,
    iconColor,
    value,
    label,
    subtext,
    valueColor,
    delay,
}: StatCardProps) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        // Count-up animation
        const duration = 1000;
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setDisplayValue(value);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return (
        <div
            className="bg-gradient-to-br from-wedding-pearl to-wedding-cream dark:from-zinc-800 dark:to-zinc-900 border border-wedding-gold/20 p-6 md:p-8 rounded-xl shadow-lg shadow-wedding-champagne/10 hover:scale-105 transition-all duration-300 animate-fadeInUp opacity-0"
            style={{ animationDelay: `${delay || 0}ms`, animationFillMode: "forwards" }}
        >
            <div className={`${iconBg} dark:bg-opacity-10 p-3 rounded-full w-fit mb-3 md:mb-4`}>
                <Icon className={`w-6 h-6 md:w-8 md:h-8 ${iconColor}`} />
            </div>
            <div
                className={`text-3xl md:text-5xl font-bold ${valueColor || "text-wedding-charcoal dark:text-wedding-ivory"} font-data`}
            >
                {displayValue}
            </div>
            <div className="text-xs md:text-sm uppercase tracking-widest text-wedding-slate dark:text-wedding-dove mt-2">
                {label}
            </div>
            {subtext && (
                <div className="text-[10px] md:text-xs text-wedding-dove mt-1 italic">{subtext}</div>
            )}
        </div>
    );
}
