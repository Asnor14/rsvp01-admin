"use client";

import { useState, useMemo } from "react";
import { Mail, ArrowUpDown, ChevronDown, MessageCircle } from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";
import { InvitationCard, MobileInvitationRow } from "./InvitationCard";

// ============================================
// FILTER & SORT OPTIONS
// ============================================

type FilterOption = "all" | "responded" | "pending" | "with-messages";

type SortOption =
    | "name-asc"
    | "name-desc"
    | "guests-asc"
    | "guests-desc"
    | "date-newest"
    | "date-oldest";

const filterLabels: Record<FilterOption, string> = {
    "all": "All",
    "responded": "Responded",
    "pending": "Pending",
    "with-messages": "With Messages",
};

const sortLabels: Record<SortOption, string> = {
    "name-asc": "Name (A-Z)",
    "name-desc": "Name (Z-A)",
    "guests-asc": "Guests (Low-High)",
    "guests-desc": "Guests (High-Low)",
    "date-newest": "Newest First",
    "date-oldest": "Oldest First",
};

// ============================================
// INVITATIONS LIST COMPONENT
// ============================================

interface InvitationsListProps {
    invitations: InvitationWithGuests[];
    isLoading: boolean;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
    onUpdateMaxGuests?: (id: string, maxGuests: number) => void;
    onToggleStatus?: (id: string, currentStatus: string) => void;
    onViewMessage?: (invitation: InvitationWithGuests) => void;
}

export function InvitationsList({
    invitations,
    isLoading,
    onDelete,
    onCopyLink,
    onUpdateMaxGuests,
    onToggleStatus,
    onViewMessage,
}: InvitationsListProps) {
    const [filterBy, setFilterBy] = useState<FilterOption>("all");
    const [sortBy, setSortBy] = useState<SortOption>("date-newest");
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Calculate counts for each filter
    const filterCounts = useMemo(() => ({
        all: invitations.length,
        responded: invitations.filter(inv => inv.stats.total_responses > 0).length,
        pending: invitations.filter(inv => inv.stats.total_responses === 0).length,
        "with-messages": invitations.filter(inv => inv.guests[0]?.message).length,
    }), [invitations]);

    // Filter and sort invitations
    const filteredAndSortedInvitations = useMemo(() => {
        // First filter
        let filtered = [...invitations];

        switch (filterBy) {
            case "responded":
                filtered = filtered.filter(inv => inv.stats.total_responses > 0);
                break;
            case "pending":
                filtered = filtered.filter(inv => inv.stats.total_responses === 0);
                break;
            case "with-messages":
                filtered = filtered.filter(inv => inv.guests[0]?.message);
                break;
            default:
                break;
        }

        // Then sort
        switch (sortBy) {
            case "name-asc":
                return filtered.sort((a, b) => a.family_name.localeCompare(b.family_name));
            case "name-desc":
                return filtered.sort((a, b) => b.family_name.localeCompare(a.family_name));
            case "guests-asc":
                return filtered.sort((a, b) => a.max_guests - b.max_guests);
            case "guests-desc":
                return filtered.sort((a, b) => b.max_guests - a.max_guests);
            case "date-newest":
                return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case "date-oldest":
                return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            default:
                return filtered;
        }
    }, [invitations, filterBy, sortBy]);

    if (isLoading) {
        return <div className="p-12 text-center text-wedding-dove">Loading...</div>;
    }

    if (invitations.length === 0) {
        return (
            <div className="mx-4 md:mx-12 mb-12">
                <div className="bg-wedding-cream/50 dark:bg-zinc-900 border border-wedding-champagne/30 rounded-xl p-12 text-center">
                    <Mail className="w-16 h-16 text-wedding-gold/40 mx-auto mb-4" />
                    <h3 className="text-xl font-serif text-wedding-charcoal mb-2 dark:text-wedding-ivory">
                        No Invitations Yet
                    </h3>
                    <p className="text-wedding-dove">
                        Create your first invitation using the form above
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-4 md:mx-12 mb-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl md:text-3xl font-serif text-wedding-charcoal dark:text-wedding-ivory">
                    Invitation Manager
                </h2>
                <span className="bg-wedding-gold text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {invitations.length}
                </span>
            </div>

            {/* Filter Tabs & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(filterLabels) as FilterOption[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setFilterBy(filter)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filterBy === filter
                                ? "bg-wedding-gold text-white shadow-sm"
                                : "bg-white dark:bg-zinc-800 text-wedding-charcoal dark:text-wedding-ivory border border-wedding-champagne/40 dark:border-zinc-700 hover:border-wedding-gold"
                                }`}
                        >
                            {filter === "with-messages" && <MessageCircle className="w-3.5 h-3.5" />}
                            {filterLabels[filter]}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterBy === filter
                                ? "bg-white/20 text-white"
                                : "bg-wedding-pearl dark:bg-zinc-700 text-wedding-dove"
                                }`}>
                                {filterCounts[filter]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-wedding-champagne/40 dark:border-zinc-700 rounded-lg text-sm text-wedding-charcoal dark:text-wedding-ivory hover:border-wedding-gold transition-colors"
                    >
                        <ArrowUpDown className="w-4 h-4 text-wedding-gold" />
                        <span>Sort: {sortLabels[sortBy]}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isSortOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setIsSortOpen(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 z-20 bg-white dark:bg-zinc-800 border border-wedding-champagne/40 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden min-w-[180px]">
                                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSortBy(option);
                                            setIsSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortBy === option
                                            ? "bg-wedding-gold/10 text-wedding-gold font-medium"
                                            : "text-wedding-charcoal dark:text-wedding-ivory hover:bg-wedding-pearl/50 dark:hover:bg-zinc-700"
                                            }`}
                                    >
                                        {sortLabels[option]}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Empty state for filter */}
            {filteredAndSortedInvitations.length === 0 && (
                <div className="bg-wedding-cream/50 dark:bg-zinc-900 border border-wedding-champagne/30 rounded-xl p-8 text-center mb-6">
                    <p className="text-wedding-dove">
                        No invitations match the "{filterLabels[filterBy]}" filter
                    </p>
                    <button
                        onClick={() => setFilterBy("all")}
                        className="mt-3 text-sm text-wedding-gold hover:text-wedding-antique transition-colors"
                    >
                        View all invitations
                    </button>
                </div>
            )}

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAndSortedInvitations.map((invitation, index) => (
                    <div
                        key={invitation.id}
                        className="animate-fadeInUp opacity-0"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        <InvitationCard
                            invitation={invitation}
                            onDelete={onDelete}
                            onCopyLink={onCopyLink}
                            onToggleStatus={onToggleStatus}
                            onViewMessage={onViewMessage}
                        />
                    </div>
                ))}
            </div>

            {/* Mobile Compact List */}
            <div className="md:hidden bg-white dark:bg-zinc-800 rounded-xl shadow-md border border-wedding-champagne/30 dark:border-zinc-700 overflow-hidden">
                {/* Table Header */}
                <div className="flex justify-between items-center p-4 bg-wedding-pearl dark:bg-zinc-900 border-b border-wedding-champagne/20 dark:border-zinc-700">
                    <span className="text-xs font-bold text-wedding-slate dark:text-wedding-dove uppercase tracking-wider">
                        Invitations
                    </span>
                    <span className="text-xs text-wedding-dove">
                        Tap to expand
                    </span>
                </div>
                {/* List Items */}
                {filteredAndSortedInvitations.map((invitation) => (
                    <MobileInvitationRow
                        key={invitation.id}
                        invitation={invitation}
                        onDelete={onDelete}
                        onCopyLink={onCopyLink}
                        onUpdateMaxGuests={onUpdateMaxGuests}
                        onToggleStatus={onToggleStatus}
                        onViewMessage={onViewMessage}
                    />
                ))}
            </div>
        </div>
    );
}
