"use client";

import { format, addDays, startOfDay, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  reservationCounts: Record<string, number>;
  totalSeats: number;
}

export default function DatePicker({
  selectedDate,
  onDateChange,
  reservationCounts,
  totalSeats,
}: DatePickerProps) {
  const today = startOfDay(new Date());
  // Générer les 8 prochains jours (aujourd'hui + 7 jours)
  const dates = Array.from({ length: 8 }, (_, i) => addDays(today, i));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
        Choisir une date
      </h2>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);
          const dayName = format(date, "EEE", { locale: fr });
          const dayNumber = format(date, "d");
          const monthName = format(date, "MMM", { locale: fr });
          const dateKey = format(date, "yyyy-MM-dd");
          const reserved = reservationCounts[dateKey] ?? 0;
          const free = totalSeats - reserved;
          const isFull = free <= 0;

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center p-2.5 rounded-xl transition-all text-center
                ${
                  isSelected
                    ? "bg-indigo-500 text-white shadow-md shadow-indigo-200 scale-105"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:scale-102"
                }
                ${isToday && !isSelected ? "ring-2 ring-indigo-300" : ""}
              `}
            >
              <span
                className={`text-xs font-medium capitalize ${
                  isSelected ? "text-indigo-100" : "text-slate-400"
                }`}
              >
                {dayName}
              </span>
              <span className="text-lg font-bold">{dayNumber}</span>
              <span
                className={`text-xs capitalize ${
                  isSelected ? "text-indigo-100" : "text-slate-400"
                }`}
              >
                {monthName}
              </span>
              {isToday && (
                <span
                  className={`text-[10px] font-medium mt-0.5 ${
                    isSelected ? "text-indigo-200" : "text-indigo-500"
                  }`}
                >
                  Auj.
                </span>
              )}
              <span
                className={`text-[10px] font-semibold mt-1 px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? isFull
                      ? "bg-red-400/30 text-red-100"
                      : "bg-indigo-400/30 text-indigo-100"
                    : isFull
                    ? "bg-red-100 text-red-600"
                    : reserved > 0
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {reserved}/{totalSeats}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
