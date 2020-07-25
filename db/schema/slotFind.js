"use strict";
// import { config } from "../../src/apiGoogleconfig.json";
// import moment from "moment";
exports.__esModule = true;
var config = require("../../src/apiGoogleconfig.json");
var moment = require("moment");
function slotQuery(accessCode) {
    return gapi.load("client:auth2", function () {
        return gapi.client
            .init({
            apiKey: config.apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scope
        })
            .then(function () {
            gapi.client.setToken({
                access_token: accessCode
            });
        }, function (error) {
            console.log("An error in Accessing Account");
        })
            .then(function () {
            return gapi.client.calendar.events
                .list({
                calendarId: "primary",
                timeMin: new Date().toISOString(),
                showDeleted: false,
                singleEvents: true,
                maxResults: 10,
                orderBy: "startTime"
            })
                .then(function (response) {
                // const events: any[] = response.result.items;
                var events = response.result.items;
                var rv = events.map(function (event) { return ({
                    start: moment.utc(event.start.dateTime).toDate(),
                    end: moment.utc(event.end.dateTime).toDate()
                }); });
                return rv;
            });
        });
    });
}
exports["default"] = slotQuery;
