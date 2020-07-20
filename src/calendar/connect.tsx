import React, { useState, useEffect } from "react";
import * as config from "../apiGoogleconfig.json";
import moment from "moment";
import MyCalendar from "../pages/Moment";
import styled from "@emotion/styled";
import "react-big-calendar/lib/css/react-big-calendar.css";
// const getter = require("express");

//yarn add @types/gapi
//yarn add @types/gapi.auth2
//yarn add @types/gapi.client.calendar

const ConnectPage = () => {
  const [isSigned, setIsSigned] = useState(false);
  const [name, setName] = useState("");
  const [picUrl, setPicUrl] = useState("");
  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [message, setMessage] = useState("");
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [authorizeButton, setAuthorizeButton] = useState("");
  const [signoutButton, setSignoutButton] = useState("");

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  useEffect(() => {
    gapi.load("client:auth2", initClient);
  }, []);

  // --> [] call the function only one time at the beginning
  // function handleClientLoad() {
  //   gapi.load("client:auth2", initClient);
  // }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client
      .init({
        apiKey: config.config.apiKey,
        clientId: config.config.clientId,
        discoveryDocs: config.config.discoveryDocs,
        scope: config.config.scope,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          //authorizeButton.onclick = handleAuthClick;
          //signoutButton.onclick = handleSignoutClick;
        },
        function (error: any) {
          // setMessage(JSON.stringify(error, null, 2));
          // const temp: string = JSON.stringify(error, null, 2);
          // message += temp;
          appendPre(JSON.stringify(error, null, 2));
        }
      );
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event: any) {
    // Granting access when the user is offline
    gapi.auth2
      .getAuthInstance()
      .grantOfflineAccess()
      .then(function (response: any) {
        gapi.auth2.getAuthInstance().signIn();
        if (response["code"]) {
          // Hide the sign-in button now that the user is authorized, for example:
          setAuthorizeButton("none");
          //$("#signinButton").attr("style", "display: none");
          console.log(response);

          // Send the code to the server
          // getter.ajax({
          //   type: "POST",
          //   url: "http://example.com/storeauthcode",
          //   // Always include an `X-Requested-With` header in every AJAX request,
          //   // to protect against CSRF attacks.
          //   headers: {
          //     "X-Requested-With": "XMLHttpRequest",
          //   },
          //   contentType: "application/octet-stream; charset=utf-8",
          //   success: function (result: any) {
          //     // Handle or verify the server response.
          //   },
          //   processData: false,
          //   data: response["code"],
          // });
        } else {
          // THERE WAS AN ERROR
          console.log("THERE WAS AN ERROR");
        }
      });
    //gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event: any) {
    gapi.auth2.getAuthInstance().signOut();
  }

  //calendar.settings.readonly scope allowed
  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn: boolean) {
    if (isSignedIn) {
      setAuthorizeButton("none");
      setSignoutButton("block");
      setIsSigned(true);
      setName(
        gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getName()
      );
      setFname(
        gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getGivenName()
      );
      setLname(
        gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getFamilyName()
      );
      setEmail(
        gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getEmail()
      );
      setPicUrl(
        gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile()
          .getImageUrl()
      );
      console.log(email);
      console.log(fname);
      console.log(lname);
      listUpcomingEvents();
      console.log("SIGNED IN");
    } else {
      console.log("SIGNED OUT");
      setIsSigned(false);
      setName("");
      setPicUrl("");
      setFname("");
      setLname("");
      setEmail("");
      setAuthorizeButton("block");
      setSignoutButton("none");
    }
  }

  // /**
  //  * Append a pre element to the body containing the given message
  //  * as its text node. Used to display the results of the API call.
  //  *
  //  * @param {string} message Text to be placed in pre element.
  //  */
  function appendPre(message: string) {
    const pre = document.getElementById("content") as HTMLElement;
    const textContent = document.createTextNode(message + "\n");
    pre.appendChild(textContent);
  }

  const CalendarCard = styled.div`
    margin: 0 auto;
    width: 1000px;
    height: 1000px;
    align-items: center;
    border-radius: 15px;
  `;

  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then(function (response: any) {
        const events: any[] = response.result.items;
        const appointments = response.result.items;
        for (let j = 0; j < appointments.length; j++) {
          appointments[j].start = moment
            .utc(appointments[j].start.dateTime)
            .toDate();
          appointments[j].end = moment
            .utc(appointments[j].end.dateTime)
            .toDate();
        }
        setMyEvents(appointments);

        //setMyEvents(events);
        // debugger;
        const tmp: string = message;
        setMessage(tmp + "Upcoming events:" + "\n");
        // message += "Upcoming events:" + "\n";
        appendPre("Upcoming events:");
        console.log(events.length);
        if (events.length > 0) {
          let i: number;
          for (i = 0; i < events.length; i++) {
            let event = events[i];
            let when = event.start.dateTime;
            if (!when) {
              when = event.start.date;
            }
            const temp: string =
              message + event.summary + " (" + when + ")" + "\n";
            setMessage(temp);
            // message += temp;
            appendPre(event.summary + " (" + when + ")");
          }
        } else {
          setMessage("No upcoming events found." + "\n");
          // message += "No upcoming events found." + "\n";
          appendPre("No upcoming events found.");
        }
      });
  }

  // handleClientLoad();

  return (
    <div style={{ padding: "1rem" }}>
      <div>
        <img id="logo" src="./logo.png" alt="Meeting Ground Logo" />
        <h1>Welcome to Meeting Ground</h1>
        <h2>Where Meetings hit the Ground</h2>
        <small>Main Page</small>
      </div>
      <div>
        <button
          id="authorize_button"
          onClick={handleAuthClick}
          style={{ display: authorizeButton }}
        >
          Sign in
        </button>
        <button
          id="signout_button"
          onClick={handleSignoutClick}
          style={{ display: signoutButton }}
        >
          Sign Out
        </button>
      </div>

      {isSigned && (
        <div>
          <div>
            <h1>Welcome {name}</h1>
            <img src={picUrl} alt="Avatar." />
            <p>
              <a id="continue" href="http://localhost:3000/home">
                continue to Meeting Ground
              </a>
            </p>
          </div>
          <pre id="content"></pre>
          <CalendarCard>
            <MyCalendar myList={myEvents} />
          </CalendarCard>
        </div>
      )}
    </div>
  );
};
export default ConnectPage;
