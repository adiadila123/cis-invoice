import React from "react";
import type { CalculationType, WorkDay } from "../hooks/useInvoiceCalculator";

export type PreviewTranslations = {
  preview: string;
  from: string;
  to: string;
  period: string;
  date: string;
  hrs: string;
  amount: string;
  gross: string;
  cis: string;
  net: string;
};

export type InvoicePreviewProps = {
  t: PreviewTranslations;
  language: "en-GB" | "ro";
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
  maxRows?: number;
  showTitle?: boolean;
  variant?: "screen" | "pdf";
};

export const InvoicePreview = React.forwardRef<HTMLDivElement, InvoicePreviewProps>(
  function InvoicePreview(
    {
      t,
      language,
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
      maxRows,
      showTitle = true,
      variant = "screen",
    },
    ref,
  ) {
    const rows = typeof maxRows === "number" ? workDays.slice(0, maxRows) : workDays;

    const classes =
      variant === "pdf"
        ? {
            wrapper: "border-2 border-slate-300 p-4 rounded text-xs bg-white text-slate-900",
            muted: "text-slate-700",
            brand: "text-slate-900",
            headerBorder: "border-slate-300",
            periodBg: "bg-slate-100",
            tableHead: "bg-slate-900 text-white",
            totalsGross: "bg-slate-100",
            totalsCis: "bg-slate-200 text-slate-900",
            totalsNet: "bg-slate-900 text-white",
          }
        : {
            wrapper: "border-2 border-slate-200 p-4 rounded-2xl text-xs bg-white text-slate-900",
            muted: "text-slate-700",
            brand: "text-emerald-700",
            headerBorder: "border-slate-200",
            periodBg: "bg-slate-50",
            tableHead: "bg-slate-900 text-white",
            totalsGross: "bg-slate-50",
            totalsCis: "bg-red-50 text-red-800",
            totalsNet: "bg-emerald-700 text-white",
          };

    return (
      <div ref={ref} className={classes.wrapper}>
        {showTitle && <h2 className="text-lg font-bold mb-4">📄 {t.preview}</h2>}

        <div className={`flex justify-between mb-4 pb-3 border-b-2 ${classes.headerBorder}`}>
          <div>
            <h1 className={`text-xl font-bold ${classes.brand}`}>INVOICE</h1>
            <p className={classes.muted}>{companyName || "Company"}</p>
            {utrNumber && <p className={classes.muted}>UTR: {utrNumber}</p>}
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${classes.brand}`}>#{invoiceNumber}</p>
            <p className={classes.muted}>
              {new Date().toLocaleDateString(language === "ro" ? "ro-RO" : "en-GB")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className={`font-bold ${classes.muted}`}>{t.from}</p>
            <p className="font-bold">{companyName || "Company"}</p>
          </div>
          <div>
            <p className={`font-bold ${classes.muted}`}>{t.to}</p>
            <p className="font-bold">{clientName || "Client"}</p>
          </div>
        </div>

        <div className={`${classes.periodBg} p-2 rounded mb-3`}>
          <div className="flex justify-between">
            <span className="font-bold">{t.period}:</span>
            <span>
              {startDate || "N/A"} - {endDate || "N/A"}
            </span>
          </div>
        </div>

        {workDays.length > 0 && (
          <table className="w-full mb-3">
            <thead>
              <tr className={classes.tableHead}>
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">{t.date}</th>
                {calculationType === "hours" && <th className="p-2 text-left">{t.hrs}</th>}
                <th className="p-2 text-right">{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((day, i) => {
                const amt = calculationType === "days" ? rate : rate * (Number(day.hours) || 0);
                return (
                  <tr key={`${day.date}-${i}`} className="border-b">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{day.date || "-"}</td>
                    {calculationType === "hours" && <td className="p-2">{day.hours || 0}</td>}
                    <td className="p-2 text-right">£{amt.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="flex justify-end">
          <div className="w-56 border-2 rounded overflow-hidden">
            <div className={`flex justify-between p-2 ${classes.totalsGross}`}>
              <span className="font-bold">{t.gross}</span>
              <span className="font-bold">£{gross.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between p-2 ${classes.totalsCis}`}>
              <span className="font-bold">{t.cis}</span>
              <span className="font-bold">-£{cis.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between p-2 ${classes.totalsNet}`}>
              <span className="font-bold">{t.net}</span>
              <span className="font-bold text-sm">£{net.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
