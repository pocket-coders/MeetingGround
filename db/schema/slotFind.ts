// import { config } from "../../src/apiGoogleconfig.json";
// import moment from "moment";
// import setSeconds from "date-fns/setSeconds";
// import setMinutes from "date-fns/setMinutes";
// import setHours from "date-fns/setHours";
// import { google } from "googleapis";
const config = require("./apiGoogleconfig.json");
const moment = require("moment");
const axios = require("axios");
// const google = require("googleapis");

async function getAccessToken(refresh_token) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      refresh_token,
      client_id:
        "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com",
      client_secret: "vpM3s6IXDLcmZtNpkOFbeQMg",
      redirect_uri: "http://localhost:3000",
      grant_type: "refresh_token",
    });
    // console.log("acccess");
    // console.log(response.data.access_token);
    // console.log(response.status);
    // console.log(response.statusText);
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

  const accessToken = await getAccessToken(refreshCode);
  console.log(accessToken);

  const loading = gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: config.config.apiKey,
        clientId: config.config.clientId,
        discoveryDocs: config.config.discoveryDocs,
        scope: config.config.scope,
      })
      .then(
        () => {
          console.log("SET ACCESS TOKEN");
          gapi.client.setToken({
            access_token: accessToken,
          });
        },
        function (error: any) {
          console.log("An error in Accessing Account");
        }
      )
      .then(() => {
        console.log("CREATE EVENT LIST");
        gapi.client.calendar.events
          .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          })
          .then((response: any) => {
            console.log("CREATE ARRAY");
            const events: any[] = response.result.items;
            const rv: SlotTypeEvent[] = events.map((event: any) => ({
              start: moment.utc(event.start.dateTime).toDate().toISOString(),
              end: moment.utc(event.end.dateTime).toDate().toISOString(),
            }));
            rv.map((item: any) => {
              console.log(item);
            });

            //return rv;
          });
      });
  });

  return loading;
}

slotQuery(
  "1//06UBcPVmhaK0PCgYIARAAGAYSNwF-L9IrW4nBJnd6zOqWTh3jDgWHq3iCG5V_v5m-loT5yHpTJJJI3ni8WJg131MCSM3pZYOM-Vs"
);

export default slotQuery;
