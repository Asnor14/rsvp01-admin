"use server";

import {
    Invitation,
    InvitationWithGuests,
    DashboardStats,
    Guest,
} from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client
// We use the Service Role Key to bypass RLS since this is an admin portal
// protected by a PIN, not Supabase Auth.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Deletion may fail if RLS is enabled.");
}

const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Response type for all actions
interface ActionResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

/**
 * Create a new invitation
 */
export async function createInvitation(
    familyName: string,
    maxGuests: number = 2
): Promise<ActionResponse<Invitation>> {
    // Validation
    if (!familyName || familyName.trim() === "") {
        return { success: false, error: "Family name is required" };
    }
    if (maxGuests < 1 || maxGuests > 10) {
        return { success: false, error: "Max guests must be between 1 and 10" };
    }

    const { data, error } = await supabase
        .from("invitations")
        .insert({
            family_name: familyName.trim(),
            max_guests: maxGuests,
            status: "pending",
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating invitation:", error);
        return { success: false, error: "Failed to create invitation" };
    }

    return { success: true, data };
}

/**
 * Delete an invitation (cascades to delete guests)
 */
export async function deleteInvitation(
    invitationId: string
): Promise<ActionResponse> {
    if (!invitationId) {
        return { success: false, error: "Invitation ID is required" };
    }

    try {
        // First delete associated guests
        const { error: guestError } = await supabase
            .from("guests")
            .delete()
            .eq("invitation_id", invitationId);

        if (guestError) {
            console.error("Error deleting guests:", guestError);
            return {
                success: false,
                error: `Failed to delete guests: ${guestError.message || 'Unknown error'}`
            };
        }

        // Then delete the invitation
        const { error: inviteError } = await supabase
            .from("invitations")
            .delete()
            .eq("id", invitationId);

        if (inviteError) {
            console.error("Error deleting invitation:", inviteError);
            return {
                success: false,
                error: `Failed to delete invitation: ${inviteError.message || 'Unknown error'}`
            };
        }

        return { success: true };
    } catch (err) {
        console.error("Unexpected error during deletion:", err);
        return { success: false, error: "An unexpected error occurred during deletion" };
    } finally {
        revalidatePath("/");
    }
}

/**
 * Update an invitation (max_guests)
 */
export async function updateInvitation(
    invitationId: string,
    maxGuests: number
): Promise<ActionResponse<Invitation>> {
    if (!invitationId) {
        return { success: false, error: "Invitation ID is required" };
    }
    if (maxGuests < 1 || maxGuests > 10) {
        return { success: false, error: "Max guests must be between 1 and 10" };
    }

    try {
        const { data, error } = await supabase
            .from("invitations")
            .update({ max_guests: maxGuests })
            .eq("id", invitationId)
            .select()
            .single();

        if (error) {
            console.error("Error updating invitation:", error);
            return {
                success: false,
                error: `Failed to update invitation: ${error.message || 'Unknown error'}`
            };
        }

        return { success: true, data };
    } catch (err) {
        console.error("Unexpected error during update:", err);
        return { success: false, error: "An unexpected error occurred during update" };
    } finally {
        revalidatePath("/");
    }
}

/**
 * Get all invitations with their guest RSVPs
 */
export async function getInvitations(): Promise<
    ActionResponse<InvitationWithGuests[]>
> {
    // Fetch all invitations
    const { data: invitations, error: invError } = await supabase
        .from("invitations")
        .select("*")
        .order("created_at", { ascending: false });

    if (invError) {
        console.error("Error fetching invitations:", invError);
        return { success: false, error: "Failed to fetch invitations" };
    }

    // Fetch all guests
    const { data: guests, error: guestError } = await supabase
        .from("guests")
        .select("*");

    if (guestError) {
        console.error("Error fetching guests:", guestError);
        return { success: false, error: "Failed to fetch guests" };
    }

    // Map guests to invitations
    const invitationsWithGuests: InvitationWithGuests[] = (
        invitations as Invitation[]
    ).map((invitation) => {
        const invitationGuests = (guests as Guest[]).filter(
            (g) => g.invitation_id === invitation.id
        );

        const attendingGuests = invitationGuests.filter((g) => g.attending);
        const declinedGuests = invitationGuests.filter((g) => !g.attending);

        return {
            ...invitation,
            guests: invitationGuests,
            stats: {
                total_responses: invitationGuests.length,
                attending_count: attendingGuests.length,
                declined_count: declinedGuests.length,
                total_guest_count: attendingGuests.reduce(
                    (sum, g) => sum + g.guest_count,
                    0
                ),
            },
        };
    });

    return { success: true, data: invitationsWithGuests };
}

/**
 * Get aggregated dashboard statistics
 */
export async function getDashboardStats(): Promise<ActionResponse<DashboardStats>> {
    // Count total invitations
    const { count: totalInvitations, error: invError } = await supabase
        .from("invitations")
        .select("*", { count: "exact", head: true });

    if (invError) {
        console.error("Error counting invitations:", invError);
        return { success: false, error: "Failed to fetch statistics" };
    }

    // Fetch all guests for statistics
    const { data: guests, error: guestError } = await supabase
        .from("guests")
        .select("attending, guest_count, invitation_id");

    if (guestError) {
        console.error("Error fetching guests:", guestError);
        return { success: false, error: "Failed to fetch statistics" };
    }

    // Filter guests that have a valid invitation_id (orphaned guests don't count)
    const validGuests = (guests as { attending: boolean; guest_count: number; invitation_id: string | null }[])
        .filter(g => g.invitation_id);

    // Calculate stats based on valid guests only
    const attendingGuests = validGuests.filter((g) => g.attending);
    const declinedGuests = validGuests.filter((g) => !g.attending);

    const totalAttending = attendingGuests.reduce(
        (sum, g) => sum + g.guest_count,
        0
    );
    const totalDeclined = declinedGuests.length;
    const totalGuestCount = validGuests.reduce((sum, g) => sum + g.guest_count, 0);

    // Calculate response rate
    const invitationsWithResponse = new Set(
        (guests as { invitation_id?: string }[])
            .map((g) => g.invitation_id)
            .filter(Boolean)
    ).size;
    const responseRate =
        totalInvitations && totalInvitations > 0
            ? Math.round((invitationsWithResponse / totalInvitations) * 100)
            : 0;

    return {
        success: true,
        data: {
            total_invitations: totalInvitations || 0,
            total_attending: totalAttending,
            total_declined: totalDeclined,
            total_guest_count: totalGuestCount,
            response_rate: responseRate,
        },
    };
}
