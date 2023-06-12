import { Dispatch, createContext } from "react";

export enum DatePickerActionType {
  SELECT_DATE = "SELECT_DATE",
  FOCUS_MONTH = "FOCUS_MONTH",
  SHIFT_FOCUS_DATE_LEFT = "SHIFT_FOCUS_DATE_LEFT",
  SHIFT_FOCUS_DATE_RIGHT = "SHIFT_FOCUS_DATE_RIGHT",
  SHIFT_FOCUS_DATE_UP = "SHIFT_FOCUS_DATE_UP",
  SHIFT_FOCUS_DATE_DOWN = "SHIFT_FOCUS_DATE_DOWN",
  PREVIOUS_MONTH = "PREVIOUS_MONTH",
  NEXT_MONTH = "NEXT_MONTH",
}

export type DatePickerAction =
  | {
      type: DatePickerActionType.SELECT_DATE;
      payload: Date;
    }
  | {
      type: DatePickerActionType.FOCUS_MONTH;
    }
  | {
      type: DatePickerActionType.SHIFT_FOCUS_DATE_LEFT;
    }
  | {
      type: DatePickerActionType.SHIFT_FOCUS_DATE_RIGHT;
    }
  | {
      type: DatePickerActionType.SHIFT_FOCUS_DATE_UP;
    }
  | {
      type: DatePickerActionType.SHIFT_FOCUS_DATE_DOWN;
    }
  | {
      type: DatePickerActionType.PREVIOUS_MONTH;
    }
  | {
      type: DatePickerActionType.NEXT_MONTH;
    };

export interface DatePickerState {
  selectedDate: Date;
  focusedDate: Date;
  focusedMonth: Date;
}

export const DatePickerContext = createContext<DatePickerState>(
  {} as DatePickerState
);

export const DatePickerDispatchContext = createContext<
  Dispatch<DatePickerAction>
>({} as Dispatch<DatePickerAction>);
