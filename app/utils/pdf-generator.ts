import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// PDF GENERATOR UTILITY
// ============================================

interface PDFColors {
    primary: [number, number, number];
    primaryDark: [number, number, number];
    dark: [number, number, number];
    gray: [number, number, number];
    lightGray: [number, number, number];
    green: [number, number, number];
    red: [number, number, number];
    white: [number, number, number];
    rowAlt: [number, number, number];
}

// Updated color palette: Gold -> Red theme
const PDF_COLORS: PDFColors = {
    primary: [220, 38, 38],      // #DC2626 - red-600 (primary accent)
    primaryDark: [185, 28, 28],  // #B91C1C - red-700 (darker variant)
    dark: [43, 43, 43],          // #2B2B2B
    gray: [100, 100, 100],
    lightGray: [240, 240, 240],
    green: [16, 185, 129],       // #10b981 - emerald-500
    red: [239, 68, 68],          // #ef4444 - red-400
    white: [255, 255, 255],
    rowAlt: [254, 242, 242],     // #FEF2F2 - red-50 (alternating row)
};

export interface PDFExportResult {
    success: boolean;
    guestCount: number;
    error?: string;
}

export function generateRSVPPdf(
    data: InvitationWithGuests[],
    type: "all" | "accepted"
): PDFExportResult {
    try {
        // Filter data based on type
        const dataToExport =
            type === "accepted"
                ? data.filter((inv) => inv.stats.attending_count > 0)
                : data;

        // Flatten guests for easy export
        const allGuests = dataToExport.flatMap((inv) =>
            inv.guests.map((guest) => ({
                familyName: inv.family_name,
                invitationId: inv.id,
                guestName: guest.name,
                email: guest.email || "N/A",
                attending: guest.attending,
                guestCount: guest.guest_count,
                message: guest.message || "",
                createdAt: new Date(guest.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                additionalGuests: guest.additional_guests || [],
            }))
        );

        // Create PDF document - Landscape A4
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;

        // ===== HEADER SECTION =====

        // Title
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...PDF_COLORS.primary);
        doc.text("Wedding RSVP Guest List", pageWidth / 2, 22, { align: "center" });

        // Subtitle
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...PDF_COLORS.gray);
        const subtitle = type === "accepted" ? "Confirmed Guests Only" : "All Responses";
        doc.text(`[ ${subtitle} ]`, pageWidth / 2, 30, { align: "center" });

        // Date - Right aligned
        doc.setFontSize(10);
        const exportDate = new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        doc.text(`Generated: ${exportDate}`, pageWidth - margin, 15, { align: "right" });

        // ===== SUMMARY STATS BAR =====
        const totalAttending = allGuests
            .filter((g) => g.attending)
            .reduce((sum, g) => sum + g.guestCount, 0);
        const totalDeclined = allGuests.filter((g) => !g.attending).length;

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...PDF_COLORS.dark);

        // Stats line
        const statsY = 40;
        const statsText = [
            `Total Invitations: ${dataToExport.length}`,
            `Responses: ${allGuests.length}`,
            `Attending: ${totalAttending}`,
            `Declined: ${totalDeclined}`,
        ].join("   |   ");
        doc.text(statsText, pageWidth / 2, statsY, { align: "center" });

        // Divider line
        doc.setDrawColor(...PDF_COLORS.primary);
        doc.setLineWidth(0.5);
        doc.line(margin, statsY + 5, pageWidth - margin, statsY + 5);

        // ===== TABLE SECTION =====

        // Table headers
        const headers = [
            "#",
            "Guest Name",
            "Family/Group",
            "Email",
            "Status",
            "Party Size",
            "Message",
            "RSVP Date",
        ];

        const tableData = allGuests.map((guest, index) => {
            const extraNames = guest.additionalGuests.map((ag) => {
                const name = typeof ag === 'string' ? ag : ag.name;
                return `+ ${name || "Unknown"}`;
            }).join("\n");
            const combinedName = guest.guestName + (extraNames ? "\n" + extraNames : "");

            return [
                (index + 1).toString(),
                combinedName || "Unknown",
                guest.familyName || "Unknown",
                guest.email,
                guest.attending ? "Attending" : "Declined",
                guest.attending ? guest.guestCount.toString() : "-",
                guest.message.length > 35 ? guest.message.slice(0, 35) + "..." : guest.message || "-",
                guest.createdAt,
            ];
        });

        // Generate table with fixed column widths totaling to page width minus margins
        // A4 Landscape = 297mm, minus 30mm margins = 267mm available
        autoTable(doc, {
            head: [headers],
            body: tableData.length > 0
                ? tableData
                : [["", "", "", "No guest responses found", "", "", "", ""]],
            startY: statsY + 10,
            theme: "striped",

            // Header styles
            headStyles: {
                fillColor: PDF_COLORS.primary,
                textColor: PDF_COLORS.white,
                fontStyle: "bold",
                fontSize: 10,
                halign: "center",
                valign: "middle",
                cellPadding: 4,
            },

            // Body styles
            bodyStyles: {
                textColor: PDF_COLORS.dark,
                fontSize: 9,
                cellPadding: 3,
                valign: "middle",
            },

            // Alternating row colors
            alternateRowStyles: {
                fillColor: PDF_COLORS.rowAlt,
            },

            // Fixed column widths for proper alignment
            columnStyles: {
                0: { cellWidth: 12, halign: "center", fontStyle: "bold" },  // #
                1: { cellWidth: 40, halign: "left", fontStyle: "bold" },    // Guest Name
                2: { cellWidth: 35, halign: "left" },                        // Family
                3: { cellWidth: 50, halign: "left" },                        // Email
                4: { cellWidth: 22, halign: "center" },                      // Status
                5: { cellWidth: 20, halign: "center" },                      // Party Size
                6: { cellWidth: 55, halign: "left" },                        // Message
                7: { cellWidth: 28, halign: "center" },                      // Date
            },

            // Margins
            margin: { top: statsY + 10, left: margin, right: margin, bottom: 20 },

            // Table width
            tableWidth: "auto",

            // Custom cell styling
            didParseCell: (data) => {
                // Style the Status column based on value
                if (data.column.index === 4 && data.section === "body") {
                    if (data.cell.raw === "Attending") {
                        data.cell.styles.textColor = PDF_COLORS.green;
                        data.cell.styles.fontStyle = "bold";
                    } else if (data.cell.raw === "Declined") {
                        data.cell.styles.textColor = PDF_COLORS.red;
                        data.cell.styles.fontStyle = "bold";
                    }
                }

                // Style Party Size column
                if (data.column.index === 5 && data.section === "body" && data.cell.raw !== "-") {
                    data.cell.styles.fontStyle = "bold";
                }
            },

            // Handle page breaks properly
            showHead: "everyPage",

            // Add hook for page breaks
            didDrawPage: (data) => {
                // Footer on every page
                const pageNumber = doc.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(...PDF_COLORS.gray);
                doc.text(
                    `Page ${data.pageNumber} of ${pageNumber} - Wedding RSVP Admin Dashboard`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: "center" }
                );

                // Add red accent line at bottom
                doc.setDrawColor(...PDF_COLORS.primary);
                doc.setLineWidth(0.3);
                doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            },
        });

        // Download PDF
        const filename = `rsvp-guests-${type}-${new Date().toISOString().split("T")[0]}.pdf`;
        doc.save(filename);

        return {
            success: true,
            guestCount: allGuests.length,
        };
    } catch (error) {
        console.error("PDF generation error:", error);
        return {
            success: false,
            guestCount: 0,
            error: error instanceof Error ? error.message : "Failed to generate PDF",
        };
    }
}
