"use client";

import { useState } from "react";
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react";
import type { InvitationWithGuests } from "@/lib/supabase";

// Hooks
import { useAuth, useToast, useDashboard } from "./hooks";

// Components
import { ToastContainer, StatCard } from "./components/ui";
import { DeleteModal, DownloadModal, MessageModal, LockConfirmModal } from "./components/modals";
import {
  LoginForm,
  Header,
  CreateInvitationForm,
  InvitationsList,
  GuestListTable,
} from "./components/dashboard";

// ============================================
// DASHBOARD COMPONENT
// ============================================

function Dashboard() {
  const { isAuthenticated, isCheckingAuth, login, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [activeView, setActiveView] = useState<"dashboard" | "history">("dashboard");
  const [messageModal, setMessageModal] = useState<InvitationWithGuests | null>(null);
  const [lockConfirmModal, setLockConfirmModal] = useState<{ id: string; name: string; isLocking: boolean } | null>(null);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);
  const {
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
    handleToggleStatus,
  } = useDashboard({ isAuthenticated, addToast });

  // Handler for create success - refresh data
  const handleCreateSuccess = (msg: string) => {
    addToast("success", msg);
    fetchData();
  };

  // Handler for viewing message
  const handleViewMessage = (invitation: InvitationWithGuests) => {
    setMessageModal(invitation);
  };

  // Handler for lock/unlock confirmation
  const handleLockClick = (id: string, currentStatus: string) => {
    const invitation = invitations.find(inv => inv.id === id);
    if (invitation) {
      const isLocking = currentStatus !== "responded";
      setLockConfirmModal({ id, name: invitation.family_name, isLocking });
    }
  };

  // Confirm lock/unlock
  const handleLockConfirm = async () => {
    if (!lockConfirmModal) return;
    setIsTogglingStatus(true);
    await handleToggleStatus(lockConfirmModal.id, lockConfirmModal.isLocking ? "pending" : "responded");
    setIsTogglingStatus(false);
    setLockConfirmModal(null);
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wedding-cream via-wedding-blush to-wedding-champagne dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
        <Loader2 className="w-8 h-8 text-wedding-gold animate-spin" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
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
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}

      {/* Download Modal */}
      {downloadModal && (
        <DownloadModal
          onDownload={handleDownload}
          onCancel={closeDownloadModal}
          isDownloading={isDownloading}
        />
      )}

      {/* Message Modal */}
      {messageModal && (
        <MessageModal
          invitation={messageModal}
          onClose={() => setMessageModal(null)}
        />
      )}

      {/* Lock Confirm Modal */}
      {lockConfirmModal && (
        <LockConfirmModal
          familyName={lockConfirmModal.name}
          isLocking={lockConfirmModal.isLocking}
          onConfirm={handleLockConfirm}
          onCancel={() => setLockConfirmModal(null)}
          isProcessing={isTogglingStatus}
        />
      )}

      {/* Header */}
      <Header
        onLogout={logout}
        onDownload={openDownloadModal}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* MAIN CONTENT AREA */}
      {activeView === "dashboard" ? (
        <>
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
            onUpdateMaxGuests={handleUpdateMaxGuests}
            onToggleStatus={handleLockClick}
            onViewMessage={handleViewMessage}
          />
        </>
      ) : (
        /* History / Guest List View */
        <div className="pt-8">
          <GuestListTable invitations={invitations} />
        </div>
      )}

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
