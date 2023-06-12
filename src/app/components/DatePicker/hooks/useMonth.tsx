import { format } from "date-fns";
import {
  GetDaysProps,
  GetWeekdayLabelsProps,
  getDays,
  getWeekdayLabels,
} from "../utils";
import { useMemo } from "react";

export const dayLabelFormatFn = (date: Date) => format(date, "d");
export const weekdayLabelFormatFn = (date: Date) =>
  format(date, "eeeeee").toUpperCase();
export const monthLabelFormatFn = (date: Date) => format(date, "MMMM yyyy");

export interface UseMonthResult {
  weekdayLabels: string[];
  days: (null | { dayLabel: string; date: Date })[];
  monthLabel: string;
}

export interface UseMonthProps extends GetWeekdayLabelsProps, GetDaysProps {
  monthLabelFormat?(date: Date): string;
}

export function useMonth({
  year,
  month,
  dayLabelFormat = dayLabelFormatFn,
  weekdayLabelFormat = weekdayLabelFormatFn,
  monthLabelFormat = monthLabelFormatFn,
}: UseMonthProps): UseMonthResult {
  const days = useMemo(
    () => getDays({ year, month, dayLabelFormat }),
    [year, month, dayLabelFormat]
  );
  const weekdayLabels = useMemo(
    () => getWeekdayLabels({ weekdayLabelFormat }),
    [weekdayLabelFormat]
  );

  return {
    days,
    weekdayLabels,
    monthLabel: monthLabelFormat(new Date(year, month)),
  };
}
