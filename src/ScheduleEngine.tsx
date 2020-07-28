import React, { useState, useEffect } from "react";
import ScheduleCard from "./ScheduleCard/component";
import styled from "@emotion/styled";
//npm install --save @emotion/core

const ScheduleEngine: React.FC<{ timeLength: number; emailID: string }> = ({
  timeLength,
  emailID,
}) => {
  //variable schedule is an object that consists of timelength and url.
  //url left blank when not generated
  // const scheduling: {
  //   time: typeof timeLength;
  //   url: string;
  // } = {
  //   time: timeLength,
  //   url: "",
  // };
  const [url, setUrl] = useState("");

  function makeid(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#@$&*";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const getUrl = async () => {
    const tempId = "meetingground.com/signup/" + emailID + "/" + makeid(16);
    setUrl(tempId);
  };

  const handleGenerate = (e: any) => {
    e.preventDefault();
    getUrl();
  };

  const copyLink = (e: any) => {
    //execCommand("copy")
  };

  const ScheduleEnginePack = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    margin: 25px;
    text-align: center;
    background: rgba(225, 235, 237);
    height: 300px;
    width: 200px;
  `;

  return (
    <ScheduleEnginePack>
      <ScheduleCard timeLength={timeLength} />
      <form
        style={{
          margin: 15,
          alignContent: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <input id="random_url" value={url} />
        <div style={{ flexDirection: "column" }}>
          <button
            onClick={(e) => handleGenerate(e)}
            type="button"
            className="btn btn-secondary"
            style={{ padding: 2, margin: 15 }}
          >
            Generate Link
          </button>
          <button
            onClick={(e) => copyLink(e)}
            type="button"
            className="btn btn-secondary"
            style={{ padding: 2, margin: 15 }}
          >
            copy
          </button>
        </div>
      </form>
    </ScheduleEnginePack>
  );
};

export default ScheduleEngine;
