import { format, parseISO } from "date-fns";

import type { Booking } from "@/lib/api";

/**
 * Client-side PDF receipt generation for confirmed bookings.
 * Everything the invoice needs is on the Booking record itself — the
 * backend denormalizes the studio snapshot at booking time — so no
 * extra request is required.
 */

const BRAND = "StudioSpace";
const BRAND_URL = "studiospace.app";

// Hardcoded colors: a PDF canvas does not read CSS theme variables.
// Mirrors the amber primary token from globals.css.
const AMBER = "#D97706";
const INK = "#18181B";
const MUTED = "#71717A";
const FAINT = "#E4E4E7";
const PAPER = "#FAFAFA";

function money(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/** INV-<last 8 chars of booking id, uppercased>. */
export function invoiceNumber(booking: Booking): string {
  return `INV-${booking.id.slice(-8).toUpperCase()}`;
}

export function invoiceFileName(booking: Booking): string {
  return `StudioSpace-${invoiceNumber(booking)}.pdf`;
}

interface InvoiceCustomer {
  name?: string | null;
  email?: string | null;
}

/**
 * Builds and downloads a PDF receipt for a booking.
 * Call from a user gesture (button click) — the browser handles the
 * file save directly, nothing is uploaded anywhere.
 */
export async function downloadBookingInvoice(
  booking: Booking,
  customer?: InvoiceCustomer,
): Promise<void> {
  // Dynamic import keeps jsPDF out of the pages' initial bundles.
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 56;
  let y = 0;

  const text = (
    value: string,
    x: number,
    yy: number,
    opts: { size?: number; style?: "normal" | "bold" | "italic"; color?: string; align?: "left" | "right" } = {},
  ) => {
    doc.setFont("helvetica", opts.style ?? "normal");
    doc.setFontSize(opts.size ?? 10);
    doc.setTextColor(opts.color ?? INK);
    doc.text(value, x, yy, { align: opts.align ?? "left" });
  };

  const label = (value: string, x: number, yy: number, align: "left" | "right" = "left") =>
    text(value.toUpperCase(), x, yy, { size: 8, color: MUTED, align });

  // ── Brand bar + header ────────────────────────────────────────────
  doc.setFillColor(AMBER);
  doc.rect(0, 0, pageWidth, 8, "F");

  y = 64;
  text(BRAND, marginX, y, { size: 20, style: "bold" });
  text("Studio booking invoice", pageWidth - marginX, y - 4, {
    size: 10,
    align: "right",
  });
  y += 16;
  text(BRAND_URL, marginX, y, { size: 9, color: MUTED });

  y += 30;
  doc.setDrawColor(FAINT);
  doc.setLineWidth(1);
  doc.line(marginX, y, pageWidth - marginX, y);

  // ── Invoice meta (right aligned) ─────────────────────────────────
  y += 34;
  const metaX = pageWidth - marginX;
  label("Invoice no.", metaX, y, "right");
  text(invoiceNumber(booking), metaX, y + 16, { size: 11, style: "bold", align: "right" });
  label("Issued", metaX, y + 38, "right");
  text(format(new Date(), "MMM d, yyyy"), metaX, y + 52, { align: "right" });
  label("Status", metaX, y + 74, "right");
  text(booking.status.charAt(0).toUpperCase() + booking.status.slice(1), metaX, y + 88, {
    align: "right",
    color: AMBER,
  });

  // ── Billed to / booked studio ────────────────────────────────────
  const billedName = customer?.name || "Guest";
  const billedEmail = customer?.email ?? booking.userEmail ?? "";

  y += 92;
  label("Billed to", marginX, y);
  y += 18;
  text(billedName, marginX, y, { size: 12, style: "bold" });
  if (billedEmail) {
    y += 15;
    text(billedEmail, marginX, y, { size: 10, color: MUTED });
  }
  y += 34;
  label("Booking reference", marginX, y);
  y += 17;
  text(booking.id, marginX, y, { size: 10, color: MUTED });

  // ── Line items table ─────────────────────────────────────────────
  y += 60;
  const tableRight = pageWidth - marginX;
  const amountX = tableRight;
  const rateX = tableRight - 80;
  const hoursX = rateX - 70;
  const dateX = marginX + 120;

  doc.setFillColor(PAPER);
  doc.rect(marginX, y - 14, tableRight - marginX, 26, "F");
  doc.setDrawColor(FAINT);
  doc.rect(marginX, y - 14, tableRight - marginX, 26, "S");

  label("Description", marginX + 12, y + 5);
  label("Date", dateX, y + 5);
  label("Hours", hoursX, y + 5, "right");
  label("Rate", rateX, y + 5, "right");
  label("Amount", amountX, y + 5, "right");

  const itemY = y + 42;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(INK);
  const description = doc.splitTextToSize(booking.studioName, dateX - marginX - 40) as string[];
  description.forEach((line: string, index: number) => {
    text(line, marginX + 12, itemY + index * 14, { size: 11, style: "bold" });
  });
  text(format(parseISO(booking.date), "EEE, MMM d, yyyy"), dateX, itemY, { size: 10 });
  text(`${booking.hours}`, hoursX, itemY, { align: "right" });
  text(`${money(booking.pricePerHour)}/h`, rateX, itemY, { align: "right", size: 10 });
  text(money(booking.totalPrice), amountX, itemY, { align: "right", style: "bold" });

  y = itemY + Math.max(description.length - 1, 0) * 14 + 34;
  doc.setDrawColor(FAINT);
  doc.line(marginX, y, tableRight, y);

  // ── Totals ───────────────────────────────────────────────────────
  y += 26;
  label("Subtotal", rateX - 130, y, "right");
  text(money(booking.totalPrice), amountX, y, { align: "right" });
  y += 30;
  label("Total", rateX - 130, y, "right");
  doc.setFillColor(PAPER);
  doc.rect(rateX - 122, y - 14, tableRight - (rateX - 122), 24, "F");
  text(money(booking.totalPrice), amountX, y + 3, { size: 12, style: "bold", color: AMBER, align: "right" });

  // ── Footer ───────────────────────────────────────────────────────
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(FAINT);
  doc.line(marginX, pageHeight - 78, tableRight, pageHeight - 78);
  text(
    "This receipt confirms payment for a StudioSpace studio booking.",
    marginX,
    pageHeight - 58,
    { size: 9, color: MUTED },
  );
  text(
    `Booking ${booking.id} - generated ${format(new Date(), "MMM d, yyyy HH:mm")}`,
    marginX,
    pageHeight - 44,
    { size: 9, color: MUTED },
  );
  text(BRAND_URL, marginX, pageHeight - 30, { size: 9, color: MUTED });

  doc.save(invoiceFileName(booking));
}
