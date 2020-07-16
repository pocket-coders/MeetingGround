import React from "react";
import styled from "@emotion/styled";
import TimeLength from "./timeLength";

const ScheduleCard: React.FC<{ timeLength: number }> = ({ timeLength }) => {
  let bg = `linear-gradient(
      to top,
      rgb(206, 220, 237)
    );`;

  const Card = styled.div`
    margin: 0 auto;
    background: ${bg};
    width: 200px;
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 15px;
  `;
  return (
    <Card>
      <TimeLength timeLength={timeLength} />
    </Card>
  );
};

export default ScheduleCard;
