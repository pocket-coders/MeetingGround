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

function roundStartTimeQuarterHour(time: Date) {
  const timeToReturn = time;

  timeToReturn.setMilliseconds(
    Math.floor(timeToReturn.getMilliseconds() / 1000) * 1000
  );
  timeToReturn.setSeconds(Math.floor(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.floor(timeToReturn.getMinutes() / 15) * 15);
  return timeToReturn;
}

function roundEndTimeQuarterHour(time: Date) {
  const timeToReturn = time;

  timeToReturn.setMilliseconds(
    Math.ceil(timeToReturn.getMilliseconds() / 1000) * 1000
  );
  timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
  timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15);
  return timeToReturn;
}

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

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

//TODO: put this on client
// let resultArray: DictionaryItem[] = [];
// try {
//   rv.map((item: any) => {
//     let myDateKey: string = formatDate(item.start);
//     item.start = roundStartTimeQuarterHour(item.start);
//     item.end = roundStartTimeQuarterHour(item.end);

//     let currTimeToBeAdded = item.start;

//     let foundDate = resultArray?.find(
//       (item) => item.dateKey === myDateKey
//     );
//     if (foundDate) {
//       while (currTimeToBeAdded < item.end) {
//         foundDate.values.push(currTimeToBeAdded);
//         currTimeToBeAdded.setTime(
//           currTimeToBeAdded.getTime() + 15 * 1000 * 60
//         );
//       }
//     } else {
//       let tempObject: DictionaryItem = {
//         dateKey: myDateKey,
//         values: [],
//       };
//       while (currTimeToBeAdded < item.end) {
//         tempObject.values.push(currTimeToBeAdded);
//         currTimeToBeAdded.setTime(
//           currTimeToBeAdded.getTime() + 15 * 1000 * 60
//         );
//       }
//       resultArray.push(tempObject);
//     }
//     console.log(resultArray);
//     return Promise.resolve(resultArray);
//   });
// } catch (err) {
//   console.log("an error in the mapping of result array dictionary");
//   console.log(err);
//   return Promise.resolve(<DictionaryItem[]>[]);
// }
