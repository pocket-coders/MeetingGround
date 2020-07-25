"use strict";
exports.__esModule = true;
var apiGoogleconfig_json_1 = require("../../src/apiGoogleconfig.json");
var moment_1 = require("moment");
function slotQuery(accessCode) {
    return gapi.load("client:auth2", function () {
        return gapi.client
            .init({
            apiKey: apiGoogleconfig_json_1.config.apiKey,
            clientId: apiGoogleconfig_json_1.config.clientId,
            discoveryDocs: apiGoogleconfig_json_1.config.discoveryDocs,
            scope: apiGoogleconfig_json_1.config.scope
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
                    start: moment_1["default"].utc(event.start.dateTime).toDate(),
                    end: moment_1["default"].utc(event.end.dateTime).toDate()
                }); });
                return rv;
            });
        });
    });
}
exports["default"] = slotQuery;
