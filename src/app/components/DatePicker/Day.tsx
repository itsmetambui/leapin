"use client";

import { useContext, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { isSameDay } from "date-fns";
import { CalendarDay } from "./utils";
import {
  DatePickerActionType,
  DatePickerContext,
  DatePickerDispatchContext,
} from "./DatePickerContext";

interface DayProps {
  day: CalendarDay;
  disabled?: boolean;
}

const today = new Date();
export default function Day({ day, disabled = false }: DayProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { selectedDate, focusedDate } = useContext(DatePickerContext);
  const dispatch = useContext(DatePickerDispatchContext);

  const isToday = useMemo(
    () => (day ? isSameDay(today, day.date) : false),
    [day]
  );
  const isFocusedDay = useMemo(
    () => (day ? isSameDay(focusedDate, day.date) : false),
    [day, focusedDate]
  );
  const isSelectedDay = useMemo(
    () => (day ? isSameDay(selectedDate, day.date) : false),
    [day, selectedDate]
  );

  useEffect(() => {
    if (isFocusedDay) {
      ref.current?.focus();
    }
  }, [isFocusedDay]);

  return (
    <div className={clsx("py-2")}>
      {day ? (
        <button
          ref={ref}
          type="button"
          onClick={() =>
            !disabled &&
            dispatch({
              type: DatePickerActionType.SELECT_DATE,
              payload: day.date,
            })
          }
          aria-disabled={disabled}
          className={clsx(
            "mx-auto relative flex h-10 w-10 text-indigo-600 font-bold transition-all hover:bg-indigo-200 bg-indigo-50 items-center justify-center rounded-full focus:outline-2 focus:outline-indigo-600",
            {
              "!text-gray-500 !bg-white hover:cursor-not-allowed focus:outline-gray-500 !font-medium":
                disabled,
              "text-white !bg-indigo-600": isSelectedDay,
            }
          )}
          onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (e.key === "ArrowRight") {
              dispatch({
                type: DatePickerActionType.SHIFT_FOCUS_DATE_RIGHT,
              });
            } else if (e.key === "ArrowLeft") {
              dispatch({
                type: DatePickerActionType.SHIFT_FOCUS_DATE_LEFT,
              });
            } else if (e.key === "ArrowUp") {
              dispatch({
                type: DatePickerActionType.SHIFT_FOCUS_DATE_UP,
              });
            } else if (e.key === "ArrowDown") {
              dispatch({
                type: DatePickerActionType.SHIFT_FOCUS_DATE_DOWN,
              });
            }
          }}
        >
          <time dateTime={day.dayLabel}>{day.dayLabel}</time>
          {isToday ? (
            <span
              className={clsx(
                "absolute w-1 h-1 bg-indigo-600 rounded-full bottom-2 left-[19px]",
                {
                  "!bg-gray-400": disabled,
                  "!bg-white": isSelectedDay,
                }
              )}
            ></span>
          ) : null}
        </button>
      ) : null}
    </div>
  );
}
