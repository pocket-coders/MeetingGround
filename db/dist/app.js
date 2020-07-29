"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var mongoose = __importStar(require("mongoose"));
var schema = __importStar(require("./schema/schema"));
var graphqlHTTP = require("express-graphql").graphqlHTTP;
var app = express();
var cors = require("cors");
//REMEMBER TO HIDE PASSWORD FROM THIS LINE!!
var mongo_URI = "mongodb+srv://admin:Codelabs2020@meetinggrounddb.7jfca.mongodb.net/MeetingGroundDB?retryWrites=true&w=majority";
mongoose
    .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(function () { return console.log("👍🏻 Connected to MongoDB Atlas"); })
    .catch(function (err) { return console.log("Error: ", err.message); });
//if port remains taken after server is terminated, use "killall node"
app.use(cors());
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4001, function () {
    console.log("🧩 Listening for requests on port 4001");
});
// app.listen(4000, () => {
//   console.log("🧩 Listening for requests on port 4000");
// });
//# sourceMappingURL=app.js.map