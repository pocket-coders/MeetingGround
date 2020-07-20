/*App.js*/
import React, { Component, useState } from "react";
import "./App.css";
//Import all needed Component for this tutorial
//npm install react-router-dom --save
import {
  BrowserRouter as Router,
  Route,
  Switch,
  // Link,
  Redirect,
} from "react-router-dom";

//Pages
import LoginPage from "./pages/login"; ///< index.jsx will be automatically imported
//And render that route with the MainPage component for the root path /

import HomePage from "./pages/home";
import NotFoundPage from "./pages/404";
import SignUpPage from "./pages/signup";
import Server from "./server/server";
import ConnectPage from "./calendar/connect";

class App extends Component {
  render() {
    return (
      <Router>
        {/*All our Routes goes here!*/}
        <Switch>
          <Route exact path="/" component={ConnectPage} />
          <Route exact path="/login" component={ConnectPage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/404" component={NotFoundPage} />
          <Route exact path="/signup/:id" component={SignUpPage} />
          <Route exact path="/server" component={Server} />
          <Route exact path="/connect" component={ConnectPage} />
          {/*Check for link in server. if exists go to  SchedulePage -> userid*/}
          <Redirect to="/404" />
        </Switch>
      </Router>
    );
  }
}

export default App;
