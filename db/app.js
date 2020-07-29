"use strict";
exports.__esModule = true;
var express = require("express");
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
app.listen(4001, function () {
    console.log("🧩 Listening for requests on port 4001");
});
// app.listen(4000, () => {
//   console.log("🧩 Listening for requests on port 4000");
// });
