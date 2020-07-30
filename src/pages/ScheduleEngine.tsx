import React, { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import ScheduleCard from "./ScheduleCard/component";
import styled from "@emotion/styled";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
//npm install --save @emotion/core
import { useQuery } from "@apollo/react-hooks";

const appendLinktoDB = gql`
  mutation addLink($url: String!, $duration: Int!, $hostId: ID!) {
    addLink(url: $url, duration: $duration, hostId: $hostId) {
      duration
    }
  }
`;

const getHostId = gql`
  query($email: String) {
    host_email(email: $email) {
      id
    }
  }
`;

const ScheduleEngine: React.FC<{ timeLength: number; emailID: string }> = ({
  timeLength,
  emailID,
}) => {
  const [duration, setDuration] = useState<number>(timeLength);
  const [mutate] = useMutation(appendLinktoDB);
  const [url, setUrl] = useState("");
  const hostID: {
    id: string;
  } = {
    id: "",
  };
  const {
    loading: loadingHostId,
    error: errorHostId,
    data: hostIdData,
  } = useQuery(getHostId, {
    variables: { email: emailID },
  });

  loadingHostId
    ? console.log("loading Email")
    : errorHostId
    ? console.log("An Error occurred:" + { errorHostId })
    : (hostID.id = hostIdData.host_email.id);

  console.log("host id here: " + hostID.id);

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
    console.log("my url: " + url);
    return Promise.resolve(tempId);
  };

  async function addLinkToDb(tempUrl: string) {
    // auth_code --> Google Offline Access code
    const arg = await mutate({
      variables: {
        url: tempUrl,
        duration: duration,
        hostId: hostID.id,
      },
    });
    console.log(arg);
  }

  const handleGenerate = (e: any) => {
    e.preventDefault();
    getUrl().then((res) => {
      console.log("updated url, adding to db");
      addLinkToDb(res)
        .then(() => {
          console.log(" linkn appended successfully");
        })
        .catch((err) => {
          console.log("an error happened on the link" + err);
        });
    });
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

  // return loadingHostId ? (
  //   <div>loading</div>
  // ) : errorHostId ? (
  //   <div>error host id"</div>
  // ) : (
  //   <ScheduleEnginePack>
  //     <ScheduleCard timeLength={timeLength} />
  //     <form
  //       style={{
  //         margin: 15,
  //         alignContent: "center",
  //         justifyContent: "center",
  //         flexDirection: "column",
  //       }}
  //     >
  //       <input id="random_url" value={url} />
  //       <div style={{ flexDirection: "column" }}>
  //         <button
  //           onClick={(e) => handleGenerate(e)}
  //           type="button"
  //           className="btn btn-secondary"
  //           style={{ padding: 2, margin: 15 }}
  //         >
  //           Generate Link
  //         </button>
  //         <button
  //           onClick={(e) => copyLink(e)}
  //           type="button"
  //           className="btn btn-secondary"
  //           style={{ padding: 2, margin: 15 }}
  //         >
  //           copy
  //         </button>
  //       </div>
  //     </form>
  //   </ScheduleEnginePack>
  // );

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
