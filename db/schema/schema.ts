import * as graphql from "graphql";
const _ = require("lodash");
const Link = require("../models/link");
const Host = require("../models/host");

const {
  GraphQLObjectType,
  GraphQLString,
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
    GOA_code: { type: GraphQLString },
    urls_sent: {
      type: new GraphQLList(LinkType),
      resolve(parent, args) {
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
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Link.findById(args.id);
      },
    },
    link_url: {
      type: LinkType,
      args: { url: { type: GraphQLString } },
      resolve(parent, args) {
        return Link.findOne(args);
      },
    },
    host: {
      type: HostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Host.findById(args.id);
      },
    },
    host_email: {
      type: HostType,
      args: { email: { type: GraphQLString } },
      resolve(parent, args) {
        return Host.findOne(args);
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

async function checkHostsExists(email: string): Promise<boolean> {
  const h: Promise<typeof Host> = Host.findOne({ email });
  const hv = !!(await h);
  return hv;
}

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
        GOA_code: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { Fname, Lname, email, GOA_code }) {
        console.log("Variables are: ", { Fname, Lname, email, GOA_code });
        const hostExists = await checkHostsExists(email);
        if (!hostExists) {
          const host = new Host({
            Fname: Fname,
            Lname: Lname,
            email: email,
            GOA_code: GOA_code,
          });
          return host.save(); //save to the database and return results
        }
        return null;
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
