import { useEffect, useReducer } from "react";
import {
  DatePickerAction,
  DatePickerActionType,
  DatePickerState,
} from "../DatePickerContext";
import {
  addDays,
  addMonths,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";

export interface UseDatePickerProps {
  selected?: Date;
  onChange?: (date: Date) => void;
}

export function useDatePicker({
  selected = startOfDay(new Date()),
  onChange = () => {},
}: UseDatePickerProps) {
  const reducer = useReducer(datePickerReducer, {
    selectedDate: selected,
    focusedDate: selected,
    focusedMonth: selected,
  });
  const state = reducer[0];

  useEffect(() => {
    onChange(state.selectedDate);
  }, [onChange, state.selectedDate]);

  return reducer;
}

const datePickerReducer = (
  state: DatePickerState,
  action: DatePickerAction
) => {
  switch (action.type) {
    case DatePickerActionType.SELECT_DATE: {
      if (isSameDay(state.selectedDate, action.payload)) return state;
      else {
        return {
          ...state,
          selectedDate: action.payload,
          focusedDate: action.payload,
        };
      }
    }
    case DatePickerActionType.SHIFT_FOCUS_DATE_LEFT: {
      const focusedDate = subDays(state.focusedDate, 1);
      return {
        ...state,
        focusedDate,
        focusedMonth: isSameMonth(state.focusedDate, focusedDate)
          ? state.focusedMonth
          : subMonths(state.focusedMonth, 1),
      };
    }
    case DatePickerActionType.SHIFT_FOCUS_DATE_RIGHT: {
      const focusedDate = addDays(state.focusedDate, 1);
      return {
        ...state,
        focusedDate,
        focusedMonth: isSameMonth(state.focusedDate, focusedDate)
          ? state.focusedMonth
          : addMonths(state.focusedMonth, 1),
      };
    }
    case DatePickerActionType.SHIFT_FOCUS_DATE_UP: {
      const focusedDate = subDays(state.focusedDate, 7);
      return {
        ...state,
        focusedDate: focusedDate,
        focusedMonth: isSameMonth(state.focusedDate, focusedDate)
          ? state.focusedMonth
          : subMonths(state.focusedMonth, 1),
      };
    }
    case DatePickerActionType.SHIFT_FOCUS_DATE_DOWN: {
      const focusedDate = addDays(state.focusedDate, 7);
      return {
        ...state,
        focusedDate: focusedDate,
        focusedMonth: isSameMonth(state.focusedDate, focusedDate)
          ? state.focusedMonth
          : addMonths(state.focusedMonth, 1),
      };
    }
    case DatePickerActionType.PREVIOUS_MONTH: {
      return {
        ...state,
        focusedMonth: subMonths(state.focusedMonth, 1),
      };
    }
    case DatePickerActionType.NEXT_MONTH: {
      return {
        ...state,
        focusedMonth: addMonths(state.focusedMonth, 1),
      };
    }
    default:
      return state;
  }
};
