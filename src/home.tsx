/*users.jsx*/
import React, { useState } from "react";
import * as config from "../apiGoogleconfig.json";
import ScheduleEngine from "./ScheduleEngine";
import styled from "@emotion/styled";
import { RouteComponentProps } from "react-router-dom";
import gql from "graphql-tag";
import { Link } from "react-router-dom";
import NotFoundPage from "./404";

import logo from "./img/meetingGroundLogo.png";
import { useQuery } from "react-apollo";

const HomeDiv = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  background: white;
  border-radius: 25px;
  height: 1000px;
  justify-content: space-between;
`;

const LogoCard = styled.img`
  width: 450px;
  height: 100px;
  justify-content: space-around;
  float: left;
`;

const TopFormat = styled.div`
  margin: 0 auto;
  width: 100%;
  overflow: auto;
  display: inline-block;
  background: white;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

const MainBodyFormat = styled.div`
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: white;
  display: flex;
  flex-direction: column;
  height: 1000px;
  border-radius: 25px;
`;

const emailExist = gql`
  query($email: String) {
    host_email(email: $email) {
      email
    }
  }
`;

interface HomePropsInterface extends RouteComponentProps<{ emailId: string }> {
  // Other props that belong to component it self not Router
}

const userEmail: {
  email: string;
} = {
  email: "",
};

const HomePage: React.FC<HomePropsInterface> = (props: HomePropsInterface) => {
  const emailId = props.match.params.emailId;
  userEmail.email = emailId + "@gmail.com";
  //WE ONLY SUPPORT @GMAIL.COM

  function handleSignoutClick(event: any) {
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: config.config.apiKey,
          clientId: config.config.clientId,
          discoveryDocs: config.config.discoveryDocs,
          scope: config.config.scope,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().signOut();
          props.history.push("/");
        });
    });
  }

  console.log(userEmail.email);
  // check if the email is in the data database server
  const { loading, error, data } = useQuery(emailExist, {
    variables: { email: userEmail.email },
  });

  return loading ? (
    <div>loading</div>
  ) : error ? (
    <div>
      <Link to="/404"></Link>
    </div>
  ) : (
    <div>
      {data.host_email !== null && data.host_email.email === userEmail.email && (
        <body style={{ background: "rgba(131, 196, 197)" }}>
          <div style={{ padding: "1rem" }}>
            <TopFormat>
              <div>
                <LogoCard id="logo" src={logo} alt="Meeting Ground Logo" />

                <button
                  className="btn btn-danger"
                  id="signout_button"
                  //onClick={handleSignoutClick}
                  style={{
                    height: "30%",
                    justifyContent: "center",
                    alignContent: "center",
                    float: "right",
                    margin: 30,
                  }}
                  onClick={handleSignoutClick}
                >
                  Sign Out
                </button>
              </div>

              <div
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  display: "flex",
                  flexDirection: "row",
                  borderTop: "5px solid grey",
                  margin: 5,
                }}
              >
                <h1
                  style={{
                    // position: "relative",
                    margin: 0,
                    // float: "left",
                    // left: "15%",
                    justifyContent: "center",
                    top: 20,
                  }}
                >
                  Home Page
                </h1>
              </div>
            </TopFormat>

            <MainBodyFormat>
              <h2
                style={{
                  margin: 25,
                }}
              >
                Generate one-time signup links for your guests to schedule a
                meeting
              </h2>
              <HomeDiv>
                <ScheduleEngine timeLength={15} emailID={emailId} />
                <ScheduleEngine timeLength={30} emailID={emailId} />
                <ScheduleEngine timeLength={60} emailID={emailId} />
              </HomeDiv>
            </MainBodyFormat>
          </div>
        </body>
      )}
      {data.host_email === null && <NotFoundPage />}
    </div>
  );
};

export default HomePage;
