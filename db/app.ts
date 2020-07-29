import express = require("express");
import * as mongoose from "mongoose";
import * as schema from "./schema/schema";
const { graphqlHTTP } = require("express-graphql");
const app: any = express();
const cors = require("cors");

//REMEMBER TO HIDE PASSWORD FROM THIS LINE!!
const mongo_URI =
  "mongodb+srv://admin:Codelabs2020@meetinggrounddb.7jfca.mongodb.net/MeetingGroundDB?retryWrites=true&w=majority";

mongoose
  .connect(mongo_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("👍🏻 Connected to MongoDB Atlas"))
  .catch((err) => console.log("Error: ", err.message));

//if port remains taken after server is terminated, use "killall node"

app.use(cors());
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(4001, () => {
  console.log("🧩 Listening for requests on port 4001");
});
// app.listen(4000, () => {
//   console.log("🧩 Listening for requests on port 4000");
// });
