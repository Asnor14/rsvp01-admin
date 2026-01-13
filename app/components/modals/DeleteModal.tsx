"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================

interface DeleteModalProps {
    familyName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDeleting: boolean;
}

export function DeleteModal({
    familyName,
    onConfirm,
    onCancel,
    isDeleting,
}: DeleteModalProps) {
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
