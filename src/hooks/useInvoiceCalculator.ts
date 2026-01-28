import { useMemo } from "react";

export type CalculationType = "days" | "hours";

export type WorkDay = {
  date: string; // YYYY-MM-DD
  hours: number;
};

export function useInvoiceCalculator(params: {
  calculationType: CalculationType;
  workDays: WorkDay[];
  dailyRate: string;
  hourlyRate: string;
  cisRate?: number; // default 20%
}) {
  const cisRate = params.cisRate ?? 0.2;

  return useMemo(() => {
    const daily = Number.parseFloat(params.dailyRate) || 0;
    const hourly = Number.parseFloat(params.hourlyRate) || 0;

    if (params.calculationType === "days") {
      const total = params.workDays.length;
      const gross = total * daily;
      const cis = gross * cisRate;
      const net = gross - cis;
      return { total, rate: daily, gross, cis, net };
    }

    const total = params.workDays.reduce(
      (sum, d) => sum + (Number.isFinite(Number(d.hours)) ? Number(d.hours) : 0),
      0,
    );
    const gross = total * hourly;
    const cis = gross * cisRate;
    const net = gross - cis;
    return { total, rate: hourly, gross, cis, net };
  }, [params.calculationType, params.workDays, params.dailyRate, params.hourlyRate, cisRate]);
}
