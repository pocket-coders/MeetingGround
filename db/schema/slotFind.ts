import { config } from "../../src/apiGoogleconfig.json";
import moment from "moment";

function slotQuery(accessCode: string) {
  type SlotType = {
    start: Date;
    end: Date;
  };
  return gapi.load("client:auth2", () => {
    return gapi.client
      .init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        discoveryDocs: config.discoveryDocs,
        scope: config.scope,
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
        return gapi.client.calendar.events
          .list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            showDeleted: false,
            singleEvents: true,
            maxResults: 10,
            orderBy: "startTime",
          })
          .then(function (response: any) {
            // const events: any[] = response.result.items;
            const events = response.result.items;
            const rv: SlotType[] = events.map((event: any) => ({
              start: moment.utc(event.start.dateTime).toDate(),
              end: moment.utc(event.end.dateTime).toDate(),
            }));
            return rv;
          });
      });
  });
}

export default slotQuery;
