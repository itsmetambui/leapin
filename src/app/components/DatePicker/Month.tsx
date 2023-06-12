"use client";

import { useMonth } from "./hooks/useMonth";
import { CalendarDay } from "./utils";

interface MonthProps {
  year: number;
  month: number;
  dayLabelFormat?(date: Date): string;
  weekdayLabelFormat?(date: Date): string;
  render(days: CalendarDay[]): React.ReactNode;
}

export default function Month({
  year,
  month,
  dayLabelFormat,
  weekdayLabelFormat,
  render,
}: MonthProps) {
  const { days, weekdayLabels } = useMonth({
    year,
    month,
    dayLabelFormat,
    weekdayLabelFormat,
  });

  return (
    <div>
      <div className="grid grid-cols-7 mt-4 text-xs leading-6 text-center text-gray-500">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 mt-2 text-sm">{render(days)}</div>
    </div>
  );
}
