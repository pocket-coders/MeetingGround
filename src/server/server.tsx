// yarn add @types/express --save
// npm install nodemon -g
// yarn add @types/graphql express-graphql
// npm install apollo-server-express --save     -> not needed anymore
// npm install react-apollo
// run with nodemon server
//import express from "express";

import React, { Component } from "react";
import { render } from "react-dom";

import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
// yarn add react-apollo
// yarn add apollo-client
// yarn add @apollo/client graphql
// yarn add apollo-cache-inmemory
// yarn add apollo-boost

// const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
// const { graphqlHTTP } = require("express-graphql");
// const express = require("express");
// const _ = require("lodash");

// const server = express();

// const hosts = [
//   {
//     email: "123@123.com",
//     firstname: "qwerty",
//     lastname: "asdfg",
//   },
//   {
//     email: "456@456.com",
//     firstname: "azerty",
//     lastname: "zxcvbn",
//   },
//   {
//     email: "789@789.com",
//     firstname: "compu",
//     lastname: "scien",
//   },
// ];

// const links = [
//   { link: "asdfghjk", email: "123@123.com", duration: 15 },
//   { link: "doifjsad", email: "123@123.com", duration: 30 },
//   { link: "jsdfoiewf", email: "123@123.com", duration: 60 },
//   { link: "werdfg", email: "456@456.com", duration: 15 },
//   { link: "asd", email: "456@456.com", duration: 30 },
//   { link: "234sdf", email: "456@456.com", duration: 60 },
//   { link: "jsdfo1234iewf", email: "789@789.com", duration: 15 },
//   { link: "jsdfo12345iewf", email: "789@789.com", duration: 30 },
//   { link: "hggffj", email: "789@789.com", duration: 60 },
// ];

// const {
//   GraphQLObjectType,
//   GraphQLString,
//   GraphQLList,
//   GraphQLNonNull,
//   GraphQLSchema,
//   GraphQLInt,
// } = require("graphql");

// const HostType = new GraphQLObjectType({
//   name: "Host",
//   fields: () => ({
//     email: {
//       type: GraphQLNonNull(GraphQLString),
//     },
//     firstname: {
//       type: GraphQLNonNull(GraphQLString),
//     },
//     lastname: {
//       type: GraphQLNonNull(GraphQLString),
//     },
//     links: {
//       type: new GraphQLList(LinkType),
//       description: "List of all Links",
//       resolve: (host: any) => {
//         return links.filter((link) => link.email === host.email);
//       },
//     },
//   }),
// });

// const LinkType = new GraphQLObjectType({
//   name: "Link",
//   description: "this is a single link for a host",
//   fields: () => ({
//     email: {
//       type: GraphQLNonNull(GraphQLString),
//     },
//     duration: {
//       type: GraphQLNonNull(GraphQLInt),
//     },
//     link: {
//       type: GraphQLNonNull(GraphQLString),
//     },
//   }),
// });

// const RootQuery = new GraphQLObjectType({
//   name: "RootQueryType",
//   fields: {
//     host: {
//       type: new GraphQLList(HostType),
//       resolve: () => hosts,
//       //   args: {
//       //     email: {
//       //       type: GraphQLNonNull(GraphQLString),
//       //     },
//       //   },
//       //   resolve(parent, agrs) {
//       //     // code to get the result from the db
//       //     //hosts.find((host) => host.email === this.args.email);
//       //   },
//     },
//   },
// });

// const schema = new GraphQLSchema({
//   query: RootQuery,
// });

// server.use(
//   "/graphql",
//   graphqlHTTP({
//     graphiql: true,
//     schema: schema,
//   })
// );

// // server.use(
// //   "/graphiql",
// //   graphiqlExpress({
// //     endpointURL: "/graphql",
// //   })
// // );

// // server.use("/graphql", graphqlExpress({}));

// server.listen(4000, () => {
//   console.log("now listening for request on port 4000");
// });

// ______________________

const cache = new InMemoryCache();

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
  //   fetchOptions: {
  //     mode: "no-cors",
  //   },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

// Mistake #1: I should not have to know another language to write a query
const GET_ALL_HOSTS = gql`
  query {
    host {
      email
      firstname
      lastname
    }
  }
`;

// Mistake #2: I should not have to repeat the description of a type
type Host = {
  // Mistake #3: The type is wrong here, and that should be caught at compile-time
  email: string;
  firstname: string;
  lastname: string;
};

function List() {
  const { loading, error, data } = useQuery(GET_ALL_HOSTS);
  console.log("hehehe");
  return loading ? (
    <div>loading</div>
  ) : error ? (
    <div>An Error occured</div>
  ) : (
    <ul>
      {data.host.map((host: Host) => (
        <li>
          {host.email} used by {host.firstname} {host.lastname}
        </li>
      ))}
    </ul>
  );
}

function Server() {
  return (
    <ApolloProvider client={client}>
      <List />
    </ApolloProvider>
  );
}

export default Server;
