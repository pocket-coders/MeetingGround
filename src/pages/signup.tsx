/*users.jsx*/
import React, { Component, useState } from "react";
//You have to use the link component to link between you pages
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
import { Query, graphql } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import MyCalendar from "./Moment";
import styled from "@emotion/styled";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface SignUpPagePropsInterface extends RouteComponentProps<{ id: string }> {
  // Other props that belong to component it self not Router
}

const cache = new InMemoryCache();

const link = new HttpLink({
  uri: "http://localhost:4000/graphql",
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

//const id = this.props.match.params.id  ;//this.props.match.params.id;
type Host = {
  // Mistake #3: The type is wrong here, and that should be caught at compile-time
  email: string;
  firstname: string;
  lastname: string;
};

type Link = {
  link: string;
  duration: number;
  email: string;
};

const urlId: {
  urlid: string;
} = {
  urlid: "",
};

const CalendarCard = styled.div`
  margin: 0 auto;
  width: 1000px;
  height: 1000px;
  align-items: center;
  border-radius: 15px;
`;

const SignUpPage: React.FC<SignUpPagePropsInterface> = (
  props: SignUpPagePropsInterface
) => {
  const id = props.match.params.id;
  urlId.urlid = id;

  return (
    <ApolloProvider client={client}>
      <SignUpServer />
      <CalendarCard>
        <MyCalendar />
      </CalendarCard>
    </ApolloProvider>
  );
};

function SignUpServer() {
  const { loading, error, data } = useQuery(GET_UNIQUE_LINK, {
    variables: { id: urlId.urlid },
  });
  return loading ? (
    <div>loading</div>
  ) : error ? (
    <div>An Error occurred: {error}</div>
  ) : (
    <ul>
      <li>
        {data.link.link} used by {data.link.email} for {data.link.duration}
      </li>
    </ul>
  );
}

const GET_UNIQUE_LINK = gql`
  query($id: String) {
    link(id: $id) {
      email
      duration
      link
    }
  }
`;

export default SignUpPage;
