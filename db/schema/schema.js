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
var graphql = require("graphql");
var graphql_type_datetime_1 = require("graphql-type-datetime");
var slotFind_1 = require("./slotFind");
var _ = require("lodash");
var Link = require("../models/link");
var Host = require("../models/host");
var GraphQLObjectType = graphql.GraphQLObjectType, GraphQLString = graphql.GraphQLString, GraphQLID = graphql.GraphQLID, GraphQLInt = graphql.GraphQLInt, GraphQLList = graphql.GraphQLList, GraphQLNonNull = graphql.GraphQLNonNull;
// Types
var LinkType = new GraphQLObjectType({
    name: "Link",
    fields: function () { return ({
        id: { type: GraphQLID },
        url: { type: GraphQLString },
        duration: { type: GraphQLInt },
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
    fields: function () { return ({
        id: { type: GraphQLID },
        Fname: { type: GraphQLString },
        Lname: { type: GraphQLString },
        email: { type: GraphQLString },
        GOA_code: { type: GraphQLString },
        urls_sent: {
            type: new GraphQLList(LinkType),
            resolve: function (parent, args) {
                return Link.find({ hostId: parent.id });
            }
        }
    }); }
});
var SlotType = new GraphQLObjectType({
    name: "Slot",
    fields: function () { return ({
        start_time: { type: graphql_type_datetime_1["default"] },
        end_time: { type: graphql_type_datetime_1["default"] }
    }); }
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
            }
        },
        link_url: {
            type: LinkType,
            args: { url: { type: GraphQLString } },
            resolve: function (parent, args) {
                return Link.findOne(args);
            }
        },
        list_available_slots: {
            type: SlotType,
            args: { url: { type: GraphQLString } },
            resolve: function (parent, args) {
                return __awaiter(this, void 0, void 0, function () {
                    var link, host, GOA_code, slots;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                link = Link.findOne(args);
                                host = Host.findOne({ id: link.hostId });
                                GOA_code = host.GOA_code;
                                return [4 /*yield*/, slotFind_1["default"](GOA_code)];
                            case 1:
                                slots = _a.sent();
                                return [2 /*return*/, slots];
                        }
                    });
                });
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
                    hv = !!(_a.sent());
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
                GOA_code: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: function (parent, _a) {
                var Fname = _a.Fname, Lname = _a.Lname, email = _a.email, GOA_code = _a.GOA_code;
                return __awaiter(this, void 0, void 0, function () {
                    var hostExists, host;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                console.log("1Variables are: ", { Fname: Fname, Lname: Lname, email: email, GOA_code: GOA_code });
                                return [4 /*yield*/, checkHostsExists(email)];
                            case 1:
                                hostExists = _b.sent();
                                if (!hostExists) {
                                    host = new Host({
                                        Fname: Fname,
                                        Lname: Lname,
                                        email: email,
                                        GOA_code: GOA_code
                                    });
                                    return [2 /*return*/, host.save()]; //save to the database and return results
                                }
                                return [2 /*return*/, null];
                        }
                    });
                });
            }
        },
        addLink: {
            type: LinkType,
            args: {
                url: { type: new GraphQLNonNull(GraphQLString) },
                duration: { type: new GraphQLNonNull(GraphQLInt) },
                hostId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: function (parent, args) {
                var link = new Link({
                    url: args.url,
                    duration: args.duration,
                    hostId: args.hostId
                });
                return link.save(); //save to the database and return results
            }
        }
    }
});
module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
