/*users.jsx*/
import React, { Component } from "react";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query, graphql } from "react-apollo";
import { useQuery } from "@apollo/react-hooks";

const SignUpPage = () => {
  //const id = this.props.match.params.id  ;//this.props.match.params.id;
  const id = 1;
  type Host = {
    // Mistake #3: The type is wrong here, and that should be caught at compile-time
    email: string;
    firstname: string;
    lastname: string;
  };

  const { loading, error, data } = useQuery(GET_ALL_HOSTS);
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
  // (
  // <Query query={query} variables={{id}} >
  // {
  //     (({loading, err, data}) => {
  //         if(loading) return <div>loading</div>
  //         return (
  //             <div>{data.movieInfo.title}</div>
  //         )
  //     })
  // }
  // </Query>
  // )
  // return (
  //   <div>
  //     <h3> 404 Not Found!</h3>
  //     <Link to="/">Main Page</Link>
  //   </div>
  // );
};

const GET_ALL_HOSTS = gql`
  query {
    host {
      email
      firstname
      lastname
    }
  }
`;

export default SignUpPage;
