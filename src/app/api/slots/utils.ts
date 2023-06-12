import {
  addMinutes,
  endOfDay,
  getDay,
  isWithinInterval,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
} from "date-fns";
import {
  utcToZonedTime,
  zonedTimeToUtc,
  format as formatTZ,
} from "date-fns-tz";

export type TimeSlot = {
  start: string;
  end: string;
};

// Dummy calendar config for this demo
// We can replace this with real database call to access user's calendar config
export async function getCalendarConfig() {
  return {
    interval: 30,
    // Based on date-fns's getDay(): 0-Sunday, 1-Monday, 2-Tuesday, ..., 6-Saturday
    workingHours: {
      1: { start: "09:00", end: "12:00" },
      2: { start: "09:00", end: "12:00" },
      3: { start: "09:00", end: "12:00" },
      4: { start: "09:00", end: "12:00" },
      5: { start: "09:00", end: "12:00" },
    },
    timezone: "Asia/Ho_Chi_Minh",
  };
}

export function getAvailableSlots(
  startDateTime: string,
  endDateTime: string,
  interval: number,
  workingHours: { [key: number]: TimeSlot },
  timezone: string,
  workingHoursTimezone: string
) {
  const slots = [];

  let currentSlotStart = parseISO(startDateTime);
  let currentSlotEnd = addMinutes(currentSlotStart, interval);

  while (currentSlotEnd <= parseISO(endDateTime)) {
    const currentDayOfWeek = getDay(currentSlotStart);

    // Check if the current day has working hours defined
    if (workingHours.hasOwnProperty(currentDayOfWeek.toString())) {
      const { start, end } = workingHours[currentDayOfWeek];

      // Set working hour start and end times with timezone
      const workingHourStart = setMinutes(
        setHours(startOfDay(currentSlotStart), Number(start.split(":")[0])),
        Number(start.split(":")[1])
      );
      const workingHourEnd = setMinutes(
        setHours(endOfDay(currentSlotStart), Number(end.split(":")[0])),
        Number(end.split(":")[1])
      );

      // Convert working hour start and end times to UTC
      const workingHourStartUtc = zonedTimeToUtc(
        workingHourStart,
        workingHoursTimezone
      );
      const workingHourEndUtc = zonedTimeToUtc(
        workingHourEnd,
        workingHoursTimezone
      );

      // Convert UTC working hour start and end times to local time
      const workingHourStartLocal = utcToZonedTime(
        workingHourStartUtc,
        timezone
      );
      const workingHourEndLocal = utcToZonedTime(workingHourEndUtc, timezone);

      // Check if the current slot falls within working hours
      if (
        isWithinInterval(currentSlotStart, {
          start: workingHourStartLocal,
          end: workingHourEndLocal,
        }) &&
        isWithinInterval(currentSlotEnd, {
          start: workingHourStartLocal,
          end: workingHourEndLocal,
        })
      ) {
        slots.push({
          start: formatTZ(currentSlotStart, "yyyy-MM-dd'T'HH:mm:ssxxx", {
            timeZone: timezone,
          }),
          end: formatTZ(currentSlotEnd, "yyyy-MM-dd'T'HH:mm:ssxxx", {
            timeZone: timezone,
          }),
        });
      }
    }

    // Move to the next slot
    currentSlotStart = currentSlotEnd;
    currentSlotEnd = addMinutes(currentSlotStart, interval);
  }

  return slots;
}

// Algo can be improved
export function getOverllapedSlots(
  allSlots: TimeSlot[],
  takenSlots: TimeSlot[],
  timeZone: string
): TimeSlot[] {
  const overlapped = new Set<TimeSlot>();
  for (const takenSlot of takenSlots) {
    const takenSlotStart = parseISO(takenSlot.start).getTime();
    const takenSlotEnd = parseISO(takenSlot.end).getTime();

    for (const slot of allSlots) {
      const currentSlotStart = parseISO(slot.start).getTime();
      const currentSlotEnd = parseISO(slot.end).getTime();
      if (
        Math.max(currentSlotStart, takenSlotStart) <
        Math.min(currentSlotEnd, takenSlotEnd)
      ) {
        overlapped.add(slot);
      }
    }
  }

  return Array.from(overlapped);
}
