/*users.jsx*/
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// yarn add react-hook-form
import { RouteComponentProps } from "react-router-dom";
//You have to use the link component to link between you pages
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ApolloClient } from "apollo-client";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloProvider } from "react-apollo";
import * as config from "../apiGoogleconfig.json";
import { Console } from "console";
import ScheduleCard from "./ScheduleCard/component";

interface SubmitPagePropsInterface
  extends RouteComponentProps<{ id: string; time: string }> {
  // Other props that belong to component it self not Router
}

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
      initiate();
      props.history.push("/confirmation");
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
  function initiate() {
    gapi.load("client:auth2", initClient);
  }

  function initClient() {
    // const values = {
    //   'client_id': config.config.clientId,
    //   'scope': config.config.scope,
    // }
    // gapi.auth2.authorize(values, function() {
    //   console.log('login complete');
    //   console.log(gapi.auth.getToken());
    // });

    gapi.client
      .init({
        apiKey: config.config.clientId,
        clientId: config.config.clientId,
        discoveryDocs: config.config.discoveryDocs,
        scope: config.config.scope,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          // gapi.auth2.authorize;
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error: any) {
          console.log("An errot in update");
          //appendPre(JSON.stringify(error, null, 2));
        }
      );
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

    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: event,
        sendNotifications: true,
        sendUpdates: "all",
      })
      .execute(function (event) {
        console.log("Event created: " + event.status);
      });
  }

  return (
    <div>
      <h1> Your scheduled date is {scheduledDate.toString()}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          First Name
          <input name="firstName" ref={register} />
        </label>

        <label>
          Last Name
          <input name="lastName" ref={register} />
        </label>

        <label>
          Email
          <input name="email" ref={register} />
        </label>

        <label>
          Comments/Questions?
          <input name="comments" ref={register} />
        </label>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            Submit Info
          </button>
        </div>
      </form>
      {true && (
        <ApolloProvider client={client}>
          <GetHostEmail />
        </ApolloProvider>
      )}
      <pre id="content"></pre>
    </div>
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
