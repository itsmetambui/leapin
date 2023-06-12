import { NextResponse } from "next/server";
import { google } from "googleapis";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

import {
  getAvailableSlots,
  getCalendarConfig,
  getOverllapedSlots,
} from "./utils";

// Using the Google Calendar API to fetch existing events, working hours
// and returns available time slots for a given period of time
// https://developers.google.com/calendar/v3/reference/events/list
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const Params = z.object({
    timeMin: z.string().datetime(),
    timeMax: z.string().datetime(),
    timeZone: z.string(),
  });
  const params = {
    timeMin: searchParams.get("timeMin"),
    timeMax: searchParams.get("timeMax"),
    timeZone: searchParams.get("timeZone"),
  };

  const zod = Params.safeParse(params);
  if (!zod.success) {
    return NextResponse.json({ error: zod.error }, { status: 400 });
  }

  const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const calendarConfig = await getCalendarConfig();

  const response = await calendar.events.list({
    calendarId: "primary",
    singleEvents: true,
    orderBy: "startTime",
    timeMin: zod.data.timeMin,
    timeMax: zod.data.timeMax,
    timeZone: zod.data.timeZone,
  });

  const events = (response.data.items || []).map((event) => ({
    start: event.start?.dateTime!,
    end: event.end?.dateTime!,
  }));

  const slots = getAvailableSlots(
    zod.data.timeMin,
    zod.data.timeMax,
    calendarConfig.interval,
    calendarConfig.workingHours,
    zod.data.timeZone,
    calendarConfig.timezone
  );
  const overlappedSlots = getOverllapedSlots(
    slots,
    events,
    calendarConfig.timezone
  );
  const availableSlots = slots.filter((s) => !overlappedSlots.includes(s));

  return NextResponse.json({
    slots: availableSlots,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const Params = z.object({
    slot: z.object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    }),
    email: z.string().email(),
    timeZone: z.string(),
  });

  const zod = Params.safeParse(body);
  if (!zod.success) {
    return NextResponse.json({ error: zod.error }, { status: 400 });
  }

  const oAuth2Client = new google.auth.OAuth2({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
  });

  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const event = {
    summary: "30 minutes call with Tam Bui",
    location: "Virtual call",
    start: {
      dateTime: zod.data.slot.start,
      timeZone: zod.data.timeZone,
    },
    end: {
      dateTime: zod.data.slot.end,
      timeZone: zod.data.timeZone,
    },
    attendees: [{ email: "itsmetambui@gmail.com" }, { email: zod.data.email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: uuidv4(),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });
  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    requestBody: event,
  });

  return NextResponse.json({ data: response.data });
}
