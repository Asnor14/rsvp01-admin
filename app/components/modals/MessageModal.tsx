"use client";

import { MessageCircle, X } from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// MESSAGE MODAL COMPONENT
// ============================================

interface MessageModalProps {
    invitation: InvitationWithGuests;
    onClose: () => void;
}

export function MessageModal({ invitation, onClose }: MessageModalProps) {
    const message = invitation.guests[0]?.message;
    const guestName = invitation.guests[0]?.name;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-zinc-800 border border-wedding-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeInUp"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-wedding-champagne/20 dark:bg-wedding-gold/10 p-2 rounded-full">
                            <MessageCircle className="w-6 h-6 text-wedding-gold" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-wedding-charcoal dark:text-wedding-ivory font-serif">
                                Message
                            </h3>
                            <p className="text-xs text-wedding-dove">
                                From {guestName || invitation.family_name}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-wedding-dove hover:text-wedding-charcoal dark:hover:text-wedding-ivory transition-colors rounded-lg hover:bg-wedding-pearl/50 dark:hover:bg-zinc-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {message ? (
                    <div className="bg-wedding-pearl/50 dark:bg-zinc-900/50 rounded-xl p-4 border border-wedding-champagne/20 dark:border-zinc-700">
                        <p className="text-wedding-charcoal dark:text-wedding-ivory leading-relaxed italic">
                            &ldquo;{message}&rdquo;
                        </p>
                    </div>
                ) : (
                    <div className="bg-wedding-pearl/50 dark:bg-zinc-900/50 rounded-xl p-4 border border-wedding-champagne/20 dark:border-zinc-700 text-center">
                        <p className="text-wedding-dove italic">
                            No message from this guest
                        </p>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-wedding-gold text-white rounded-lg hover:bg-wedding-antique transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
