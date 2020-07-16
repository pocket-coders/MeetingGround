//import React from "react";
import * as React from "react";
import styled from "@emotion/styled";

// yarn add redux react-redux @types/react-redux

const TimeLength: React.FC<{ timeLength: number }> = ({ timeLength }) => {
  console.log({ timeLength });

  const TimeSlot = styled.h1`
    font-family: "Fira Sans", sans-serif;
    font-size: 2 rem;
    font-weight: 200;
    margin: 0 auto;
  `;

  return (
    <>
      <TimeSlot>{timeLength} min meeting</TimeSlot>
    </>
  );
};

export default TimeLength;
