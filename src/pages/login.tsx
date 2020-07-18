import React from "react";
//import { calendar_v3, google } from "googleapis";
// yarn add googleapis
import "../App.css";

import { useGoogleLogin } from "react-use-googlelogin";

import "../index.css";
import { response } from "express";

//const calendar = google.calendar('v3');

//yarn add @types/gapi
//yarn add @types/gapi.auth2
//yarn add @types/gapi.client.calendar

let getUsersCalendarList = async (accessToken: any) => {
  let calendarsList = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/calendarId/events",
    {
      method: "get",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
    .then((response) => response.json())
    .then((json) => console.log(json));
  // return calendarsList.json();
  // console.log(calendarsList.json());
};

const LoginPage = () => {
  const { signIn, signOut, googleUser, isSignedIn } = useGoogleLogin({
    clientId:
      "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com",
  });

  return (
    <div style={{ padding: "1rem" }}>
      <div>
        <img
          id="logo"
          src="./img/meetingGroundLogo.png"
          alt="Meeting Ground Logo"
        />
        <h1>Welcome to Meeting Ground</h1>
        <h2>Where the Meeting hit the Ground</h2>
        <small>Main Page</small>
      </div>
      <button style={{ marginRight: "1rem" }}>Sign in</button>
      <button onClick={signOut}>Sign Out</button>

      {isSignedIn && (
        <div>
          <h1>{googleUser?.profileObj?.name}</h1>
          <img src={googleUser?.profileObj?.imageUrl} alt="Avatar." />
          <p>
            <a id="continue" href="http://localhost:3000/home">
              continue to Meeting Ground
            </a>
          </p>
          <pre id="content">Welp</pre>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
