"use client";

import { useState } from "react";
import {
    Users,
    Users2,
    Calendar,
    Link,
    Trash2,
    Clock,
    Check,
    CheckCircle,
    XCircle,
} from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// INVITATION CARD COMPONENT (DESKTOP)
// ============================================

interface InvitationCardProps {
    invitation: InvitationWithGuests;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
}

export function InvitationCard({
    invitation,
    onDelete,
    onCopyLink,
}: InvitationCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopyLink(invitation.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const createdDate = new Date(invitation.created_at);
    const now = new Date();
    const diffDays = Math.floor(
        (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const relativeTime =
        diffDays === 0
            ? "Today"
            : diffDays === 1
                ? "Yesterday"
                : `${diffDays} days ago`;

    const hasResponses = invitation.stats.total_responses > 0;

    return (
        <div className="bg-white dark:bg-zinc-800 border border-wedding-champagne/40 dark:border-zinc-700 rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-wedding-champagne/20 dark:bg-wedding-gold/10 p-2 rounded-lg flex-shrink-0">
                    <Users className="w-8 h-8 text-wedding-gold" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-wedding-charcoal dark:text-wedding-ivory truncate">
                        {invitation.family_name}
                    </h3>
                    <p className="text-xs text-wedding-dove font-mono">
                        ID: {invitation.id.slice(0, 8)}
                    </p>
                </div>
            </div>

            {/* Status & Metadata */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${hasResponses
                            ? invitation.stats.attending_count > 0
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                >
                    {hasResponses
                        ? invitation.stats.attending_count > 0
                            ? "Confirmed"
                            : "Declined"
                        : "Pending Response"}
                </span>
                <span className="flex items-center gap-1 text-sm text-wedding-slate dark:text-wedding-dove">
                    <Users2 className="w-4 h-4" />
                    Up to {invitation.max_guests} guests
                </span>
                <span className="flex items-center gap-1 text-xs text-wedding-dove">
                    <Calendar className="w-3 h-3" />
                    {relativeTime}
                </span>
            </div>

            {/* RSVP Status */}
            <div className="mb-4 min-h-[60px]">
                {!hasResponses ? (
                    <div className="flex items-center gap-2 text-sm text-wedding-dove italic">
                        <Clock className="w-4 h-4 opacity-50" />
                        No response yet
                    </div>
                ) : (
                    <div className="space-y-2">
                        {invitation.guests.map((guest) => (
                            <div
                                key={guest.id}
                                className="flex items-center gap-2 text-sm text-wedding-slate dark:text-wedding-dove"
                            >
                                {guest.attending ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                                )}
                                <span className="truncate">
                                    {guest.name}
                                    {guest.attending && guest.guest_count > 0 && (
                                        <span className="text-wedding-dove">
                                            {" "}
                                            ({guest.guest_count} guest
                                            {guest.guest_count > 1 ? "s" : ""})
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                        {invitation.guests[0]?.message && (
                            <p className="text-xs text-wedding-dove italic pl-6 truncate">
                                &ldquo;{invitation.guests[0].message.slice(0, 50)}
                                {invitation.guests[0].message.length > 50 ? "..." : ""}&rdquo;
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${copied
                            ? "bg-emerald-500 text-white"
                            : "bg-wedding-gold/10 text-wedding-gold border border-wedding-gold/30 hover:bg-wedding-gold hover:text-white"
                        }`}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Link className="w-4 h-4" />
                            Copy Link
                        </>
                    )}
                </button>
                <button
                    onClick={() => onDelete(invitation.id, invitation.family_name)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 rounded-lg text-sm font-medium hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                </button>
            </div>
        </div>
    );
}

// ============================================
// MOBILE COMPACT LIST ITEM
// ============================================

interface MobileInvitationRowProps {
    invitation: InvitationWithGuests;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
}

export function MobileInvitationRow({
    invitation,
    onDelete,
    onCopyLink,
}: MobileInvitationRowProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        onCopyLink(invitation.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between p-4 border-b border-wedding-champagne/20 dark:border-zinc-700 bg-white dark:bg-zinc-800 last:border-0 hover:bg-wedding-pearl/50 dark:hover:bg-zinc-750">
            <div
                className="flex-1 min-w-0 pr-4 cursor-pointer"
                onClick={() => onDelete(invitation.id, invitation.family_name)}
            >
                <div className="font-semibold text-wedding-charcoal dark:text-wedding-ivory truncate text-sm">
                    {invitation.family_name}
                </div>
                <div className="text-[10px] text-wedding-dove uppercase tracking-wider flex items-center gap-2">
                    ID: {invitation.id.slice(0, 4)}...
                    {invitation.stats.total_responses > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    )}
                </div>
            </div>
            <div>
                <button
                    onClick={handleCopy}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${copied
                            ? "bg-emerald-500 text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        }`}
                >
                    {copied ? "Copied" : "Invitation Link"}
                </button>
            </div>
        </div>
    );
}
