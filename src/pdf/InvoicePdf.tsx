// src/pdf/InvoicePdf.tsx
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CalculationType, WorkDay } from "../hooks/useInvoiceCalculator";

Font.registerHyphenationCallback((word) => [word]);

const COLORS = {
    ink: "#111827", // slate-900
    muted: "#4B5563", // slate-600/700
    light: "#E5E7EB", // gray-200
    lighter: "#F3F4F6", // gray-100
    accent: "#0F766E", // teal-700
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 28,
        paddingBottom: 28,
        paddingHorizontal: 28,
        fontSize: 10.5,
        fontFamily: "Helvetica",
        color: COLORS.ink,
        backgroundColor: "#FFFFFF",
    },

    // Header
    header: { marginBottom: 14 },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "flex-start",
    },
    brandBlock: { flexGrow: 1 },
    invoiceTitle: {
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: 0.2,
        marginBottom: 4,
    },
    accentBar: {
        height: 3,
        width: 72,
        backgroundColor: COLORS.accent,
        borderRadius: 4,
        marginTop: 2,
    },
    metaBox: {
        width: 220,
        borderWidth: 1,
        borderColor: COLORS.light,
        borderRadius: 8,
        padding: 10,
        backgroundColor: COLORS.lighter,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    metaLabel: { color: COLORS.muted, fontSize: 9.5 },
    metaValue: { fontSize: 9.5, fontWeight: 700 },

    // Two-column info cards
    cardsRow: { flexDirection: "row", gap: 12, marginTop: 12, marginBottom: 14 },
    card: {
        flexGrow: 1,
        borderWidth: 1,
        borderColor: COLORS.light,
        borderRadius: 10,
        padding: 12,
    },
    cardTitle: {
        fontSize: 9.5,
        color: COLORS.muted,
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.4,
    },
    line: { marginBottom: 4 },
    strong: { fontWeight: 700 },
    muted: { color: COLORS.muted },

    // Table
    table: {
        borderWidth: 1,
        borderColor: COLORS.light,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 12,
    },
    thead: {
        flexDirection: "row",
        backgroundColor: COLORS.lighter,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light,
    },
    th: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 9.5,
        fontWeight: 700,
        color: COLORS.ink,
    },
    tbodyRow: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: COLORS.light,
    },
    td: { paddingVertical: 8, paddingHorizontal: 10, fontSize: 9.5 },

    colDesc: { width: "55%" },
    colQty: { width: "15%", textAlign: "right" },
    colRate: { width: "15%", textAlign: "right" },
    colAmt: { width: "15%", textAlign: "right" },

    // Totals
    totalsWrap: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 6 },
    totalsBox: {
        width: 260,
        borderWidth: 1,
        borderColor: COLORS.light,
        borderRadius: 10,
        padding: 12,
        backgroundColor: "#FFFFFF",
    },
    totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 7 },
    totalsLabel: { color: COLORS.muted, fontSize: 9.5 },
    totalsValue: { fontSize: 9.5, fontWeight: 700 },
    totalsDivider: {
        borderTopWidth: 1,
        borderTopColor: COLORS.light,
        marginVertical: 8,
    },
    netLabel: { fontSize: 10.5, fontWeight: 700 },
    netValue: { fontSize: 10.5, fontWeight: 700 },

    footer: { marginTop: 18, fontSize: 8.5, color: "#6B7280" },
});

function fmtMoneyGBP(n: number) {
    const safe = Number.isFinite(n) ? n : 0;
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(safe);
}

function fmtDateISOToGB(d: string) {
    if (!d) return "-";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const [y, m, day] = d.split("-");
    return `${day}/${m}/${y}`;
}

function calcQty(workDays: WorkDay[], calculationType: CalculationType) {
    if (calculationType === "hours") {
        return workDays.reduce((acc, w) => acc + (Number(w.hours) || 0), 0);
    }
    return workDays.length;
}

export type InvoicePdfProps = {
    companyName: string;
    clientName: string;
    invoiceNumber: string;
    utrNumber: string;
    startDate: string;
    endDate: string;
    calculationType: CalculationType;
    workDays: WorkDay[];
    rate: number;
    gross: number;
    cis: number;
    net: number;
};

export function InvoicePdf(props: InvoicePdfProps) {
    const {
        companyName,
        clientName,
        invoiceNumber,
        utrNumber,
        startDate,
        endDate,
        calculationType,
        workDays,
        rate,
        gross,
        cis,
        net,
    } = props;

    const qty = calcQty(workDays, calculationType);
    const unitLabel = calculationType === "hours" ? "Hours" : "Days";
    const serviceName = calculationType === "hours" ? "Labour services (hourly)" : "Labour services (daily)";

    const workDatesRange =
        workDays.length > 0
            ? `${fmtDateISOToGB(workDays[0].date)} … ${fmtDateISOToGB(workDays[workDays.length - 1].date)}`
            : "-";

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View style={styles.brandBlock}>
                            <Text style={styles.invoiceTitle}>INVOICE</Text>
                            <View style={styles.accentBar} />
                        </View>

                        <View style={styles.metaBox}>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Invoice No.</Text>
                                <Text style={styles.metaValue}>{invoiceNumber || "-"}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Invoice Date</Text>
                                <Text style={styles.metaValue}>{fmtDateISOToGB(endDate || startDate)}</Text>
                            </View>
                            <View style={styles.metaRow}>
                                <Text style={styles.metaLabel}>Period</Text>
                                <Text style={styles.metaValue}>
                                    {fmtDateISOToGB(startDate)} – {fmtDateISOToGB(endDate)}
                                </Text>
                            </View>
                            <View style={[styles.metaRow, { marginBottom: 0 }]}>
                                <Text style={styles.metaLabel}>UTR</Text>
                                <Text style={styles.metaValue}>{utrNumber || "-"}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.cardsRow}>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>From</Text>
                            <Text style={[styles.line, styles.strong]}>{companyName || "-"}</Text>
                        </View>

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Bill To</Text>
                            <Text style={[styles.line, styles.strong]}>{clientName || "-"}</Text>
                        </View>
                    </View>
                </View>

                {/* LINE ITEMS TABLE */}
                <View style={styles.table}>
                    <View style={styles.thead}>
                        <Text style={[styles.th, styles.colDesc]}>Description</Text>
                        <Text style={[styles.th, styles.colQty]}>Qty</Text>
                        <Text style={[styles.th, styles.colRate]}>Rate</Text>
                        <Text style={[styles.th, styles.colAmt]}>Amount</Text>
                    </View>

                    <View style={styles.tbodyRow}>
                        <Text style={[styles.td, styles.colDesc]}>
                            {serviceName}
                            {"\n"}
                            <Text style={styles.muted}>Work dates: {workDatesRange}</Text>
                        </Text>
                        <Text style={[styles.td, styles.colQty]}>{qty}</Text>
                        <Text style={[styles.td, styles.colRate]}>{fmtMoneyGBP(rate)}</Text>
                        <Text style={[styles.td, styles.colAmt]}>{fmtMoneyGBP(gross)}</Text>
                    </View>
                </View>

                {/* TOTALS */}
                <View style={styles.totalsWrap}>
                    <View style={styles.totalsBox}>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Gross</Text>
                            <Text style={styles.totalsValue}>{fmtMoneyGBP(gross)}</Text>
                        </View>
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>CIS Deduction (20%)</Text>
                            <Text style={styles.totalsValue}>- {fmtMoneyGBP(cis)}</Text>
                        </View>

                        <View style={styles.totalsDivider} />

                        <View style={[styles.totalsRow, { marginBottom: 0 }]}>
                            <Text style={styles.netLabel}>Net Payable</Text>
                            <Text style={styles.netValue}>{fmtMoneyGBP(net)}</Text>
                        </View>

                        <Text style={[styles.muted, { marginTop: 8, fontSize: 9.2 }]}>
                            Unit: {unitLabel} • Total {unitLabel.toLowerCase()}: {qty}
                        </Text>
                    </View>
                </View>

                <Text style={styles.footer}>Generated by CIS Invoice Calculator</Text>
            </Page>
        </Document>
    );
}
