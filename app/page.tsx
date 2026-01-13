"use client";

import { useState, useEffect, useTransition } from "react";
import { useTheme } from "next-themes";
import {
  Crown,
  LayoutDashboard,
  LogOut,
  Mail,
  CheckCircle,
  XCircle,
  UserPlus,
  Plus,
  Users,
  Users2,
  Calendar,
  Link,
  Trash2,
  Clock,
  Check,
  Loader2,
  X,
  AlertTriangle,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  createInvitation,
  deleteInvitation,
  getInvitations,
  getDashboardStats,
} from "./actions";
import type { InvitationWithGuests, DashboardStats } from "@/lib/supabase";

// ============================================
// TYPES
// ============================================

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

// ============================================
// PIN LOGIN COMPONENT
// ============================================

function PinLogin({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setPin("");
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-cream via-wedding-blush to-wedding-champagne dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 p-4 transition-colors duration-500">
      <div
        className={`w-full max-w-md bg-wedding-pearl/90 dark:bg-zinc-900/90 backdrop-blur-md border-2 border-wedding-gold/30 p-12 rounded-2xl shadow-2xl shadow-wedding-champagne/20 animate-fadeIn ${shake ? "animate-shake" : ""}`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-wedding-champagne/30 dark:bg-wedding-gold/20 p-4 rounded-full animate-pulse-slow">
            <Crown className="w-16 h-16 text-wedding-gold" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl text-center text-wedding-charcoal dark:text-wedding-ivory mb-2 font-serif">
          Admin Access
        </h1>
        <p className="text-sm text-center text-wedding-slate/70 dark:text-wedding-dove tracking-widest uppercase mb-8">
          Enter PIN to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setError(false);
            }}
            maxLength={4}
            placeholder="••••"
            className="w-full bg-transparent border-b-2 border-wedding-champagne/40 dark:border-wedding-gold/30 focus:border-wedding-gold focus:outline-none text-center text-2xl tracking-[0.5em] py-4 text-wedding-charcoal dark:text-wedding-ivory placeholder:text-wedding-dove/50 transition-colors duration-300"
            autoFocus
          />

          <button
            type="submit"
            className="w-full mt-8 bg-wedding-gold text-wedding-charcoal font-semibold tracking-widest px-12 py-4 rounded-lg transition-all duration-300 hover:bg-wedding-antique hover:scale-105 hover:shadow-lg"
          >
            ENTER
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm text-center mt-4 animate-fadeIn">
            Incorrect PIN. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// TOAST NOTIFICATION COMPONENT
// ============================================

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-white dark:bg-zinc-800 border border-wedding-gold shadow-2xl rounded-xl p-4 max-w-sm flex items-center gap-3 animate-slideInRight"
        >
          {toast.type === "success" && (
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          {toast.type === "info" && (
            <Mail className="w-5 h-5 text-blue-500 flex-shrink-0" />
          )}
          <span className="text-sm text-wedding-charcoal dark:text-wedding-ivory flex-1">
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-wedding-dove hover:text-wedding-charcoal dark:hover:text-wedding-ivory"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================

function DeleteModal({
  familyName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  familyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-zinc-800 border border-wedding-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeInUp">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-wedding-charcoal dark:text-wedding-ivory font-serif">
            Delete Invitation?
          </h3>
        </div>
        <p className="text-wedding-slate dark:text-wedding-dove mb-6">
          This will permanently delete the invitation for{" "}
          <span className="font-semibold text-wedding-charcoal dark:text-wedding-ivory">
            {familyName}
          </span>
          . This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-6 py-2.5 border border-wedding-champagne dark:border-zinc-700 text-wedding-slate dark:text-wedding-dove rounded-lg hover:bg-wedding-cream dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================

function Header({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
        <div className="flex items-center gap-4 w-full sm:w-auto">
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

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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

          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-2.5 border border-wedding-gold/50 text-wedding-slate dark:text-wedding-dove rounded-lg hover:bg-wedding-gold hover:text-white transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================
// STAT CARD COMPONENT
// ============================================

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  subtext,
  valueColor,
  delay,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
  subtext?: string;
  valueColor?: string;
  delay?: number;
}) {
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

// ============================================
// CREATE INVITATION FORM
// ============================================

function CreateInvitationForm({
  onSuccess,
}: {
  onSuccess: (msg: string) => void;
}) {
  const [familyName, setFamilyName] = useState("");
  const [maxGuests, setMaxGuests] = useState(2);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed on mobile? maybe just toggle

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!familyName.trim()) {
      setError("Family name is required");
      return;
    }

    startTransition(async () => {
      const result = await createInvitation(familyName, maxGuests);
      if (result.success) {
        setFamilyName("");
        setMaxGuests(2);
        onSuccess(`Invitation created for ${familyName}!`);
      } else {
        setError(result.error || "Failed to create invitation");
      }
    });
  };

  return (
    <div className="bg-wedding-pearl dark:bg-zinc-900 border-2 border-wedding-gold/30 rounded-xl mx-4 md:mx-12 mb-8 shadow-xl shadow-wedding-champagne/20 animate-fadeInUp overflow-hidden transition-all">
      <div
        className="p-6 md:p-8 flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={() => {
          // Only toggle on mobile effectively, but simple global toggle is fine
          if (window.innerWidth < 768) setIsCollapsed(!isCollapsed);
        }}
      >
        <div className="flex items-center gap-3">
          <UserPlus className="w-6 h-6 text-wedding-gold" />
          <h2 className="text-xl md:text-2xl font-serif text-wedding-charcoal dark:text-wedding-ivory">
            Create New Invitation
          </h2>
        </div>
        <div className="md:hidden">
          {isCollapsed ? <ChevronDown className="w-5 h-5 text-wedding-dove" /> : <ChevronUp className="w-5 h-5 text-wedding-dove" />}
        </div>
      </div>

      {/* Divider */}
      <div className="h-0.5 bg-wedding-gold w-16 mx-6 md:mx-8 mb-4 hidden md:block" />

      {/* Form Content - always visible on desktop, toggle on mobile */}
      <div className={`px-6 md:px-8 pb-8 ${isCollapsed ? 'hidden md:block' : 'block'}`}>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Family Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-wedding-gold mb-2">
              Family Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="e.g., The Anderson Family"
              className="w-full bg-transparent border-b-2 border-wedding-champagne/40 dark:border-zinc-700 focus:border-wedding-gold focus:outline-none py-3 text-wedding-charcoal dark:text-wedding-ivory placeholder:text-wedding-dove/50 transition-colors duration-300"
            />
          </div>

          {/* Max Guests */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-wedding-gold mb-2">
              Maximum Guests
            </label>
            <input
              type="number"
              value={maxGuests}
              onChange={(e) => setMaxGuests(parseInt(e.target.value) || 2)}
              min={1}
              max={10}
              className="w-full bg-transparent border-b-2 border-wedding-champagne/40 dark:border-zinc-700 focus:border-wedding-gold focus:outline-none py-3 text-wedding-charcoal dark:text-wedding-ivory transition-colors duration-300"
            />
            <p className="text-xs text-wedding-dove mt-1">
              Usually 1-4 guests per family
            </p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {error && (
              <p className="text-red-400 text-sm animate-fadeIn">{error}</p>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="md:ml-auto flex items-center justify-center gap-2 bg-wedding-gold text-wedding-charcoal font-semibold tracking-widest px-10 py-4 rounded-lg transition-all duration-300 hover:bg-wedding-antique hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              CREATE INVITATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// INVITATION CARD COMPONENT (DESKTOP)
// ============================================

function InvitationCard({
  invitation,
  onDelete,
  onCopyLink,
}: {
  invitation: InvitationWithGuests;
  onDelete: (id: string, name: string) => void;
  onCopyLink: (id: string) => void;
}) {
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

function MobileInvitationRow({
  invitation,
  onDelete,
  onCopyLink,
}: {
  invitation: InvitationWithGuests;
  onDelete: (id: string, name: string) => void;
  onCopyLink: (id: string) => void;
}) {
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
        onClick={() => onDelete(invitation.id, invitation.family_name)} // Click name to delete? Or just show details?
      >
        <div className="font-semibold text-wedding-charcoal dark:text-wedding-ivory truncate text-sm">
          {invitation.family_name}
        </div>
        <div className="text-[10px] text-wedding-dove uppercase tracking-wider flex items-center gap-2">
          ID: {invitation.id.slice(0, 4)}...
          {invitation.stats.total_responses > 0 && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
        </div>
      </div>
      <div>
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${copied
            ? "bg-emerald-500 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" // Matching user screenshot blue button
            }`}
        >
          {copied ? "Copied" : "Invitation Link"}
        </button>
      </div>
    </div>
  );
}

// ============================================
// INVITATIONS LIST COMPONENT
// ============================================

function InvitationsList({
  invitations,
  isLoading,
  onDelete,
  onCopyLink,
}: {
  invitations: InvitationWithGuests[];
  isLoading: boolean;
  onDelete: (id: string, name: string) => void;
  onCopyLink: (id: string) => void;
}) {
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
        <span className="bg-wedding-gold text-wedding-charcoal text-sm font-semibold px-3 py-1 rounded-full">
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
        <div className="flex justify-between p-4 bg-wedding-pearl dark:bg-zinc-900 border-b border-wedding-champagne/20 dark:border-zinc-700">
          <span className="text-xs font-bold text-wedding-slate dark:text-wedding-dove uppercase tracking-wider">Name</span>
          <span className="text-xs font-bold text-wedding-slate dark:text-wedding-dove uppercase tracking-wider">Invitation Link</span>
        </div>
        {/* List Items */}
        {invitations.map((invitation) => (
          <MobileInvitationRow
            key={invitation.id}
            invitation={invitation}
            onDelete={onDelete}
            onCopyLink={onCopyLink}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [invitations, setInvitations] = useState<InvitationWithGuests[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const mainSiteUrl =
    process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://godfreyvanessa.vercel.app";

  // Toast helpers
  const addToast = (type: ToastType, message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    const [statsResult, invitationsResult] = await Promise.all([
      getDashboardStats(),
      getInvitations(),
    ]);

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }
    if (invitationsResult.success && invitationsResult.data) {
      setInvitations(invitationsResult.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Handlers
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateSuccess = (msg: string) => {
    addToast("success", msg);
    fetchData();
  };

  const handleCopyLink = (id: string) => {
    const link = `${mainSiteUrl}/?invite=${id}`;
    navigator.clipboard.writeText(link);
    addToast("success", "Link copied!");
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ id, name });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal) return;
    setIsDeleting(true);
    const result = await deleteInvitation(deleteModal.id);
    setIsDeleting(false);

    if (result.success) {
      addToast("success", `Deleted ${deleteModal.name}`);
      setDeleteModal(null);
      fetchData();
    } else {
      addToast("error", result.error || "Failed to delete");
    }
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <PinLogin onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-wedding-ivory dark:bg-black transition-colors duration-500">
      {/* Toasts */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Delete Modal */}
      {deleteModal && (
        <DeleteModal
          familyName={deleteModal.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal(null)}
          isDeleting={isDeleting}
        />
      )}

      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Stats Cards */}
      <div className="px-4 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 stagger-children">
          <StatCard
            icon={Mail}
            iconBg="bg-wedding-champagne/30"
            iconColor="text-wedding-gold"
            value={stats?.total_invitations || 0}
            label="Sent"
            delay={0}
          />
          <StatCard
            icon={CheckCircle}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-500"
            value={stats?.total_attending || 0}
            label="Attending"
            valueColor="text-emerald-600"
            subtext={`${stats?.response_rate || 0}%`}
            delay={100}
          />
          <div className="col-span-2 md:col-span-1">
            <StatCard
              icon={XCircle}
              iconBg="bg-rose-50"
              iconColor="text-rose-400"
              value={stats?.total_declined || 0}
              label="Declined"
              valueColor="text-rose-500"
              delay={200}
            />
          </div>
        </div>
      </div>

      {/* Create Form */}
      <CreateInvitationForm onSuccess={handleCreateSuccess} />

      {/* Invitations List */}
      <InvitationsList
        invitations={invitations}
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        onCopyLink={handleCopyLink}
      />

      {/* Spacer for mobile bottom edge */}
      <div className="h-10 md:hidden"></div>
    </div>
  );
}

// ============================================
// PAGE EXPORT
// ============================================

export default function Home() {
  return <Dashboard />;
}
