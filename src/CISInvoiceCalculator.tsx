// src/CISInvoiceCalculator.tsx
import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";

import { InvoiceForm } from "./components/InvoiceForm";
import { InvoicePreview } from "./components/InvoicePreview";
import { WorkDaysTable } from "./components/WorkDaysTable";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePdf } from "./pdf/InvoicePdf";

import {
  useInvoiceCalculator,
  type CalculationType,
  type WorkDay,
} from "./hooks/useInvoiceCalculator";
import { todayInvoiceNumber } from "./utils/date";

type Language = "en-GB" | "ro";

type Translations = {
  title: string;
  company: string;
  invoice: string;
  client: string;
  utr: string;
  dailyRate: string;
  hourlyRate: string;
  start: string;
  end: string;
  type: string;
  days: string;
  hours: string;
  workDays: string;
  addMultiple: string;
  add: string;
  clear: string;
  close: string;
  selected: string;
  date: string;
  hrs: string;
  gross: string;
  cis: string;
  net: string;
  download: string;
  preview: string;
  from: string;
  to: string;
  period: string;
  amount: string;
};

export default function CISInvoiceCalculator() {
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [dailyRate, setDailyRate] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [clientName, setClientName] = useState<string>("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState<string>("");
  const [calculationType, setCalculationType] = useState<CalculationType>("days");
  const [language, setLanguage] = useState<Language>("en-GB");

  useEffect(() => {
    // INV-<current date> e.g., INV-20260128
    setInvoiceNumber(todayInvoiceNumber());
    // Default client to the payer company
    setClientName("Blériot Building Construction Services");
  }, []);

  const t: Translations = useMemo(() => {
    const dict: Record<Language, Translations> = {
      "en-GB": {
        title: "CIS Invoice Calculator",
        company: "Company Name",
        invoice: "Invoice Number",
        client: "Client",
        utr: "UTR Number",
        dailyRate: "Daily Rate (£)",
        hourlyRate: "Hourly Rate (£)",
        start: "Start Date",
        end: "End Date",
        type: "Calculation Type",
        days: "Days",
        hours: "Hours",
        workDays: "Work Days",
        addMultiple: "Add Multiple Days",
        add: "Add",
        clear: "Clear",
        close: "Close",
        selected: "Selected",
        date: "Date",
        hrs: "Hours",
        gross: "Gross",
        cis: "CIS (20%)",
        net: "Net",
        download: "Download PDF",
        preview: "Invoice Preview",
        from: "From",
        to: "To",
        period: "Period",
        amount: "Amount",
      },
      ro: {
        title: "Calculator Facturi CIS",
        company: "Companie",
        invoice: "Număr Factură",
        client: "Client",
        utr: "UTR",
        dailyRate: "Tarif Zilnic (£)",
        hourlyRate: "Tarif Orar (£)",
        start: "Data Început",
        end: "Data Sfârșit",
        type: "Tip Calcul",
        days: "Zile",
        hours: "Ore",
        workDays: "Zile Lucrate",
        addMultiple: "Adaugă Multiple",
        add: "Adaugă",
        clear: "Șterge",
        close: "Închide",
        selected: "Selectate",
        date: "Data",
        hrs: "Ore",
        gross: "Brut",
        cis: "CIS (20%)",
        net: "Net",
        download: "Descarcă PDF",
        preview: "Previzualizare",
        from: "De la",
        to: "Către",
        period: "Perioadă",
        amount: "Suma",
      },
    };
    return dict[language];
  }, [language]);

  const { rate, gross, cis, net } = useInvoiceCalculator({
    calculationType,
    workDays,
    dailyRate,
    hourlyRate,
  });

  return (
      <div className="min-h-screen bg-slate-950 text-slate-50 p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-4 sm:p-6">
            <InvoiceForm
                t={t}
                language={language}
                setLanguage={setLanguage}
                calculationType={calculationType}
                setCalculationType={setCalculationType}
                resetWorkDays={() => setWorkDays([])}
                companyName={companyName}
                setCompanyName={setCompanyName}
                clientName={clientName}
                setClientName={setClientName}
                invoiceNumber={invoiceNumber}
                setInvoiceNumber={setInvoiceNumber}
                utrNumber={utrNumber}
                setUtrNumber={setUtrNumber}
                dailyRate={dailyRate}
                setDailyRate={setDailyRate}
                hourlyRate={hourlyRate}
                setHourlyRate={setHourlyRate}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
            />

            <WorkDaysTable
                t={t}
                language={language}
                calculationType={calculationType}
                workDays={workDays}
                setWorkDays={setWorkDays}
            />

            <PDFDownloadLink
                document={
                  <InvoicePdf
                      companyName={companyName}
                      clientName={clientName}
                      invoiceNumber={invoiceNumber}
                      utrNumber={utrNumber}
                      startDate={startDate}
                      endDate={endDate}
                      calculationType={calculationType}
                      workDays={workDays}
                      rate={rate}
                      gross={gross}
                      cis={cis}
                      net={net}
                  />
                }
                fileName={`${invoiceNumber || "invoice"}.pdf`}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold ${
                    workDays.length === 0
                        ? "bg-slate-400 pointer-events-none"
                        : "bg-emerald-700 text-white"
                }`}
            >
              {({ loading }) => (
                  <>
                    <Download className="w-5 h-5" />
                    {loading
                        ? language === "ro"
                            ? "Se generează PDF..."
                            : "Generating PDF..."
                        : t.download}
                  </>
              )}
            </PDFDownloadLink>
          </div>

          <div className="bg-white text-slate-900 rounded-2xl shadow-xl p-4 sm:p-6 lg:sticky lg:top-4 h-fit">
            <InvoicePreview
                t={t}
                language={language}
                companyName={companyName}
                clientName={clientName}
                invoiceNumber={invoiceNumber}
                utrNumber={utrNumber}
                startDate={startDate}
                endDate={endDate}
                calculationType={calculationType}
                workDays={workDays}
                rate={rate}
                gross={gross}
                cis={cis}
                net={net}
                maxRows={5}
                showTitle
                variant="screen"
            />
          </div>
        </div>
      </div>
  );
}
