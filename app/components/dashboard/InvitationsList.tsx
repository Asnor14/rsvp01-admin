"use client";

import { Mail } from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";
import { InvitationCard, MobileInvitationRow } from "./InvitationCard";

// ============================================
// INVITATIONS LIST COMPONENT
// ============================================

interface InvitationsListProps {
    invitations: InvitationWithGuests[];
    isLoading: boolean;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
    onUpdateMaxGuests?: (id: string, maxGuests: number) => void;
}

export function InvitationsList({
    invitations,
    isLoading,
    onDelete,
    onCopyLink,
    onUpdateMaxGuests,
}: InvitationsListProps) {
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
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl md:text-3xl font-serif text-wedding-charcoal dark:text-wedding-ivory">
                    Invitation Manager
                </h2>
                <span className="bg-wedding-gold text-white text-sm font-semibold px-3 py-1 rounded-full">
                    {invitations.length}
                </span>
            </div>

            {/* Desktop Grid */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
                {invitations.map((invitation, index) => (
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
                {invitations.map((invitation) => (
                    <MobileInvitationRow
                        key={invitation.id}
                        invitation={invitation}
                        onDelete={onDelete}
                        onCopyLink={onCopyLink}
                        onUpdateMaxGuests={onUpdateMaxGuests}
                    />
                ))}
            </div>
        </div>
    );
}
