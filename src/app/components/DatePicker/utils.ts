import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";

export interface GetWeekdayLabelsProps {
  weekdayLabelFormat?(date: Date): string;
}

export interface GetDaysProps {
  year: number;
  month: number;
  dayLabelFormat?(date: Date): string;
}

export function getWeekdayLabels({
  weekdayLabelFormat = (date: Date) => format(date, "iiiiii"),
}: GetWeekdayLabelsProps = {}) {
  const now = new Date();
  const arr = eachDayOfInterval({
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  });
  return arr.reduce((array, date) => {
    // @ts-ignore
    array.push(weekdayLabelFormat(date));
    return array;
  }, []);
}

export type CalendarDay = null | { dayLabel: string; date: Date };
export function getDays({
  year,
  month,
  dayLabelFormat = (date: Date) => format(date, "dd"),
}: GetDaysProps): CalendarDay[] {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(new Date(year, month));
  const days = eachDayOfInterval({ start: startDate, end: endDate }).map(
    (date) => ({
      date,
      dayLabel: dayLabelFormat(date),
    })
  );
  const startingWeekDay = getDay(startOfMonth(days[0].date));
  const nullElementsForPreviousMonth =
    startingWeekDay === 0
      ? new Array(6).fill(null)
      : new Array(startingWeekDay - 1).fill(null);
  return nullElementsForPreviousMonth.concat(days);
}
