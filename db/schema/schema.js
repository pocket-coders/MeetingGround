"use strict";
exports.__esModule = true;
//const graphql = require("graphql");
var graphql = require("graphql");
var _ = require("lodash");
var Link = require("../models/link");
var Host = require("../models/host");
var GraphQLObjectType = graphql.GraphQLObjectType, GraphQLString = graphql.GraphQLString, GraphQLSchema = graphql.GraphQLSchema, GraphQLID = graphql.GraphQLID, GraphQLInt = graphql.GraphQLInt, GraphQLList = graphql.GraphQLList, GraphQLNonNull = graphql.GraphQLNonNull;
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
        urls_sent: {
            type: new GraphQLList(LinkType),
            resolve: function (parent, args) {
                //return _.filter(books, { authorId: parent.id });
                return Link.find({ hostId: parent.id });
            }
        }
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
                // code to get data from db / other source
                return Link.findById(args.id);
            }
        },
        host: {
            type: HostType,
            args: { id: { type: GraphQLID } },
            resolve: function (parent, args) {
                return Host.findById(args.id);
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
// Mutations
var Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addHost: {
            type: HostType,
            args: {
                Fname: { type: new GraphQLNonNull(GraphQLString) },
                Lname: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: function (parent, args) {
                var host = new Host({
                    Fname: args.Fname,
                    Lname: args.Lname,
                    email: args.email
                });
                return host.save(); //save to the database and return results
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
