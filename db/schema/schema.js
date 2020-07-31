"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
var graphql = require("graphql");
var slotFind_1 = require("./slotFind");
var invite_1 = require("./invite");
var _ = require("lodash");
var Link = require("../models/link");
var Host = require("../models/host");
var config = require("./apiGoogleconfig.json");
var axios = require("axios");
var moment = require("moment");
var ObjectId = require("mongodb").ObjectID;
var GraphQLObjectType = graphql.GraphQLObjectType, GraphQLString = graphql.GraphQLString, GraphQLID = graphql.GraphQLID, GraphQLInt = graphql.GraphQLInt, GraphQLList = graphql.GraphQLList, GraphQLNonNull = graphql.GraphQLNonNull, GraphQLBoolean = graphql.GraphQLBoolean;
function getRefreshToken(code) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.post("https://oauth2.googleapis.com/token", {
                            code: code,
                            client_id: "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com",
                            client_secret: "vpM3s6IXDLcmZtNpkOFbeQMg",
                            redirect_uri: "http://localhost:3000",
                            grant_type: "authorization_code"
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Promise.resolve(response.data.refresh_token)];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1.response.status, error_1.response.statusText, error_1.response.data);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
  });
}
// Types
var LinkType = new GraphQLObjectType({
    name: "Link",
    fields: function () { return ({
        id: { type: GraphQLID },
        url: { type: GraphQLString },
        duration: { type: GraphQLInt },
        used: {
            type: GraphQLBoolean
        },
        host: {
            type: HostType,
            resolve: function (parent, args) {
                return Host.findById(parent.hostId);
            }
        }
    }); }
});
var HostType = new GraphQLObjectType({
  name: "Host",
  fields: function () {
    return {
      id: { type: GraphQLID },
      Fname: { type: GraphQLString },
      Lname: { type: GraphQLString },
      email: { type: GraphQLString },
      refresh_token: { type: GraphQLString },
      urls_sent: {
        type: new GraphQLList(LinkType),
        resolve: function (parent, args) {
          return Link.find({ hostId: parent.id });
        },
      },
    };
  },
});
var EventCreateType = new GraphQLObjectType({
  name: "state",
  fields: function () {
    return {
      state: {
        type: GraphQLBoolean,
      },
    };
  },
});
var SlotType = new GraphQLObjectType({
  name: "Slot",
  fields: function () {
    return {
      start: { type: GraphQLString },
      end: { type: GraphQLString },
    };
  },
});
// Queries
var RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    link: {
      type: LinkType,
      args: { id: { type: GraphQLID } },
      resolve: function (parent, args) {
        return Link.findById(args.id);
      },
    },
    link_url: {
      type: LinkType,
      args: { url: { type: GraphQLString } },
      resolve: function (parent, args) {
        return Link.findOne(args);
      },
    },
    //List[[start, end], [start, end], [start, end], [start, end]]
    list_available_slots: {
      type: new GraphQLList(SlotType),
      args: { url: { type: GraphQLString } },
      resolve: function (parent, args) {
        return __awaiter(this, void 0, void 0, function () {
          var link, link_object, host, refresh_token_object, slots, tempResults;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                link = Link.findOne(args);
                return [
                  4 /*yield*/,
                  Link.findOne(args).select("hostId").exec(),
                ];
              case 1:
                link_object = _a.sent();
                host = Host.findOne({ _id: link_object.hostId });
                return [
                  4 /*yield*/,
                  Host.findOne({
                    _id: link_object.hostId,
                  })
                    .select("refresh_token")
                    .exec(),
                ];
              case 2:
                refresh_token_object = _a.sent();
                return [
                  4 /*yield*/,
                  slotFind_1["default"](refresh_token_object.refresh_token),
                ];
              case 3:
                slots = _a.sent();
                tempResults = [];
                slots.map(function (item) {
                  var tempObject = {
                    start: item.start,
                    end: item.end,
                  };
                  tempResults.push(tempObject);
                });
                return [2 /*return*/, tempResults];
            }
        },
        host: {
            type: HostType,
            args: { id: { type: GraphQLID } },
            resolve: function (parent, args) {
                return Host.findById(args.id);
            }
        },
        host_email: {
            type: HostType,
            args: { email: { type: GraphQLString } },
            resolve: function (parent, args) {
                return Host.findOne(args);
            }
        },
        links: {
            type: new GraphQLList(LinkType),
            resolve: function (parent, args) {
                //return all links;
                return Link.find({});
            }
        },
        hosts: {
            type: new GraphQLList(HostType),
            resolve: function (parent, args) {
                //return all hosts;
                return Host.find({});
            }
        }
    }
});
function checkHostsExists(email) {
  return __awaiter(this, void 0, void 0, function () {
    var h, hv;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          h = Host.findOne({ email: email });
          return [4 /*yield*/, h];
        case 1:
          hv = !!_a.sent();
          return [2 /*return*/, hv];
      }
    });
  });
}
function checkLinkExists(url) {
  return __awaiter(this, void 0, void 0, function () {
    var h, hv;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          h = Link.findOne({ url: url });
          return [4 /*yield*/, h];
        case 1:
          hv = !!_a.sent();
          return [2 /*return*/, hv];
      }
    });
  });
}
// Mutations
var Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addHost: {
            type: HostType,
            args: {
                Fname: { type: new GraphQLNonNull(GraphQLString) },
                Lname: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                auth_code: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: function (parent, _a) {
                var Fname = _a.Fname, Lname = _a.Lname, email = _a.email, auth_code = _a.auth_code;
                return __awaiter(this, void 0, void 0, function () {
                    var hostExists;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("Variables are: ", { Fname: Fname, Lname: Lname, email: email, auth_code: auth_code });
                                return [4 /*yield*/, checkHostsExists(email)];
                            case 1:
                                hostExists = _b.sent();
                                getRefreshToken(auth_code).then(function (result) {
                                    if (!hostExists) {
                                        var host = new Host({
                                            Fname: Fname,
                                            Lname: Lname,
                                            email: email,
                                            refresh_token: result
                                        });
                                        console.log("added to data base");
                                        return host.save(); //save to the database and return results
                                    }
                                });
                                return [2 /*return*/, null];
                        }
                    });
                    console.log("added to data base");
                    return host.save(); //save to the database and return results
                  }
                });
                // if (!hostExists) {
                //   const host = new Host({
                //     Fname: Fname,
                //     Lname: Lname,
                //     email: email,
                //     refresh_token: refresh,
                //   });
                //   return host.save(); //save to the database and return results
                // }
                return [2 /*return*/, null];
            }
        },
        addLink: {
            type: LinkType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) },
                duration: { type: new GraphQLNonNull(GraphQLInt) },
                hostId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: function (parent, _a) {
                var url = _a.url, duration = _a.duration, hostId = _a.hostId;
                return __awaiter(this, void 0, void 0, function () {
                    var linkExists, link;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("Variables are: ", { url: url, duration: duration, hostId: hostId });
                                return [4 /*yield*/, checkLinkExists(url)];
                            case 1:
                                linkExists = _b.sent();
                                if (!linkExists) {
                                    link = new Link({
                                        url: url,
                                        duration: duration,
                                        hostId: hostId,
                                        used: false
                                    });
                                    console.log("link added to data base");
                                    return [2 /*return*/, link.save()]; //save to the database and return results
                                }
                                return [2 /*return*/, null];
                        }
                    });
                });
                return [4 /*yield*/, checkLinkExists(url)];
              case 1:
                linkExists = _b.sent();
                if (!linkExists) {
                  link = new Link({
                    url: url,
                    duration: duration,
                    hostId: hostId,
                  });
                  console.log("link added to data base");
                  return [2 /*return*/, link.save()]; //save to the database and return results
                }
                return [2 /*return*/, null];
            }
        },
        create_event: {
            type: EventCreateType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                comment: { type: new GraphQLNonNull(GraphQLString) },
                startTime: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: function (parent, 
            // args
            _a) {
                var url = _a.url, duration = _a.duration, email = _a.email, username = _a.username, comment = _a.comment, startTime = _a.startTime;
                return __awaiter(this, void 0, void 0, function () {
                    var link_object, link_object_duration, refresh_token_object, host_first, host_last, slots, tempEvent, tempID, temp_used;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("the variable are: ", {
                                    url: url,
                                    email: email,
                                    username: username,
                                    comment: comment,
                                    startTime: startTime
                                });
                                return [4 /*yield*/, Link.findOne({ url: url }).select("hostId").exec()];
                            case 1:
                                link_object = _b.sent();
                                return [4 /*yield*/, Link.findOne({ url: url })
                                        .select("duration")
                                        .exec()];
                            case 2:
                                link_object_duration = _b.sent();
                                return [4 /*yield*/, Host.findOne({
                                        _id: link_object.hostId
                                    })
                                        .select("refresh_token")
                                        .exec()];
                            case 3:
                                refresh_token_object = _b.sent();
                                return [4 /*yield*/, Host.findOne({
                                        _id: link_object.hostId
                                    })
                                        .select("Fname")
                                        .exec()];
                            case 4:
                                host_first = _b.sent();
                                return [4 /*yield*/, Host.findOne({
                                        _id: link_object.hostId
                                    })
                                        .select("Lname")
                                        .exec()];
                            case 5:
                                host_last = _b.sent();
                                return [4 /*yield*/, invite_1["default"](refresh_token_object.refresh_token, link_object_duration.duration, email, username, comment, startTime, host_first.Fname, host_last.Lname)];
                            case 6:
                                slots = _b.sent();
                                console.log(slots);
                                tempEvent = {
                                    state: slots
                                };
                                return [4 /*yield*/, Link.findOne({ url: url }).exec()];
                            case 7:
                                tempID = _b.sent();
                                tempID.collection.update({ _id: ObjectId(tempID._id) }, { $set: { used: true } });
                                return [4 /*yield*/, Link.findOne({ url: url }).select("used").exec()];
                            case 8:
                                temp_used = _b.sent();
                                console.log("TEMP USED" + temp_used);
                                return [2 /*return*/, tempEvent];
                        }
                    });
                });
                return [
                  4 /*yield*/,
                  Link.findOne({ url: url }).select("hostId").exec(),
                ];
              case 1:
                link_object = _b.sent();
                return [
                  4 /*yield*/,
                  Link.findOne({ url: url }).select("duration").exec(),
                ];
              case 2:
                link_object_duration = _b.sent();
                return [
                  4 /*yield*/,
                  Host.findOne({
                    _id: link_object.hostId,
                  })
                    .select("refresh_token")
                    .exec(),
                ];
              case 3:
                refresh_token_object = _b.sent();
                return [
                  4 /*yield*/,
                  Host.findOne({
                    _id: link_object.hostId,
                  })
                    .select("Fname")
                    .exec(),
                ];
              case 4:
                host_first = _b.sent();
                return [
                  4 /*yield*/,
                  Host.findOne({
                    _id: link_object.hostId,
                  })
                    .select("Lname")
                    .exec(),
                ];
              case 5:
                host_last = _b.sent();
                return [
                  4 /*yield*/,
                  invite_1["default"](
                    refresh_token_object.refresh_token,
                    link_object_duration.duration,
                    email,
                    username,
                    comment,
                    startTime,
                    host_first.Fname,
                    host_last.Lname
                  ),
                ];
              case 6:
                slots = _b.sent();
                console.log(slots);
                tempEvent = {
                  state: slots,
                };
                return [2 /*return*/, tempEvent];
            }
          });
        });
      },
    },
  },
});
module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
