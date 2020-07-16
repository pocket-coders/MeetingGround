/*users.jsx*/
import React from "react";
import ScheduleEngine from "./ScheduleEngine";
import styled from "@emotion/styled";

const HomeDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  margin-top: 10px;
  text-align: center;
`;
const HomePage = () => {
  return (
    <HomeDiv>
      <ScheduleEngine timeLength={15} />
      <ScheduleEngine timeLength={30} />
      <ScheduleEngine timeLength={50} />
    </HomeDiv>
  );
};

export default HomePage;
