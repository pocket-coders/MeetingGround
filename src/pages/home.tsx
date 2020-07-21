/*users.jsx*/
import React from "react";
import ScheduleEngine from "./ScheduleEngine";
import styled from "@emotion/styled";

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

const HomePage = () => {
  return (
    <body style={{ background: "rgba(131, 196, 197)" }}>
      <div style={{ padding: "1rem" }}>
        <TopFormat>
          <LogoCard
            id="logo"
            src="./img/meetingGroundLogo.png"
            alt="Meeting Ground Logo"
          />

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
            Home Page
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
          <h2
            style={{
              margin: 25,
            }}
          >
            Generate one-time signup links for your guests to schedule a meeting
          </h2>
          <HomeDiv>
            <ScheduleEngine timeLength={15} />
            <ScheduleEngine timeLength={30} />
            <ScheduleEngine timeLength={60} />
          </HomeDiv>
        </MainBodyFormat>
      </div>
    </body>
  );
};

export default HomePage;
