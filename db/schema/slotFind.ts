// import setSeconds from "date-fns/setSeconds";
// import setMinutes from "date-fns/setMinutes";
// import setHours from "date-fns/setHours";
const config = require("./apiGoogleconfig.json");
const moment = require("moment");
const axios = require("axios");

const clientId =
  "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com";
// const apiKey = "AIzaSyBp8aAD-xwmvna9o1InxK23wkpywLWm0oc";
const scope = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/calendar.settings.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];
const clientSecret = "vpM3s6IXDLcmZtNpkOFbeQMg";
const redirectUri = "http://localhost:3000";

const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

google.options({
  auth: oauth2Client,
  http2: true,
});

async function getAccessToken(refresh_token: any) {
  console.log(refresh_token);
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "refresh_token",
    });
    return Promise.resolve(response.data.access_token);
  } catch (error) {
    console.error(
      "this the error: ",
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
async function getList(): Promise<any[]> {
  try {
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
      auth: oauth2Client,
    });
    return Promise.resolve(response.data.items);
  } catch (err) {
    console.log("an error in the list");
    console.log(err);
    return Promise.resolve([]);
  }
}

async function slotQuery(refreshCode: string): Promise<any[]> {
  type DictionaryItem = {
    dateKey: string;
    values: Date[];
  };

  let result: SlotTypeEvent[] = [];
  return getAccessToken(refreshCode)
    .then((res) => {
      oauth2Client.setCredentials({
        access_token: res,
        scope: scope,
      });
      console.log("used this token: " + res);
    })
    .then(() => {
      return getList().then((res: any) => {
        console.log("CREATE ARRAY");
        const events: any[] = res;
        // console.log(res);
        events.map((event: any) =>
          result.push({
            start: moment.utc(event.start.dateTime).toDate().toString(),
            end: moment.utc(event.end.dateTime).toDate().toString(),
          })
        );
        result.map((item: any) => {
          console.log(item);
        });
        return result;
      });
    })
    .catch((err) => {
      console.log("error here: " + err);
      return [{ start: "hehehe", end: "welp" }];
    });
}

// slotQuery(
// "1//06cQm-VLd3mA9CgYIARAAGAYSNwF-L9Irc6b4reVW6-AWbpl1uGPE1h-3kkKcHZVbB0O9h50tJTAIhfvrOyWMFI7PQ1tw4n-Gl-o"
// );

export default slotQuery;
