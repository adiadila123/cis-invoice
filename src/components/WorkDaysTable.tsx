import React, { useMemo, useState } from "react";
import { Calendar, Trash2 } from "lucide-react";
import type { CalculationType, WorkDay } from "../hooks/useInvoiceCalculator";
import { MultiDatePicker } from "./MultiDatePicker";

export type WorkDaysTranslations = {
  workDays: string;
  addMultiple: string;
  add: string;
  clear: string;
  close: string;
  selected: string;
};

export function WorkDaysTable(props: {
  t: WorkDaysTranslations;
  language: "en-GB" | "ro";
  calculationType: CalculationType;
  workDays: WorkDay[];
  setWorkDays: React.Dispatch<React.SetStateAction<WorkDay[]>>;
}) {
  const { t, language, calculationType, workDays, setWorkDays } = props;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const existingDates = useMemo(() => new Set(workDays.map((d) => d.date).filter(Boolean)), [workDays]);

  const addSelectedDates = () => {
    if (selectedDates.length === 0) return;

    const newDays: WorkDay[] = selectedDates
      .filter((iso) => !existingDates.has(iso))
      .map((iso) => ({
        date: iso,
        hours: calculationType === "days" ? 8 : 0,
      }));

    if (newDays.length > 0) setWorkDays((prev) => [...prev, ...newDays]);
    setSelectedDates([]);
    setPickerOpen(false);
  };

  const removeWorkDay = (index: number) => {
    setWorkDays((prev) => prev.filter((_, i) => i !== index));
  };

  const updateWorkDayDate = (index: number, value: string) => {
    setWorkDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], date: value };
      return updated;
    });
  };

  const updateWorkDayHours = (index: number, value: string) => {
    const hours = Number.parseFloat(value);
    setWorkDays((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], hours: Number.isFinite(hours) ? hours : 0 };
      return updated;
    });
  };

  const handleDragStart = (_e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setWorkDays((prev) => {
      const items = [...prev];
      const [removed] = items.splice(draggedIndex, 1);
      items.splice(dropIndex, 0, removed);
      return items;
    });

    setDraggedIndex(null);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {t.workDays}
        </h2>
        <button
          onClick={() => setPickerOpen(true)}
          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800"
          type="button"
        >
          {t.addMultiple}
        </button>
      </div>

      <MultiDatePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        locale={language === "ro" ? "ro-RO" : "en-GB"}
        t={{ title: t.addMultiple, add: t.add, clear: t.clear, close: t.close, selected: t.selected }}
        selected={selectedDates}
        setSelected={setSelectedDates}
        onConfirm={addSelectedDates}
      />

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {workDays.map((day, index) => (
          <div
            key={`${day.date}-${index}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 cursor-move ${
              draggedIndex === index ? "opacity-50" : ""
            }`}
          >
            <div className="text-slate-400">⋮⋮</div>

            <input
              type="date"
              value={day.date}
              onChange={(e) => updateWorkDayDate(index, e.target.value)}
              className="flex-1 px-2 py-1 border border-slate-300 rounded-lg text-sm bg-white"
            />

            {calculationType === "hours" && (
              <input
                type="number"
                step="0.5"
                value={day.hours}
                onChange={(e) => updateWorkDayHours(index, e.target.value)}
                className="w-24 px-2 py-1 border border-slate-300 rounded-lg text-sm bg-white"
              />
            )}

            <button
              onClick={() => removeWorkDay(index)}
              className="p-1 text-red-700 hover:bg-red-50 rounded"
              aria-label="Remove day"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
