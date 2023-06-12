"use client";

import axios from "axios";
import { addDays, format, parseISO } from "date-fns";
import {
  toDate,
  format as formatTZ,
  zonedTimeToUtc,
  utcToZonedTime,
} from "date-fns-tz";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export type Timeslot = {
  start: string;
  end: string;
};
interface TimeSlotPickerProps {
  date: Date;
  onChange?: (timeslot: Timeslot) => void;
  dayLabelFormat?(date: Date): string;
  timeZone?: string;
}

export default function TimeSlotPicker({
  date,
  onChange,
  dayLabelFormat = (date: Date) => format(date, "EEEE, dd MMM"),
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: TimeSlotPickerProps) {
  const queryClient = useQueryClient();

  const dayLabel = dayLabelFormat(date);
  const zonedDate = zonedTimeToUtc(date, timeZone);
  const [preSelectedSlot, setPreSelectedSlot] = useState<Timeslot>(
    {} as Timeslot
  );

  const { data, error, isLoading } = useQuery<Timeslot[]>({
    queryKey: [
      "slots",
      {
        timeMin: zonedDate.toISOString(),
        timeMax: addDays(zonedDate, 1).toISOString(),
        timeZone,
      },
    ],
    queryFn: async ({ queryKey }) => {
      // @ts-ignore
      const [_key, { timeMin, timeMax, timeZone }] = queryKey;
      const res = await axios.get(
        `/api/slots?timeMin=${timeMin}&timeMax=${timeMax}&timeZone=${timeZone}`
      );
      return res.data.slots;
    },
  });

  const mutation = useMutation({
    mutationFn: ({
      slot,
      email,
      timeZone,
    }: {
      slot: Timeslot;
      email: string;
      timeZone: string;
    }) => {
      return axios.post("/api/slots", { slot, email, timeZone });
    },
    onSuccess: () => {
      alert("Meeting booked! See you soon");
      queryClient.invalidateQueries();
      setPreSelectedSlot({} as Timeslot);
    },
    onError: (error) => {
      console.log(error);
      // @ts-ignore
      alert(JSON.stringify(error.response.data));
    },
  });

  const handleBookMeeting = async () => {
    const email = prompt("Please enter your email:") || "";
    mutation.mutate({
      slot: {
        start: parseISO(preSelectedSlot.start).toISOString(),
        end: parseISO(preSelectedSlot.end).toISOString(),
      },
      email,
      timeZone,
    });
  };

  if (isLoading)
    return (
      <span className="text-sm font-semibold text-gray-600">
        Loading time slots...
      </span>
    );
  if (error)
    return (
      <span className="text-sm font-semibold text-gray-600">
        An error has occurred
      </span>
    );

  return (
    <div>
      <span className="text-sm font-semibold text-gray-600">{dayLabel}</span>
      <div className="flex flex-col gap-4 mt-6 w-52">
        {data?.map((slot) => (
          <div key={slot.start} className="flex gap-2">
            <button
              disabled={mutation.isLoading}
              onClick={() => setPreSelectedSlot(slot)}
              className="px-4 py-2 font-medium text-center text-indigo-600 transition-all border border-indigo-200 rounded-sm basis-full hover:bg-indigo-50"
            >
              {formatTZ(
                utcToZonedTime(toDate(slot.start, { timeZone }), timeZone),
                "HH:mm",
                { timeZone }
              )}
            </button>
            {preSelectedSlot.start === slot.start && (
              <button
                disabled={mutation.isLoading}
                onClick={handleBookMeeting}
                className="px-4 py-2 font-medium text-white bg-gray-800 rounded-sm"
              >
                {mutation.isLoading ? "Booking..." : "Confirm"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
