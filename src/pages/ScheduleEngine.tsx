import React, { useState, useEffect } from "react";
import { useMutation } from "react-apollo";
import ScheduleCard from "./ScheduleCard/component";
import styled from "@emotion/styled";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
//npm install --save @emotion/core
import { useQuery } from "@apollo/react-hooks";
import { FaRegCopy } from "react-icons/fa";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";
// yarn add @material-ui/lab
// yarn add @material-ui/core

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

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const ScheduleEngine: React.FC<{ timeLength: number; emailID: string }> = ({
  timeLength,
  emailID,
}) => {
  const [hasGenerate, setHasGenerate] = useState(false);

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
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const getUrl = async () => {
    const urlIdLastPart = makeid(32);
    const tempId = "meetingground.com/signup/" + urlIdLastPart;
    setUrl(tempId);
    console.log("my url: " + url);
    return Promise.resolve(urlIdLastPart);
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
    setHasGenerate(true);
  };

  const copyLink = (e: any) => {
    const el = document.createElement("textarea");
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    if (hasGenerate) handleClick();
  };

  //
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const ScheduleEnginePack = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    margin: 25px;
    text-align: center;
    background: rgba(225, 235, 237);
    height: 300px;
    width: 250px;
    border: 2px solid black;
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
        <div style={{ flexDirection: "column" }}>
          <input id="random_url" value={url} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button
            onClick={(e) => handleGenerate(e)}
            type="button"
            className="btn btn-secondary"
            style={{ padding: 2, margin: 15, verticalAlign: "middle" }}
          >
            Generate Link
          </button>
        </div>
        <button
          onClick={(e) => copyLink(e)}
          type="button"
          className="btn btn-secondary"
          style={{ padding: 2, margin: 0, verticalAlign: "middle" }}
        >
          <FaRegCopy />
        </button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="info">
            Link Copied to Clipboard!
          </Alert>
        </Snackbar>
      </form>
    </ScheduleEnginePack>
  );
};

export default ScheduleEngine;
