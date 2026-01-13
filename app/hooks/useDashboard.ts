"use client";

import { useState, useEffect, useCallback } from "react";
import {
    getInvitations,
    getDashboardStats,
    deleteInvitation,
    updateInvitation,
} from "../actions";
import type { InvitationWithGuests, DashboardStats } from "@/lib/supabase";
import type { DeleteModalState } from "../types";
import { generateRSVPPdf } from "../utils/pdf-generator";
import { MAIN_SITE_URL } from "../utils/constants";

// ============================================
// DASHBOARD DATA HOOK
// ============================================

interface UseDashboardProps {
    isAuthenticated: boolean;
    addToast: (type: "success" | "error" | "info", message: string) => void;
}

export function useDashboard({ isAuthenticated, addToast }: UseDashboardProps) {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [invitations, setInvitations] = useState<InvitationWithGuests[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<DeleteModalState | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [downloadModal, setDownloadModal] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, fetchData]);

    // Handlers
    const handleCopyLink = useCallback(
        (id: string) => {
            const link = `${MAIN_SITE_URL}/?invite=${id}`;
            navigator.clipboard.writeText(link);
            addToast("success", "Link copied!");
        },
        [addToast]
    );

    const handleDeleteClick = useCallback((id: string, name: string) => {
        setDeleteModal({ id, name });
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
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
    }, [deleteModal, addToast, fetchData]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteModal(null);
    }, []);

    const handleDownload = useCallback(
        async (type: "all" | "accepted") => {
            setIsDownloading(true);

            try {
                // Fetch fresh data from Supabase
                const result = await getInvitations();

                if (!result.success || !result.data) {
                    throw new Error(result.error || "Failed to fetch data from database");
                }

                // Check if there's any data to export
                if (result.data.length === 0) {
                    addToast("info", "No invitations found to export");
                    setIsDownloading(false);
                    return;
                }

                // Generate PDF with improved generator
                const pdfResult = generateRSVPPdf(result.data, type);

                if (pdfResult.success) {
                    const typeLabel = type === "accepted" ? "confirmed" : "all";
                    addToast("success", `Downloaded ${pdfResult.guestCount} ${typeLabel} guest records as PDF!`);
                    setDownloadModal(false);
                } else {
                    throw new Error(pdfResult.error || "Failed to generate PDF");
                }
            } catch (error) {
                console.error("Download error:", error);
                const message = error instanceof Error ? error.message : "Failed to generate PDF";
                addToast("error", message);
            }

            setIsDownloading(false);
        },
        [addToast]
    );

    const openDownloadModal = useCallback(() => {
        setDownloadModal(true);
    }, []);

    const closeDownloadModal = useCallback(() => {
        setDownloadModal(false);
    }, []);

    const handleUpdateMaxGuests = useCallback(
        async (id: string, maxGuests: number) => {
            const result = await updateInvitation(id, maxGuests);
            if (result.success) {
                addToast("success", `Updated max guests to ${maxGuests}`);
                fetchData();
            } else {
                addToast("error", result.error || "Failed to update");
            }
        },
        [addToast, fetchData]
    );

    return {
        stats,
        invitations,
        isLoading,
        deleteModal,
        isDeleting,
        downloadModal,
        isDownloading,
        fetchData,
        handleCopyLink,
        handleDeleteClick,
        handleDeleteConfirm,
        handleDeleteCancel,
        handleDownload,
        openDownloadModal,
        closeDownloadModal,
        handleUpdateMaxGuests,
    };
}
