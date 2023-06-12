"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useContext } from "react";
import {
  DatePickerActionType,
  DatePickerDispatchContext,
} from "./DatePickerContext";
import { useMonth } from "./hooks/useMonth";

interface MonthPickerProps {
  year: number;
  month: number;
  monthLabelFormat?(date: Date): string;
}

export default function MonthPicker({
  year,
  month,
  monthLabelFormat,
}: MonthPickerProps) {
  const { monthLabel } = useMonth({
    year,
    month,
    monthLabelFormat,
  });
  const dispatch = useContext(DatePickerDispatchContext);

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        className="flex items-center justify-center flex-none w-10 h-10 text-indigo-600 transition-all rounded-full hover:bg-indigo-200 bg-indigo-50"
        onClick={() => dispatch({ type: DatePickerActionType.PREVIOUS_MONTH })}
      >
        <span className="sr-only">Previous month</span>
        <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
      </button>
      <h2 className="text-sm font-semibold text-gray-600 ">{monthLabel}</h2>
      <button
        type="button"
        className="flex items-center justify-center flex-none w-10 h-10 text-indigo-600 transition-all rounded-full hover:bg-indigo-200 bg-indigo-50"
        onClick={() => dispatch({ type: DatePickerActionType.NEXT_MONTH })}
      >
        <span className="sr-only">Next month</span>
        <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
