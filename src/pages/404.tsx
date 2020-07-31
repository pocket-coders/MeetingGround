/*users.jsx*/
import React from "react";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";
import logo from "./img/meetingGroundLogo.png";
import styled from "@emotion/styled";
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
const LogoCard = styled.img`
  width: 450px;
  height: 100px;
  justify-content: space-around;
  float: left;
`;

const MainBodyFormat = styled.div`
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const NotFoundPage = () => {
  return (
    <body style={{ background: "rgba(131, 196, 197)" }}>
      <div style={{ padding: "1rem" }}>
        <TopFormat>
          <LogoCard id="logo" src={logo} alt="Meeting Ground Logo" />
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
                margin: 0,
                justifyContent: "center",
                top: 20,
              }}
            >
              Signup Page
            </h1>
          </div>
        </TopFormat>

        <MainBodyFormat>
          <h1 style={{ top: 10, margin: 20 }}>404 </h1>
          <h1 style={{ top: 10, margin: 20 }}> ERROR page not found😰</h1>
        </MainBodyFormat>
      </div>
    </body>
  );
};

export default NotFoundPage;
