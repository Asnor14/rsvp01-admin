"use client";

import { Loader2, Lock, Unlock, AlertTriangle, Info } from "lucide-react";

// ============================================
// LOCK/UNLOCK CONFIRMATION MODAL
// ============================================

interface LockConfirmModalProps {
    familyName: string;
    isLocking: boolean; // true = locking, false = unlocking
    onConfirm: () => void;
    onCancel: () => void;
    isProcessing: boolean;
}

export function LockConfirmModal({
    familyName,
    isLocking,
    onConfirm,
    onCancel,
    isProcessing,
}: LockConfirmModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onCancel}
        >
            <div
                className="bg-white dark:bg-zinc-800 border border-wedding-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${isLocking
                            ? "bg-amber-100 dark:bg-amber-900/30"
                            : "bg-emerald-100 dark:bg-emerald-900/30"
                        }`}>
                        {isLocking ? (
                            <AlertTriangle className="w-6 h-6 text-amber-500" />
                        ) : (
                            <Info className="w-6 h-6 text-emerald-500" />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold text-wedding-charcoal dark:text-wedding-ivory font-serif">
                        {isLocking ? "Lock Invitation?" : "Unlock Invitation?"}
                    </h3>
                </div>

                <p className="text-wedding-slate dark:text-wedding-dove mb-6">
                    {isLocking ? (
                        <>
                            This will lock the invitation for{" "}
                            <span className="font-semibold text-wedding-charcoal dark:text-wedding-ivory">
                                {familyName}
                            </span>
                            . The guest will no longer be able to respond or update their RSVP.
                        </>
                    ) : (
                        <>
                            This will unlock the invitation for{" "}
                            <span className="font-semibold text-wedding-charcoal dark:text-wedding-ivory">
                                {familyName}
                            </span>
                            . This will allow the guest to respond to the invitation again.
                        </>
                    )}
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        disabled={isProcessing}
                        className="px-6 py-2.5 border border-wedding-champagne dark:border-zinc-700 text-wedding-slate dark:text-wedding-dove rounded-lg hover:bg-wedding-cream dark:hover:bg-zinc-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className={`px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${isLocking
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-emerald-500 text-white hover:bg-emerald-600"
                            }`}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isLocking ? (
                            <Lock className="w-4 h-4" />
                        ) : (
                            <Unlock className="w-4 h-4" />
                        )}
                        {isLocking ? "Lock" : "Unlock"}
                    </button>
                </div>
            </div>
        </div>
    );
}
