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
import ConnectPage from "./calendar/connect";
import SubmitInfoPage from "./pages/submitInfo";
import ConfirmationPage from "./pages/confirmation";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "react-apollo";

// const link = new HttpLink({
//   uri: "http://localhost:4000/graphql",
// });
const link = new HttpLink({
  uri: "https://gentle-forest-39512.herokuapp.com/graphql",
});
const cache = new InMemoryCache();

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link,
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route exact path="/" component={ConnectPage} />
            <Route exact path="/login" component={ConnectPage} />
            <Route exact path="/home/:emailId" component={HomePage} />
            <Route exact path="/404" component={NotFoundPage} />
            <Route exact path="/signup/:id" component={SignUpPage} />
            <Route exact path="/connect" component={ConnectPage} />
            <Route
              exact
              path="/submit-info/:id/:time"
              component={SubmitInfoPage}
            />
            <Route exact path="/confirmation" component={ConfirmationPage} />
            <Redirect to="/404" />
          </Switch>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
