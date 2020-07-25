// import { config } from "../../src/apiGoogleconfig.json";
// import moment from "moment";

const config = require("../../src/apiGoogleconfig.json");
const moment = require("moment");

type SlotTypeEvent = {
  start: Date;
  end: Date;
};

async function slotQuery(accessCode: string) {
  return gapi.load("client:auth2", () => {
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
            const events: any[] = response.result.items;
            const rv: SlotTypeEvent[] = events.map((event: any) => ({
              start: moment.utc(event.start.dateTime).toDate(),
              end: moment.utc(event.end.dateTime).toDate(),
            }));
            rv.map((item: any) => {
              console.log(item);
            });

            return rv;
          });
      });
  });
}

const test = slotQuery("");

export default slotQuery;
