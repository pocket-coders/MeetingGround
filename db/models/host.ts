const mongooseHost = require("mongoose");
const SchemaHost = mongooseHost.Schema;

const hostSchema = new SchemaHost({
  Fname: String,
  Lname: String,
  email: String,
  refresh_token: String,
});

module.exports = mongooseHost.model("host_cols", hostSchema);
//making model (=collection) called 'host_col' and the
//objects inside of this collection will look like hostSchema
