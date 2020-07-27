"use strict";
exports.__esModule = true;
var express = require("express");
<<<<<<< HEAD
var graphqlHTTP = require("express-graphql").graphqlHTTP;
var mongoose = require("mongoose");
var schema = require("./schema/schema");
var app = express();

//REMEMBER TO HIDE PASSWORD FROM THIS LINE!!
var mongo_URI =
  "mongodb+srv://admin:Codelabs2020@meetinggrounddb.7jfca.mongodb.net/MeetingGroundDB?retryWrites=true&w=majority";
mongoose
  .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function () {
    return console.log("👍🏻 Connected to MongoDB Atlas");
  })
  ["catch"](function (err) {
    return console.log("Error: ", err.message);
  });
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);
app.listen(4001, function () {
  console.log("🧩 Listening for requests on port 4001");
=======
var mongoose = require("mongoose");
var schema = require("./schema/schema");
var graphqlHTTP = require("express-graphql").graphqlHTTP;
var app = express();
var cors = require("cors");
//REMEMBER TO HIDE PASSWORD FROM THIS LINE!!
var mongo_URI = "mongodb+srv://admin:Codelabs2020@meetinggrounddb.7jfca.mongodb.net/MeetingGroundDB?retryWrites=true&w=majority";
mongoose
    .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(function () { return console.log("👍🏻 Connected to MongoDB Atlas"); })["catch"](function (err) { return console.log("Error: ", err.message); });
//if port remains taken after server is terminated, use "killall node"
app.use(cors());
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}));
app.listen(4000, function () {
    console.log("🧩 Listening for requests on port 4000");
>>>>>>> 88d72da0be4a06f6e87e5d35b2fa15397156a4d2
});
