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
    Lock,
    Unlock,
} from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// INVITATION CARD COMPONENT (DESKTOP)
// ============================================

interface InvitationCardProps {
    invitation: InvitationWithGuests;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
    onToggleStatus?: (id: string, currentStatus: string) => void;
}

export function InvitationCard({
    invitation,
    onDelete,
    onCopyLink,
    onToggleStatus,
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
    const isLocked = invitation.status === "responded";

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
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
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
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${copied
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
                {onToggleStatus && (
                    <button
                        onClick={() => onToggleStatus(invitation.id, invitation.status)}
                        title={isLocked ? "Unlock RSVP" : "Lock RSVP"}
                        className={`px-3 py-2.5 rounded-lg border transition-all duration-300 flex items-center justify-center ${isLocked
                            ? "bg-rose-50 text-rose-500 border-rose-200 hover:bg-rose-500 hover:text-white dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-800/30"
                            : "bg-emerald-50 text-emerald-500 border-emerald-200 hover:bg-emerald-500 hover:text-white dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-800/30"
                            }`}
                    >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </button>
                )}
                <button
                    onClick={() => onDelete(invitation.id, invitation.family_name)}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 rounded-lg text-sm font-medium hover:bg-rose-500 hover:text-white transition-all duration-300"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ============================================
// MOBILE COMPACT LIST ITEM WITH ACTIONS
// ============================================

interface MobileInvitationRowProps {
    invitation: InvitationWithGuests;
    onDelete: (id: string, name: string) => void;
    onCopyLink: (id: string) => void;
    onUpdateMaxGuests?: (id: string, maxGuests: number) => void;
    onToggleStatus?: (id: string, currentStatus: string) => void;
}

export function MobileInvitationRow({
    invitation,
    onDelete,
    onCopyLink,
    onUpdateMaxGuests,
    onToggleStatus,
}: MobileInvitationRowProps) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [maxGuests, setMaxGuests] = useState(invitation.max_guests);

    const handleCopy = () => {
        onCopyLink(invitation.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSaveMaxGuests = () => {
        if (onUpdateMaxGuests && maxGuests !== invitation.max_guests) {
            onUpdateMaxGuests(invitation.id, maxGuests);
        }
        setIsEditing(false);
    };

    const hasResponses = invitation.stats.total_responses > 0;
    const isLocked = invitation.status === "responded";

    return (
        <div className="border-b border-wedding-champagne/20 dark:border-zinc-700 bg-white dark:bg-zinc-800 last:border-0">
            {/* Main Row - Clickable to expand */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-wedding-pearl/50 dark:hover:bg-zinc-750 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-wedding-charcoal dark:text-wedding-ivory truncate text-sm">
                            {invitation.family_name}
                        </span>
                        {hasResponses && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                        )}
                        {isLocked && (
                            <Lock className="w-3 h-3 text-rose-500" />
                        )}
                    </div>
                    <div className="text-[10px] text-wedding-dove uppercase tracking-wider flex items-center gap-2 mt-0.5">
                        <span>ID: {invitation.id.slice(0, 6)}...</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Users2 className="w-3 h-3" />
                            {invitation.max_guests} guests
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopy();
                        }}
                        className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${copied
                            ? "bg-emerald-500 text-white"
                            : "bg-wedding-gold/10 text-wedding-gold hover:bg-wedding-gold hover:text-white"
                            }`}
                        title="Copy invitation link"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                    </button>
                    <svg
                        className={`w-4 h-4 text-wedding-dove transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Expandable Action Panel */}
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 animate-fadeIn text-sm">
                    {/* Status badge and Toggle */}
                    <div className="mb-3 flex items-center justify-between">
                        <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${hasResponses
                                ? invitation.stats.attending_count > 0
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}
                        >
                            {hasResponses
                                ? invitation.stats.attending_count > 0
                                    ? `${invitation.stats.attending_count} Confirmed`
                                    : "Declined"
                                : "Pending"}
                        </span>

                        {onToggleStatus && (
                            <button
                                onClick={() => onToggleStatus(invitation.id, invitation.status)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${isLocked
                                    ? "text-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20"
                                    : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/20"
                                    }`}
                            >
                                {isLocked ? (
                                    <>
                                        <Lock className="w-3 h-3" /> Locked
                                    </>
                                ) : (
                                    <>
                                        <Unlock className="w-3 h-3" /> Open
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Max Guests Editor */}
                    <div className="flex items-center justify-between mb-3 p-3 bg-wedding-pearl/50 dark:bg-zinc-900/50 rounded-lg">
                        <div className="text-xs text-wedding-slate dark:text-wedding-dove">
                            Maximum Guests
                        </div>
                        {isEditing ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setMaxGuests(Math.max(1, maxGuests - 1))}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-wedding-champagne/30 dark:bg-zinc-700 text-wedding-charcoal dark:text-wedding-ivory hover:bg-wedding-gold hover:text-white transition-colors"
                                >
                                    -
                                </button>
                                <span className="w-6 text-center font-semibold text-wedding-charcoal dark:text-wedding-ivory">
                                    {maxGuests}
                                </span>
                                <button
                                    onClick={() => setMaxGuests(Math.min(10, maxGuests + 1))}
                                    className="w-7 h-7 flex items-center justify-center rounded-full bg-wedding-champagne/30 dark:bg-zinc-700 text-wedding-charcoal dark:text-wedding-ivory hover:bg-wedding-gold hover:text-white transition-colors"
                                >
                                    +
                                </button>
                                <button
                                    onClick={handleSaveMaxGuests}
                                    className="ml-2 px-3 py-1 text-xs font-medium bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1.5 text-xs font-medium text-wedding-gold hover:text-wedding-antique transition-colors"
                            >
                                <span>{invitation.max_guests}</span>
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${copied
                                ? "bg-emerald-500 text-white"
                                : "bg-wedding-gold text-white hover:bg-wedding-antique"
                                }`}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Link className="w-3.5 h-3.5" />
                                    Copy Link
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => onDelete(invitation.id, invitation.family_name)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/10 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-800/30 rounded-lg text-xs font-medium hover:bg-rose-500 hover:text-white transition-all duration-300"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
