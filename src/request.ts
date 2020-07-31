import * as config from "../src/apiGoogleconfig.json";
import moment from "moment";

// const config = require("../src/apiGoogleconfig.json");
// const moment = require("moment");

//const eventsArray = await slotQuery("accessCode");

type SlotTypeEvent = {
  start: Date;
  end: Date;
};

async function slotQuery(accessCode: string) {
  gapi.load("client:auth2", () => {
    return gapi.client
      .init({
        apiKey: config.config.apiKey,
        clientId: config.config.clientId,
        discoveryDocs: config.config.discoveryDocs,
        scope: config.config.scope,
      })
      .then(
        () => {
          gapi.client.setToken({
            access_token: accessCode,
          });
        },
        function (error: any) {
          console.log("An error in Accessing Account");
        }
      )
      .then(() => {
        return gapi.client.calendar.events
          .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          })
          .then((response: any) => {
            const events = response.result.items;
            const rv: SlotTypeEvent[] = events.map((event: any) => ({
              start: moment.utc(event.start.dateTime).toDate(),
              end: moment.utc(event.end.dateTime).toDate(),
            }));

            return rv;
          });
      });
  });
}

function invite(
  accessCode: string,
  duration: number,
  email: string,
  userName: string,
  comment: string,
  startTime: Date
): boolean {
  let success: boolean = false;
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: config.config.apiKey,
        clientId: config.config.clientId,
        discoveryDocs: config.config.discoveryDocs,
        scope: config.config.scope,
      })
      .then(
        function () {
          gapi.client.setToken({
            access_token: accessCode,
          });
        },
        function (error: any) {
          console.log("An error in Accessing Account");
        }
      )
      .then(function () {
        // const events: any[] = response.result.items;
        accessUserOffline(duration, email, userName, comment, startTime);
      });
  });
  return success;
}

function ISODateString(d: Date) {
  function pad(n: number) {
    return n < 10 ? "0" + n : n;
  }
  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    "T" +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds()) +
    "-" +
    pad(d.getTimezoneOffset() / 60) +
    ":00"
  );
}

function accessUserOffline(
  duration: number,
  email: string,
  userName: string,
  comment: string,
  startTime: Date
) {
  let result: boolean;
  const start: string = startTime.toString();
  const timeZone: string = startTime.getTimezoneOffset().toString();
  console.log(start);
  console.log(timeZone);
  const event = {
    summary: "Meeting with " + userName,
    location: "Online",
    description: comment,
    start: {
      // date: scheduledDate.toISOString(),
      dateTime: ISODateString(startTime),
      timeZone: "Etc/UTC",
    },
    end: {
      // date: scheduledDate.toISOString(),
      dateTime: ISODateString(
        new Date(startTime.getTime() + 60 * 1000 * duration)
      ),
      timeZone: "Etc/UTC",
    },
    recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
    attendees: [{ email: email }],
    visibility: "default",
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };

  gapi.client.calendar.events
    .insert({
      calendarId: "primary",
      resource: event,
      sendNotifications: true,
      sendUpdates: "all",
    })
    .execute((event) => {
      console.log("Event created: " + event.status);
      // result = event.status.toLocaleString() === "complete";
    });
  // return result;
}

/* ../../node_modules/@types/react-bootstrap/index.d.ts:47:15 - error TS2307: Cannot find module './lib' or its corresponding type declarations.

47 export * from './lib';
    */
