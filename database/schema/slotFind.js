"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import setSeconds from "date-fns/setSeconds";
// import setMinutes from "date-fns/setMinutes";
// import setHours from "date-fns/setHours";
var config = require("./apiGoogleconfig.json");
var moment = require("moment");
var axios = require("axios");
var google = require("googleapis").google;
var oauth2Client = new google.auth.OAuth2(config.clientId, config.clientSecret, config.redirectUri);
google.options({
    auth: oauth2Client,
    http2: true
});
function getAccessToken(refresh_token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post("https://oauth2.googleapis.com/token", {
                            refresh_token: refresh_token,
                            client_id: config.clientId,
                            client_secret: config.clientSecret,
                            redirect_uri: config.redirectUri,
                            grant_type: "refresh_token"
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Promise.resolve(response.data.access_token)];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1.response.status, error_1.response.statusText, error_1.response.data);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
var calendar = google.calendar("v3");
function getList() {
    return __awaiter(this, void 0, void 0, function () {
        var response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, calendar.events.list({
                            calendarId: "primary",
                            timeMin: new Date().toISOString(),
                            showDeleted: false,
                            singleEvents: true,
                            maxResults: 10,
                            orderBy: "startTime",
                            auth: oauth2Client
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Promise.resolve(response.data)];
                case 2:
                    err_1 = _a.sent();
                    console.log("an error in the list");
                    console.log(err_1);
                    return [2 /*return*/, Promise.resolve([])];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function slotQuery(refreshCode) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
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
                .then(function (res) {
                oauth2Client.setCredentials({
                    access_token: res,
                    scope: config.scope
                });
                console.log("used this token: " + res);
            })
                .then(function () {
                getList().then(function (res) {
                    console.log("CREATE ARRAY");
                    var events = res;
                    // console.log(res);
                    var rv = events.map(function (event) { return ({
                        start: moment.utc(event.start.dateTime).toDate().toISOString(),
                        end: moment.utc(event.end.dateTime).toDate().toISOString()
                    }); });
                    rv.map(function (item) {
                        console.log(item);
                    });
                });
                // console.log(res);
            });
            return [2 /*return*/];
        });
    });
}
slotQuery("1//06cQm-VLd3mA9CgYIARAAGAYSNwF-L9Irc6b4reVW6-AWbpl1uGPE1h-3kkKcHZVbB0O9h50tJTAIhfvrOyWMFI7PQ1tw4n-Gl-o");
exports["default"] = slotQuery;
