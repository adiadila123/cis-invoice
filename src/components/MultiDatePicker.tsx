import { useMemo, useState } from "react";

export type MultiDatePickerTranslations = {
  title: string;
  add: string;
  clear: string;
  close: string;
  selected: string;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toISODate(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function monthLabel(d: Date, locale: string) {
  return d.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

function isSameISO(a: string, b: string) {
  return a === b;
}

export function MultiDatePicker(props: {
  open: boolean;
  onClose: () => void;
  locale: "en-GB" | "ro-RO";
  t: MultiDatePickerTranslations;
  selected: string[];
  setSelected: (next: string[]) => void;
  onConfirm: () => void;
}) {
  const { open, onClose, locale, t, selected, setSelected, onConfirm } = props;
  const [viewDate, setViewDate] = useState<Date>(() => new Date());

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const grid = useMemo(() => {
    const first = startOfMonth(viewDate);
    const startDay = (first.getDay() + 6) % 7; // Monday=0
    const dim = daysInMonth(viewDate);
    const cells: Array<{ iso: string | null; day: number | null }> = [];
    for (let i = 0; i < startDay; i += 1) cells.push({ iso: null, day: null });
    for (let day = 1; day <= dim; day += 1) {
      const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      cells.push({ iso: toISODate(d), day });
    }
    while (cells.length % 7 !== 0) cells.push({ iso: null, day: null });
    return cells;
  }, [viewDate]);

  const toggle = (iso: string) => {
    const next = new Set(selectedSet);
    if (next.has(iso)) next.delete(iso);
    else next.add(iso);
    // keep stable order
    setSelected(Array.from(next).sort());
  };

  const clear = () => setSelected([]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-md bg-white text-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">{t.title}</h3>
            <p className="text-xs text-slate-700">
              {t.selected}: <span className="font-semibold">{selected.length}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 hover:bg-slate-50"
          >
            {t.close}
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold hover:bg-slate-50"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            >
              ←
            </button>
            <div className="text-sm font-bold">{monthLabel(viewDate, locale)}</div>
            <button
              type="button"
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm font-bold hover:bg-slate-50"
              onClick={() => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs mb-2">
            {["M", "T", "W", "T", "F", "S", "S"].map((d) => (
              <div key={d} className="text-center font-bold text-slate-700">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {grid.map((cell, idx) => {
              if (!cell.iso || !cell.day) {
                return <div key={idx} className="h-10" />;
              }
              const active = selected.some((s) => isSameISO(s, cell.iso!));
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => toggle(cell.iso!)}
                  className={`h-10 rounded-lg border text-sm font-bold transition-colors ${
                    active
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={clear}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold hover:bg-slate-50"
            >
              {t.clear}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={selected.length === 0}
              className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-bold disabled:bg-slate-400"
            >
              {t.add}
            </button>
          </div>

          {selected.length > 0 && (
            <div className="mt-3 text-[11px] text-slate-700 break-words">
              <span className="font-bold">{t.selected}:</span> {selected.join(", ")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
