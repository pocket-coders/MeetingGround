const config = require("./apiGoogleconfig.json");
const moment = require("moment");
const axios = require("axios");

const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  config.clientId,
  config.clientSecret,
  config.redirectUri
);

google.options({
  auth: oauth2Client,
  http2: true,
});

async function getAccessToken(refresh_token: any) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      refresh_token,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "refresh_token",
    });
    return Promise.resolve(response.data.access_token);
  } catch (error) {
    console.error(
      error.response.status,
      error.response.statusText,
      error.response.data
    );
  }
}

type SlotTypeEvent = {
  start: string;
  end: string;
};

const calendar = google.calendar("v3");

async function invite(
  refreshToken: string,
  duration: number,
  email: string,
  userName: string,
  comment: string,
  startTime: Date
) {
  const access = getAccessToken(refreshToken)
    .then((res) => {
      oauth2Client.setCredentials({
        access_token: res,
        scope: config.scope,
      });
      console.log("used this token: " + res);
    })
    .then(() => {
      sendInvite(duration, email, userName, comment, startTime);
    });
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

async function sendInvite(
  duration: number,
  email: string,
  userName: string,
  comment: string,
  startTime: Date
) {
  // let result: boolean;
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

  try {
    const response = await calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
        sendNotifications: true,
        sendUpdates: "all",
      })
      .execute((event: any) => {
        console.log("Event created: " + event.status);
        // result = event.status.toLocaleString() === "complete";
      });
  } catch (err) {
    console.log("an error in the list");
    console.log(err);
    return Promise.resolve();
  }
}
