"use strict";
exports.__esModule = true;
var express = require("express");
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
});
