import React from "react";
import "../App.css";

import { useGoogleLogin } from "react-use-googlelogin";

import "../index.css";

const LoginPage = () => {
  const { signIn, signOut, googleUser, isSignedIn } = useGoogleLogin({
    clientId:
      "272589905349-scqfilok0ucok40j6h6eo9pcsp7bhadd.apps.googleusercontent.com",
  });
  const getUsersCalendarList = async (accessToken: any) => {
    let calendarsList = await fetch(
      "https://www.googleapis.com/calendar/v3/users/me/calendarList",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return calendarsList.json();
  };

  console.log(googleUser);
  console.log(getUsersCalendarList(googleUser?.accessToken));
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
      <button onClick={signIn} style={{ marginRight: "1rem" }}>
        Sign in
      </button>
      <button onClick={signOut}>Sign Out</button>

      {isSignedIn && (
        <div>
          <h1>{googleUser?.profileObj?.name}</h1>
          <img src={googleUser?.profileObj?.imageUrl} alt="Avatar." />
          <h3> {googleUser?.accessToken}</h3>
          <p>
            <a id="continue" href="http://localhost:3000/home">
              continue to Meeting Ground
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
