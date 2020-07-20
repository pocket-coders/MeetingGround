//const graphql = require("graphql");
import * as graphql from "graphql";
const _ = require("lodash");
const Link = require("../models/link");
const Host = require("../models/host");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Types
const LinkType = new GraphQLObjectType({
  name: "Link",
  fields: () => ({
    id: { type: GraphQLID },
    url: { type: GraphQLString },
    duration: { type: GraphQLInt },
    host: {
      type: HostType,
      resolve(parent, args) {
        return Host.findById(parent.hostId);
      },
    },
  }),
});

const HostType = new GraphQLObjectType({
  name: "Host",
  fields: () => ({
    id: { type: GraphQLID },
    Fname: { type: GraphQLString },
    Lname: { type: GraphQLString },
    email: { type: GraphQLString },
    urls_sent: {
      type: new GraphQLList(LinkType),
      resolve(parent, args) {
        //return _.filter(books, { authorId: parent.id });
        return Link.find({ hostId: parent.id });
      },
    },
  }),
});

// Queries
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    link: {
      type: LinkType,
      args: { id: { type: GraphQLID } }, //URL(id: 2)   (specify id of URL)
      resolve(parent, args) {
        // code to get data from db / other source
        return Link.findById(args.id);
      },
    },
    host: {
      type: HostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Host.findById(args.id);
      },
    },
    links: {
      type: new GraphQLList(LinkType),
      resolve(parent, args) {
        //return all links;
        return Link.find({});
      },
    },
    hosts: {
      type: new GraphQLList(HostType),
      resolve(parent, args) {
        //return all hosts;
        return Host.find({});
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addHost: {
      type: HostType,
      args: {
        Fname: { type: new GraphQLNonNull(GraphQLString) },
        Lname: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let host = new Host({
          Fname: args.Fname,
          Lname: args.Lname,
          email: args.email,
        });
        return host.save(); //save to the database and return results
      },
    },
    addLink: {
      type: LinkType,
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
        duration: { type: new GraphQLNonNull(GraphQLInt) },
        hostId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let link = new Link({
          url: args.url,
          duration: args.duration,
          hostId: args.hostId,
        });
        return link.save(); //save to the database and return results
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery, //user can query using RootQuert
  mutation: Mutation, //user can mutate using Mutations
});
