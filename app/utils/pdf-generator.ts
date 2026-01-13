import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvitationWithGuests } from "@/lib/supabase";

// ============================================
// PDF GENERATOR UTILITY
// ============================================

interface PDFColors {
    gold: [number, number, number];
    dark: [number, number, number];
    gray: [number, number, number];
    green: [number, number, number];
    red: [number, number, number];
}

const PDF_COLORS: PDFColors = {
    gold: [212, 175, 111], // #D4AF6F
    dark: [43, 43, 43],     // #2B2B2B
    gray: [100, 100, 100],
    green: [16, 185, 129],  // #10b981
    red: [239, 68, 68],     // #ef4444
};

export function generateRSVPPdf(
    data: InvitationWithGuests[],
    type: "all" | "accepted"
): void {
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
            email: guest.email || "-",
            attending: guest.attending,
            guestCount: guest.guest_count,
            message: guest.message || "-",
            createdAt: new Date(guest.created_at).toLocaleDateString("en-US"),
        }))
    );

    // Create PDF document
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
    });

    // Title
    doc.setFontSize(24);
    doc.setTextColor(...PDF_COLORS.gold);
    doc.text(
        "Wedding RSVP Guest List",
        doc.internal.pageSize.width / 2,
        20,
        { align: "center" }
    );

    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(...PDF_COLORS.gray);
    doc.text(
        type === "accepted" ? "[Confirmed Guests Only]" : "[All Responses]",
        doc.internal.pageSize.width / 2,
        28,
        { align: "center" }
    );

    // Generated date
    doc.setFontSize(10);
    doc.text(
        `Generated on ${new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })}`,
        doc.internal.pageSize.width / 2,
        35,
        { align: "center" }
    );

    // Summary stats
    const totalAttending = allGuests
        .filter((g) => g.attending)
        .reduce((sum, g) => sum + g.guestCount, 0);
    doc.setFontSize(11);
    doc.setTextColor(...PDF_COLORS.dark);
    doc.text(
        `Invitations: ${dataToExport.length}  |  Responses: ${allGuests.length}  |  Total Attending: ${totalAttending}`,
        doc.internal.pageSize.width / 2,
        43,
        { align: "center" }
    );

    // Table data
    const tableData = allGuests.map((guest, index) => [
        (index + 1).toString(),
        guest.guestName,
        guest.familyName,
        guest.email,
        guest.attending ? "Yes" : "No",
        guest.attending ? guest.guestCount.toString() : "-",
        guest.message.length > 40
            ? guest.message.slice(0, 40) + "..."
            : guest.message,
        guest.createdAt,
    ]);

    // Generate table
    autoTable(doc, {
        head: [
            ["#", "Guest Name", "Family", "Email", "Attending", "Party", "Message", "Date"],
        ],
        body:
            tableData.length > 0
                ? tableData
                : [["", "", "", "No guest responses found", "", "", "", ""]],
        startY: 50,
        theme: "grid",
        headStyles: {
            fillColor: PDF_COLORS.gold,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "left",
        },
        bodyStyles: {
            textColor: PDF_COLORS.dark,
            fontSize: 9,
        },
        columnStyles: {
            0: { cellWidth: 10, halign: "center" },
            1: { cellWidth: 35, fontStyle: "bold" },
            2: { cellWidth: 30 },
            3: { cellWidth: 45 },
            4: { cellWidth: 18, halign: "center" },
            5: { cellWidth: 15, halign: "center" },
            6: { cellWidth: 60 },
            7: { cellWidth: 25 },
        },
        didParseCell: (data) => {
            // Color the attending column
            if (data.column.index === 4 && data.section === "body") {
                if (data.cell.raw === "Yes") {
                    data.cell.styles.textColor = PDF_COLORS.green;
                    data.cell.styles.fontStyle = "bold";
                } else if (data.cell.raw === "No") {
                    data.cell.styles.textColor = PDF_COLORS.red;
                    data.cell.styles.fontStyle = "bold";
                }
            }
        },
        margin: { top: 50, left: 10, right: 10 },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...PDF_COLORS.gray);
        doc.text(
            `Page ${i} of ${pageCount} - Wedding RSVP Admin Dashboard`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" }
        );
    }

    // Download PDF
    doc.save(`rsvp-guests-${type}-${new Date().toISOString().split("T")[0]}.pdf`);
}
