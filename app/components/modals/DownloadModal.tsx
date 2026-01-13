"use client";

import { Loader2, Download, CheckCircle, FileText } from "lucide-react";

// ============================================
// PDF DOWNLOAD MODAL
// ============================================

interface DownloadModalProps {
    onDownload: (type: "all" | "accepted") => void;
    onCancel: () => void;
    isDownloading: boolean;
}

export function DownloadModal({
    onDownload,
    onCancel,
    isDownloading,
}: DownloadModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-zinc-800 border border-wedding-gold/30 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fadeInUp">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-wedding-champagne/30 dark:bg-wedding-gold/20 p-2 rounded-full">
                        <FileText className="w-6 h-6 text-wedding-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-wedding-charcoal dark:text-wedding-ivory font-serif">
                        Download RSVP List
                    </h3>
                </div>
                <p className="text-wedding-slate dark:text-wedding-dove mb-6">
                    Choose which RSVPs to include in the PDF export:
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => onDownload("all")}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-wedding-gold text-wedding-charcoal font-semibold rounded-lg hover:bg-wedding-antique transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        Download All RSVPs
                    </button>
                    <button
                        onClick={() => onDownload("accepted")}
                        disabled={isDownloading}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CheckCircle className="w-4 h-4" />
                        )}
                        Download Accepted Only
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isDownloading}
                        className="w-full px-6 py-2.5 border border-wedding-champagne dark:border-zinc-700 text-wedding-slate dark:text-wedding-dove rounded-lg hover:bg-wedding-cream dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 mt-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
