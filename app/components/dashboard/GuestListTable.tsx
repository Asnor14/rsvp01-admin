"use client";

import { useState } from "react";
import { User, Calendar, MessageSquare, Search, ArrowUpDown } from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// GUEST LIST TABLE COMPONENT
// ============================================

interface GuestListTableProps {
    invitations: InvitationWithGuests[];
}

type SortKey = "guestName" | "createdAt" | "attending";
type SortDirection = "asc" | "desc";

interface SortConfig {
    key: SortKey;
    direction: SortDirection;
}

export function GuestListTable({ invitations }: GuestListTableProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: "createdAt",
        direction: "desc",
    });

    // Flatten guest list similar to PDF export
    const allGuests = invitations.flatMap((inv) =>
        inv.guests.map((guest) => ({
            id: guest.id,
            guestName: guest.name,
            familyName: inv.family_name,
            email: guest.email || "-",
            attending: guest.attending,
            guestCount: guest.guest_count,
            message: guest.message || "-",
            createdAt: new Date(guest.created_at),
            additionalGuests: guest.additional_guests || [],
        }))
    );

    // Handle sort
    const handleSort = (key: SortKey) => {
        setSortConfig((current) => ({
            key,
            direction:
                current.key === key && current.direction === "asc" ? "desc" : "asc",
        }));
    };

    // Filter and Sort guests
    const filteredGuests = allGuests
        .filter((guest) =>
            guest.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const { key, direction } = sortConfig;
            let comparison = 0;

            if (key === "guestName") {
                comparison = a.guestName.localeCompare(b.guestName);
            } else if (key === "attending") {
                // Sort attending (true) before declined (false)
                comparison = (a.attending === b.attending) ? 0 : a.attending ? -1 : 1;
            } else if (key === "createdAt") {
                comparison = a.createdAt.getTime() - b.createdAt.getTime();
            }

            return direction === "asc" ? comparison : -comparison;
        });

    // Calculate Totals from Filtered Results
    const totalAttending = filteredGuests
        .filter(g => g.attending)
        .reduce((sum, g) => sum + g.guestCount, 0);
    const totalDeclined = filteredGuests.filter(g => !g.attending).length;

    if (allGuests.length === 0) {
        return null; // Don't show if no data
    }

    return (
        <div className="mx-4 md:mx-12 mb-12 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-wedding-champagne/30 dark:border-zinc-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-wedding-pearl dark:bg-zinc-900 border-b border-wedding-champagne/20 dark:border-zinc-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-serif text-wedding-charcoal dark:text-wedding-ivory flex items-center gap-2">
                            <User className="w-5 h-5 text-wedding-gold" />
                            Live Guest List
                        </h3>
                        <p className="text-sm text-wedding-dove mt-1">
                            Real-time view of all RSVP responses
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wedding-dove" />
                        <input
                            type="text"
                            placeholder="Search guests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-wedding-champagne/40 dark:border-zinc-600 rounded-lg text-sm focus:outline-none focus:border-wedding-gold transition-colors text-wedding-charcoal dark:text-wedding-ivory"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-wedding-cream/30 dark:bg-zinc-800/50 border-b border-wedding-champagne/20 dark:border-zinc-700 text-xs uppercase tracking-wider text-wedding-dove">
                                <th
                                    className="p-4 font-semibold cursor-pointer hover:text-wedding-gold transition-colors group"
                                    onClick={() => handleSort("guestName")}
                                >
                                    <div className="flex items-center gap-1">
                                        Guest Name
                                        <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === "guestName" ? "text-wedding-gold" : "opacity-30 group-hover:opacity-100"}`} />
                                    </div>
                                </th>
                                <th className="p-4 font-semibold">Additional Guests</th>
                                <th className="p-4 font-semibold">Family Group</th>
                                <th
                                    className="p-4 font-semibold cursor-pointer hover:text-wedding-gold transition-colors group"
                                    onClick={() => handleSort("attending")}
                                >
                                    <div className="flex items-center gap-1">
                                        Status
                                        <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === "attending" ? "text-wedding-gold" : "opacity-30 group-hover:opacity-100"}`} />
                                    </div>
                                </th>
                                <th className="p-4 font-semibold text-center">Party</th>
                                <th className="p-4 font-semibold">Message</th>
                                <th
                                    className="p-4 font-semibold text-right cursor-pointer hover:text-wedding-gold transition-colors group"
                                    onClick={() => handleSort("createdAt")}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        Date
                                        <ArrowUpDown className={`w-3 h-3 ${sortConfig.key === "createdAt" ? "text-wedding-gold" : "opacity-30 group-hover:opacity-100"}`} />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-wedding-champagne/10 dark:divide-zinc-700/50">
                            {filteredGuests.length > 0 ? (
                                filteredGuests.map((guest) => (
                                    <tr
                                        key={guest.id}
                                        className="hover:bg-wedding-pearl/30 dark:hover:bg-zinc-700/30 transition-colors"
                                    >
                                        <td className="p-4 text-sm font-medium text-wedding-charcoal dark:text-wedding-ivory">
                                            {guest.guestName}
                                            {guest.email !== "-" && (
                                                <div className="text-xs text-wedding-dove font-normal mt-0.5 opacity-70">{guest.email}</div>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-wedding-slate dark:text-wedding-dove">
                                            {guest.additionalGuests && guest.additionalGuests.length > 0 ? (
                                                <div className="flex flex-col space-y-0.5">
                                                    {guest.additionalGuests.map((ag, idx) => {
                                                        const name = typeof ag === 'string' ? ag : ag.name;
                                                        return (
                                                            <span key={idx} className="text-xs text-wedding-gold font-normal">
                                                                {name || "Unknown"}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="opacity-30">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-wedding-slate dark:text-wedding-dove">
                                            {guest.familyName}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${guest.attending
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400"
                                                    }`}
                                            >
                                                {guest.attending ? "Attending" : "Declined"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-center text-wedding-slate dark:text-wedding-dove">
                                            {guest.attending ? guest.guestCount : "-"}
                                        </td>
                                        <td className="p-4 text-sm text-wedding-slate dark:text-wedding-dove max-w-xs">
                                            {guest.message !== "-" ? (
                                                <div className="flex items-start gap-1.5" title={guest.message}>
                                                    <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-50" />
                                                    <span className="truncate block max-w-[200px]">{guest.message}</span>
                                                </div>
                                            ) : (
                                                <span className="opacity-30">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-right text-wedding-dove whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 opacity-50" />
                                                {guest.createdAt.toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </div>
                                            <div className="text-[10px] opacity-50 mt-0.5">
                                                {guest.createdAt.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-wedding-dove text-sm">
                                        No guests found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Count */}
                <div className="p-4 bg-wedding-pearl/50 dark:bg-zinc-900/50 border-t border-wedding-champagne/20 dark:border-zinc-700 text-xs text-wedding-dove flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <span className="font-medium">Total: {filteredGuests.length} guests</span>
                        <div className="h-4 w-px bg-wedding-champagne/30 dark:bg-zinc-700 hidden sm:block"></div>
                        <span className="text-emerald-600 dark:text-emerald-400">Attending: {totalAttending}</span>
                        <span className="text-rose-600 dark:text-rose-400">Declined: {totalDeclined}</span>
                    </div>
                    {allGuests.length > filteredGuests.length && (
                        <button
                            onClick={() => setSearchTerm("")}
                            className="text-wedding-gold hover:underline"
                        >
                            Clear search
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
