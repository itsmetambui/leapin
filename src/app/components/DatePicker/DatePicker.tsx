"use client";

import { getMonth, getYear } from "date-fns";
import {
  DatePickerContext,
  DatePickerDispatchContext,
} from "./DatePickerContext";
import MonthPicker from "./MonthPicker";
import Month from "./Month";
import Day from "./Day";
import { useDatePicker } from "./hooks/useDatePicker";

interface DatePickerProps {
  selected?: Date;
  onChange?: (date: Date) => void;
  filterDate?(date: Date): boolean;
  dayLabelFormat?(date: Date): string;
  weekdayLabelFormat?(date: Date): string;
  monthLabelFormat?(date: Date): string;
}

export default function DatePicker({
  selected,
  onChange,
  filterDate = () => true,
  dayLabelFormat,
  weekdayLabelFormat,
  monthLabelFormat,
}: DatePickerProps) {
  const [datePicker, dispatch] = useDatePicker({
    selected,
    onChange,
  });

  return (
    <DatePickerContext.Provider value={datePicker}>
      <DatePickerDispatchContext.Provider value={dispatch}>
        <div>
          <MonthPicker
            year={getYear(datePicker.focusedMonth)}
            month={getMonth(datePicker.focusedMonth)}
            monthLabelFormat={monthLabelFormat}
          />
          <Month
            year={getYear(datePicker.focusedMonth)}
            month={getMonth(datePicker.focusedMonth)}
            dayLabelFormat={dayLabelFormat}
            weekdayLabelFormat={weekdayLabelFormat}
            render={(days) =>
              days.map((day, dayIdx) => (
                <Day
                  key={dayIdx}
                  day={day}
                  disabled={day ? !filterDate(day.date) : true}
                />
              ))
            }
          />
        </div>
      </DatePickerDispatchContext.Provider>
    </DatePickerContext.Provider>
  );
}
