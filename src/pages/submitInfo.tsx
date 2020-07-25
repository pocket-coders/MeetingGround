/*users.jsx*/
import useForm from "react-hook-form";
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages

import styled from "@emotion/styled";
import logo from "./img/meetingGroundLogo.png";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
// yarn add react-hook-form
//You have to use the link component to link between you pages
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import * as config from "../apiGoogleconfig.json";
import ScheduleCard from "./ScheduleCard/component";
import { resolve } from "url";
import { rejects } from "assert";

interface SubmitPagePropsInterface
  extends RouteComponentProps<{ id: string; time: string }> {
  // Other props that belong to component it self not Router
}
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
  background: white;
  display: flex;
  flex-direction: column;
  height: 650px;
  border-radius: 25px;
`;

const Inputformat = styled.input`
  width: 100%;
  padding: 10px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const meetingInfo: {
  hostEmail: string;
  duration: number;
} = {
  hostEmail: "",
  duration: 0,
};

const urlId: {
  urlid: string;
} = {
  urlid: "",
};

const SubmitInfoPage: React.FC<SubmitPagePropsInterface> = (
  props: SubmitPagePropsInterface
) => {
  const id = props.match.params.id; //link id
  const scheduledDate = new Date(props.match.params.time.replace("%20", ""));
  urlId.urlid = id;

  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      comments: "",
    },
  });

  const cache = new InMemoryCache();
  const link = new HttpLink({
    uri: "http://localhost:4000/graphql",
  });

  const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link,
  });

  const clientEmail: {
    email: string;
  } = {
    email: "",
  };

  const requestSlot = useRequestSlot();
  // // requestSlot() is a function that you call to make the request.
  // // Initially, you can dummy it out like this:
  function useRequestSlot(): (
    time: Date,
    linkUrl: string,
    guestFirst: string,
    guestLast: string
  ) => Promise<boolean> {
    // return () => Promise.resolve();
    return (
      time: Date,
      linkUrl: string,
      guestFirst: string,
      guestLast: string
    ) =>
      new Promise<boolean>(function (resolve, reject) {
        initiate()
          .then(() => resolve(true))
          .catch(() => reject(new Error("useRequestSlot")));
      });
  }
  //when the backend is ready, you can change it to something like:
  // function useRequestSlot(): (time: number) => Promise<boolean> {
  //     const mutate = useMutation(RequestSlot);
  //     return (time:number) => mutate({variables: { time } });  // }

  // TODO insert accesstoken string here
  let accessToken: string;
  const onSubmit = (data: any) => {
    console.log(data);
    console.log(data.firstName);
    console.log(data.email);
    clientEmail.email = data.email;
    if (
      !/^[a-zA-Z0-9]+[a-zA-Z0-9_.]*@[a-zA-Z0-9]+.[A-Za-z]+$/.test(data.email)
    ) {
      window.alert("invalid email");
    } else {
      //setReadyToSend(true);
      //initiate();
      requestSlot(scheduledDate, urlId.urlid, data.firstName, data.lastName)
        .then((result) => {
          if (result) {
            console.log("scheduled time succesfully:" + result);
            props.history.push("/confirmation");
          }
          //  else {
          //   console.log("could not schedule event");
          //   props.history.push("/signup/" + urlId.urlid);
          // }
        })
        .catch((err) => {
          console.log("could not schedule event");
          props.history.push("/signup/" + urlId.urlid);
        });
    }
  };

  function ISODateString(d: Date) {
    function pad(n: number) {
      return n < 10 ? "0" + n : n;
    }
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      "T" +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds()) +
      "-" +
      pad(d.getTimezoneOffset() / 60) +
      ":00"
    );
  }

  // ________________________________________________________________________________________
  function initiate(): Promise<void> {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", () => {
        initClient()
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(new Error("initiate doesn't work"));
          });
      });
    });
  }

  function initClient(): Promise<void> {
    // const values = {
    //   'client_id': config.config.clientId,
    //   'scope': config.config.scope,
    // }
    // gapi.auth2.authorize(values, function() {
    //   console.log('login complete');
    //   console.log(gapi.auth.getToken());
    // });
    //
    let eventSuccess: any;
    //return new Promise(function (resolve, reject) {
    return new Promise((resolve, reject) => {
      gapi.client
        .init({
          apiKey: config.config.apiKey,
          clientId: config.config.clientId,
          discoveryDocs: config.config.discoveryDocs,
          scope: config.config.scope,
        })
        .then(
          () => {
            // Listen for sign-in state changes.
            // gapi.auth2.authorize;

            // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            gapi.client.setToken({
              access_token: accessToken,
            });
          },
          function (error: any) {
            console.log("An errot in update");
            //appendPre(JSON.stringify(error, null, 2));
          }
        )
        .then(() => {
          //returns a promise
          accessUserOffline()
            .then(() => {
              console.log("success in initiate");
              resolve();
            })
            .catch((err) => {
              console.log(err);
              reject(new Error("accessuseroffline doesn't work"));
            });
        });
    });

    //resolve({ eventStatus: eventSuccess });
    //});
  }
  function updateSigninStatus(isSignedIn: boolean) {
    if (isSignedIn) {
      console.log("SIGNED IN");
    } else {
      console.log("SIGNED OUT");
      // getUsersCalendarList(
      //   "ya29.a0AfH6SMDsk-PBxuG0etR5n4CdEN7K8JFCam6zIA4vEEcZ71qYENWBV8SuP1XoktDhmhTlCMhrteGWUchJExi6_oO-6c2RbWylklmwUvDZM2EwpSNl1iALYgMMxKA0u0_7KQ1AFxprea4RUiTlOseqAjIPGA6H7gd0FQM"
      // );
    }

    accessUserOffline();
  }

  // *****************************'
  async function getUsersCalendarList(accessToken: any) {
    let calendarsList = await fetch(
      "https://www.googleapis.com/auth/calendar.events",
      {
        method: "get",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((response) => response.json())
      .then((json) => console.log(json));
    // return calendarsList.json();
    // console.log(calendarsList.json());
  }

  // ________________________________________________________________________________________
  const endTimeSchedule: Date = new Date(
    scheduledDate.getTime() + 60 * 1000 * meetingInfo.duration
  );
  const start: string = scheduledDate.toString();
  const end: string = endTimeSchedule.toString();
  const timeZone: string = scheduledDate.getTimezoneOffset().toString();
  console.log(start);
  console.log(end);
  console.log(timeZone);

  function accessUserOffline() {
    const event = {
      summary: "Meeting with " + HostInfo.firstname + " " + HostInfo.lastname,
      location: "Online",
      description: "You have been invited to this Meeting",
      start: {
        // date: scheduledDate.toISOString(),
        dateTime: ISODateString(scheduledDate),
        timeZone: "Etc/UTC",
      },
      end: {
        // date: scheduledDate.toISOString(),
        dateTime: ISODateString(
          new Date(scheduledDate.getTime() + 60 * 1000 * meetingInfo.duration)
        ),
        timeZone: "Etc/UTC",
      },
      recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
      attendees: [{ email: clientEmail.email }],
      visibility: "default",
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    let eventScheduledHere = false;

    return new Promise((resolve, reject) => {
      gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: event,
          sendNotifications: true,
          sendUpdates: "all",
        })
        .execute((event) => {
          console.log("event status:" + event.status);

          if (event.status?.toLocaleString() === "confirmed") {
            resolve({ eventScheduledHere: true });
          } else {
            reject(new Error("event not submmitted"));
          }
        });
    });
  }

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
                // position: "relative",
                margin: 0,
                // float: "left",
                // left: "15%",
                justifyContent: "center",
                top: 20,
              }}
            >
              Submit Info Page
            </h1>
          </div>
        </TopFormat>
        <MainBodyFormat>
          <h3 style={{ margin: 20 }}>
            {" "}
            Your scheduled date is {scheduledDate.toString()}
          </h3>

          <h4 style={{ margin: 20 }}>
            {" "}
            Please input your information below to confirm your meeting.
          </h4>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label htmlFor="firstName">
                First Name
                <Inputformat name="firstName" id="firstName" ref={register} />
                {/* <input
                name="firstName"
                id="firstName"
                ref={register}
                style={{
                  width: "100%",
                  padding: "12px 20px",
                  margin: "8px 0",
                  display: "inline-block",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              /> */}
              </label>

              <label htmlFor="lastName">
                Last Name
                <Inputformat name="lastName" id="lastName" ref={register} />
              </label>
            </div>

            <div>
              <label htmlFor="email">Email Address</label>
              <Inputformat name="email" id="email" ref={register} />
            </div>

            <div>
              <label htmlFor="comments">Comments/Questions?</label>
              <Inputformat name="comments" id="comments" ref={register} />
            </div>

            <div
              className="form-group"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <button type="submit" className="btn btn-primary">
                Submit Info
              </button>
            </div>
          </form>
        </MainBodyFormat>
        {true && (
          <ApolloProvider client={client}>
            <GetHostEmail />
          </ApolloProvider>
        )}
        <pre id="content"></pre>
      </div>
    </body>
  );
};

const HostInfo: {
  firstname: string;
  lastname: string;
  code: string;
} = {
  code: "",
  firstname: "",
  lastname: "",
};

function GetHostEmail() {
  const [tempdata, setdata] = useState<any>();
  const {
    loading: loadingEmail,
    error: errorEmail,
    data: dataEmail,
  } = useQuery(GET_HOST_EMAIL, {
    variables: { id: urlId.urlid },
  });

  loadingEmail
    ? console.log("loading Email")
    : errorEmail
    ? console.log("An Error occurred:" + { errorEmail })
    : (meetingInfo.hostEmail = dataEmail.link.email) &&
      (meetingInfo.duration = dataEmail.link.duration);

  console.log(meetingInfo.hostEmail);

  const { loading: loadingCode, error: errorCode, data: dataCode } = useQuery(
    GET_GOA_CODE,
    {
      variables: { id: meetingInfo.hostEmail },
    }
  );

  loadingCode
    ? console.log("loading access")
    : errorCode
    ? console.log("An Error occurred:" + { errorCode })
    : (HostInfo.code = dataCode.email.goa_code) &&
      (HostInfo.firstname = dataCode.email.firstname) &&
      (HostInfo.lastname = dataCode.email.lastname);

  console.log(HostInfo.code);

  return <div>the Email is authentified</div>;
}

const GET_HOST_EMAIL = gql`
  query($id: String) {
    link(id: $id) {
      email
      duration
    }
  }
`;

const GET_GOA_CODE = gql`
  query($id: String) {
    email(id: $id) {
      goa_code
      firstname
      lastname
    }
  }
`;

export default SubmitInfoPage;
