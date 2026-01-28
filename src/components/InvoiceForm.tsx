// React import not required with the new JSX transform
import { Calculator } from "lucide-react";
import type { CalculationType } from "../hooks/useInvoiceCalculator";

export type FormTranslations = {
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
};

export function InvoiceForm(props: {
  t: FormTranslations;
  language: "en-GB" | "ro";
  setLanguage: (l: "en-GB" | "ro") => void;
  calculationType: CalculationType;
  setCalculationType: (t: CalculationType) => void;
  resetWorkDays: () => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  clientName: string;
  setClientName: (v: string) => void;
  invoiceNumber: string;
  setInvoiceNumber: (v: string) => void;
  utrNumber: string;
  setUtrNumber: (v: string) => void;
  dailyRate: string;
  setDailyRate: (v: string) => void;
  hourlyRate: string;
  setHourlyRate: (v: string) => void;
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
}) {
  const {
    t,
    language,
    setLanguage,
    calculationType,
    setCalculationType,
    resetWorkDays,
    companyName,
    setCompanyName,
    clientName,
    setClientName,
    invoiceNumber,
    setInvoiceNumber,
    utrNumber,
    setUtrNumber,
    dailyRate,
    setDailyRate,
    hourlyRate,
    setHourlyRate,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = props;

  const CLIENT_OPTIONS = ["Blériot Building Construction Services", "Custom..."];
  const selectedClientIsCustom = clientName.trim() !== "" && !CLIENT_OPTIONS.slice(0, 1).includes(clientName);
  const clientSelectValue = CLIENT_OPTIONS.slice(0, 1).includes(clientName)
    ? clientName
    : selectedClientIsCustom
      ? "Custom..."
      : CLIENT_OPTIONS[0];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-8 h-8 text-emerald-400" />
          <h1 className="text-xl font-bold">{t.title}</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en-GB")}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
              language === "en-GB"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-slate-900 border-slate-300"
            }`}
            type="button"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("ro")}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${
              language === "ro"
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-slate-900 border-slate-300"
            }`}
            type="button"
          >
            RO
          </button>
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <label className="block text-xs font-bold mb-2">{t.type}</label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCalculationType("days");
              resetWorkDays();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm border ${
              calculationType === "days"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-900 border-slate-300"
            }`}
            type="button"
          >
            {t.days}
          </button>
          <button
            onClick={() => {
              setCalculationType("hours");
              resetWorkDays();
            }}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm border ${
              calculationType === "hours"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-900 border-slate-300"
            }`}
            type="button"
          >
            {t.hours}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-bold mb-1">{t.company}</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">{t.invoice}</label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-slate-50 text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">{t.client}</label>
          <select
            value={clientSelectValue}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "Custom...") setClientName("");
              else setClientName(val);
            }}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          >
            {CLIENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {clientSelectValue === "Custom..." && (
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Type client name"
              className="mt-2 w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
            />
          )}
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">{t.utr}</label>
          <input
            type="text"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">
            {calculationType === "days" ? t.dailyRate : t.hourlyRate}
          </label>
          <input
            type="number"
            value={calculationType === "days" ? dailyRate : hourlyRate}
            onChange={(e) =>
              calculationType === "days" ? setDailyRate(e.target.value) : setHourlyRate(e.target.value)
            }
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          />
        </div>

        <div />

        <div>
          <label className="block text-xs font-bold mb-1">{t.start}</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-bold mb-1">{t.end}</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white text-slate-900"
          />
        </div>
      </div>
    </>
  );
}
