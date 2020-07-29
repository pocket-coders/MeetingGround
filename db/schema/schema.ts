import * as graphql from "graphql";
import slotQuery from "./slotFind";
const _ = require("lodash");
const Link = require("../models/link");
const Host = require("../models/host");
const config = require("./apiGoogleconfig.json");
const axios = require("axios");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

async function getRefreshToken(code: any) {
  try {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id:
        "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com",
      client_secret: "vpM3s6IXDLcmZtNpkOFbeQMg",
      redirect_uri: "http://localhost:3000",
      grant_type: "authorization_code",
    });
    // console.log("refresh");
    // console.log(response.data.refresh_token);
    // console.log(response.status);
    // console.log(response.statusText);
    return Promise.resolve(response.data.refresh_token);
  } catch (error) {
    console.error(
      error.response.status,
      error.response.statusText,
      error.response.data
    );
  }
}

// Types
const LinkType: graphql.GraphQLObjectType<any, any> = new GraphQLObjectType({
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
    refresh_token: { type: GraphQLString },
    urls_sent: {
      type: new GraphQLList(LinkType),
      resolve(parent, args) {
        return Link.find({ hostId: parent.id });
      },
    },
  }),
});

const SlotType = new GraphQLObjectType({
  name: "Slot",
  fields: () => ({
    start_time: { type: GraphQLString },
    end_time: { type: GraphQLString },
  }),
});

// const DicItem = new GraphQLObjectType({
//   name: "DicItem",
//   fields: () => ({
//     datekey: { type: GraphQLString },
//     values: {type: new GraphQLList(SlotType)}
//   }),
// });

type SlotTypeEvent = {
  start_time: string;
  end_time: string;
};

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
    //List[[start, end], [start, end], [start, end], [start, end]]
    list_available_slots: {
      type: new GraphQLList(SlotType),
      args: { url: { type: GraphQLString } },
      async resolve(parent, args) {
        const link = Link.findOne(args); //use url link to get Link object
        const host = Host.findOne({ id: link.hostId }); //use Link object to get Host object
        const { refresh_token } = host; //use host object to get host refresh token
        const slots: typeof SlotType[] = await slotQuery(refresh_token); //use refresh token to get list of excluded events
        // const resultSlots = new GraphQLList(SlotType);
        // let results ={}
        let tempResults: SlotTypeEvent[] = [];
        slots.map((item: any) => {
          let tempObject: SlotTypeEvent = {
            start_time: item.start,
            end_time: item.end,
          };
          tempResults.push(tempObject);
        });
        return tempResults;

        //return slots; //return list of excluded events!!!
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
        auth_code: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, { Fname, Lname, email, auth_code }) {
        console.log("Variables are: ", { Fname, Lname, email, auth_code });
        const hostExists = await checkHostsExists(email);
        getRefreshToken(auth_code).then((result) => {
          if (!hostExists) {
            const host = new Host({
              Fname: Fname,
              Lname: Lname,
              email: email,
              refresh_token: result,
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
