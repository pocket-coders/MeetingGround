import * as graphql from "graphql";
import slotQuery from "./slotFind";
import invite from "./invite";
const _ = require("lodash");
const Link = require("../models/link");
const Host = require("../models/host");
const config = require("./apiGoogleconfig.json");
const axios = require("axios");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectID;

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
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
    used: {
      type: GraphQLBoolean,
    },
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

const EventCreateType = new GraphQLObjectType({
  name: "state",
  fields: () => ({
    state: {
      type: GraphQLBoolean,
    },
  }),
});

type eventCreateAction = {
  state: boolean;
};

const SlotType = new GraphQLObjectType({
  name: "Slot",
  fields: () => ({
    start: { type: GraphQLString },
    end: { type: GraphQLString },
  }),
});

type SlotTypeEvent = {
  start: string;
  end: string;
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
        const link_object = await Link.findOne(args).select("hostId").exec();
        const host = Host.findOne({ _id: link_object.hostId }); //.where('refresh_token'); //use Link object to get Host object
        //const refresh_token = Host.find({host.refresh_token}); //use host object to get host refresh token

        const refresh_token_object = await Host.findOne({
          _id: link_object.hostId,
        })
          .select("refresh_token")
          .exec();

        //console.log(refresh_token_object.refresh_token);

        const slots = await slotQuery(refresh_token_object.refresh_token); //use refresh token to get list of excluded events

        let tempResults: SlotTypeEvent[] = [];
        slots.map((item: any) => {
          let tempObject: SlotTypeEvent = {
            start: item.start,
            end: item.end,
          };
          tempResults.push(tempObject);
        });
        return tempResults;
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

async function checkLinkExists(url: string): Promise<boolean> {
  const h: Promise<typeof Host> = Link.findOne({ url });
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
      async resolve(parent, { url, duration, hostId }) {
        console.log("Variables are: ", { url, duration, hostId });
        const linkExists = await checkLinkExists(url);
        if (!linkExists) {
          const link = new Link({
            url: url,
            duration: duration,
            hostId: hostId,
            used: false,
          });
          console.log("link added to data base");
          return link.save(); //save to the database and return results
        }
        return null;
      },
    },
    create_event: {
      type: EventCreateType,
      args: {
        url: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        startTime: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(
        parent,
        // args
        { url, duration, email, username, comment, startTime }
      ) {
        console.log("the variable are: ", {
          url,
          email,
          username,
          comment,
          startTime,
        });
        // const link = Link.findById(url); //use url link to get Link object
        const link_object = await Link.findOne({ url }).select("hostId").exec();
        // const host = Host.findOne({ _id: link_object.hostId }); //.where('refresh_token'); //use Link object to get Host object
        const link_object_duration = await Link.findOne({ url })
          .select("duration")
          .exec();

        const refresh_token_object = await Host.findOne({
          _id: link_object.hostId,
        })
          .select("refresh_token")
          .exec();
        const host_first = await Host.findOne({
          _id: link_object.hostId,
        })
          .select("Fname")
          .exec();
        const host_last = await Host.findOne({
          _id: link_object.hostId,
        })
          .select("Lname")
          .exec();
        const slots = await invite(
          refresh_token_object.refresh_token,
          link_object_duration.duration,
          email,
          username,
          comment,
          startTime,
          host_first.Fname,
          host_last.Lname
        ); //use refresh token to get list of excluded events
        console.log(slots);
        let tempEvent: eventCreateAction = {
          state: slots,
        };
        //const link_object_used = await Link.findOne({ url })
        // db.users.update({_id:"2xnoy3jqcHCaFp7Br"}, {$set: { "profile.role":"admin"}})
        const tempID = await Link.findOne({ url }).exec();
        tempID.collection.update(
          { _id: ObjectId(tempID._id) },
          { $set: { used: true } }
        );
        const temp_used = await Link.findOne({ url }).select("used").exec();
        console.log("TEMP USED" + temp_used);

        return tempEvent;
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery, //user can query using RootQuert
  mutation: Mutation, //user can mutate using Mutations
});
