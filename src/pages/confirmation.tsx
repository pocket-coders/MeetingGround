/*users.jsx*/
import React from "react";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";

import styled from "@emotion/styled";
import logo from "./img/meetingGroundLogo.png";

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
`;

const MainBodyFormat = styled.div`
  margin: 0 auto;
  align-items: center;
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const ConfirmationPage = () => {
  return (
    <body style={{ background: "rgba(131, 196, 197)" }}>
      <div style={{ padding: "1rem" }}>
        <TopFormat>
          <LogoCard id="logo" src={logo} alt="Meeting Ground Logo" />

          <h1
            style={{
              position: "relative",
              width: 300,
              margin: 0,
              float: "left",
              left: "15%",
              top: 20,
            }}
          >
            Info Page
          </h1>

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
          >
            Sign Out
          </button>
        </TopFormat>

        <MainBodyFormat>
          <div style={{ margin: 20, display: "flex", flexDirection: "column" }}>
            <h3> Your meeting has been confirmed!</h3>

            <Link to="/" className="btn btn-info" type="button">
              Meeting Ground Main Page
            </Link>
          </div>
        </MainBodyFormat>
      </div>
    </body>
  );
};

export default ConfirmationPage;
