// import setSeconds from "date-fns/setSeconds";
// import setMinutes from "date-fns/setMinutes";
// import setHours from "date-fns/setHours";
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
async function getList() {
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
    return Promise.resolve(response.data);
  } catch (err) {
    console.log("an error in the list");
    console.log(err);
    return Promise.resolve([]);
  }
}

async function slotQuery(refreshCode: string) {
  // return Promise.resolve([
  //   {
  //     dateKey: "2020-6-20",
  //     values: [
  //       setSeconds(setHours(setMinutes(new Date(), 0), 17), 0), // 17:00
  //       setHours(setMinutes(new Date(), 30), 18),
  //     ],
  //   },
  //   {
  //     dateKey: "2020-6-22",
  //     values: [
  //       setHours(setMinutes(new Date(), 30), 19),
  //       setHours(setMinutes(new Date(), 30), 17),
  //     ],
  //   },
  // ]);

  getAccessToken(refreshCode)
    .then((res) => {
      oauth2Client.setCredentials({
        access_token: res,
        scope: config.scope,
      });
      console.log("used this token: " + res);
    })
    .then(() => {
      getList().then((res: any) => {
        console.log("CREATE ARRAY");
        const events: any[] = res;
        // console.log(res);
        const rv = events.map((event: any) => ({
          start: moment.utc(event.start.dateTime).toDate().toISOString(),
          end: moment.utc(event.end.dateTime).toDate().toISOString(),
        }));
        rv.map((item: any) => {
          console.log(item);
        });
      });
      // console.log(res);
    });
}

slotQuery(
  "1//06cQm-VLd3mA9CgYIARAAGAYSNwF-L9Irc6b4reVW6-AWbpl1uGPE1h-3kkKcHZVbB0O9h50tJTAIhfvrOyWMFI7PQ1tw4n-Gl-o"
);

export default slotQuery;
