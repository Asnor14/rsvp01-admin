"use client";

import { X, CheckCircle, XCircle, Mail } from "lucide-react";
import type { Toast } from "../../types";

// ============================================
// TOAST NOTIFICATION COMPONENT
// ============================================

interface ToastContainerProps {
    toasts: Toast[];
    removeToast: (id: number) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
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
