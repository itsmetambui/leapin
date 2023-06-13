"use client";

import {
  addDays,
  format,
  getDay,
  isFuture,
  isToday,
  startOfDay,
} from "date-fns";
import Datepicker from "./components/DatePicker/DatePicker";
import Timeslotpicker from "./components/TimeSlotPicker/TimeSlotPicker";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import TimeZonePicker from "./components/TimeZonePicker/TimeZonePicker";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(
    addDays(startOfDay(new Date()), 1)
  );
  const [timeZone, setTimeZone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const queryClient = new QueryClient();

  return (
    <main className="h-screen p-4 bg-white md:p-10">
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex flex-col gap-10">
            <h2 className="text-xl font-semibold leading-6 text-gray-600">
              Book a 30 minute meeting with Tam Bui
            </h2>
            <Datepicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dayLabelFormat={(date: Date) => format(date, "dd")}
              filterDate={(date) => {
                const day = getDay(date);
                return day !== 0 && day !== 6 && isFuture(date);
              }}
            />

            <TimeZonePicker
              selected={timeZone}
              onChange={(timeZone) => setTimeZone(timeZone)}
            />
          </div>
          <div className="mt-4 md:mt-[4.5rem]">
            <Timeslotpicker
              timeZone={timeZone}
              date={selectedDate}
              onChange={(date) => console.log(date)}
            />
          </div>
        </div>
      </QueryClientProvider>
    </main>
  );
}
