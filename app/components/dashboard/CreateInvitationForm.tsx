"use client";

import { useState, useTransition } from "react";
import { UserPlus, Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { createInvitation } from "../../actions";

// ============================================
// CREATE INVITATION FORM
// ============================================

interface CreateInvitationFormProps {
    onSuccess: (msg: string) => void;
}

export function CreateInvitationForm({ onSuccess }: CreateInvitationFormProps) {
    const [familyName, setFamilyName] = useState("");
    const [maxGuests, setMaxGuests] = useState(2);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(true);

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
                    {isCollapsed ? (
                        <ChevronDown className="w-5 h-5 text-wedding-dove" />
                    ) : (
                        <ChevronUp className="w-5 h-5 text-wedding-dove" />
                    )}
                </div>
            </div>

            {/* Divider */}
            <div className="h-0.5 bg-wedding-gold w-16 mx-6 md:mx-8 mb-4 hidden md:block" />

            {/* Form Content - always visible on desktop, toggle on mobile */}
            <div className={`px-6 md:px-8 pb-8 ${isCollapsed ? "hidden md:block" : "block"}`}>
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
                        {error && <p className="text-red-400 text-sm animate-fadeIn">{error}</p>}
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
