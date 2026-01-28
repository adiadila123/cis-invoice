export function formatDateYYYYMMDD(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

export function todayInvoiceNumber(): string {
  return `INV-${formatDateYYYYMMDD(new Date())}`;
}

export function addDaysISO(startISO: string, offsetDays: number): string {
  // startISO: YYYY-MM-DD
  const [y, m, d] = startISO.split("-").map((v) => Number.parseInt(v, 10));
  if (!y || !m || !d) return "";
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + offsetDays);
  const yyyy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
