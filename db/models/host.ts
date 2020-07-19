const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hostSchema = new Schema({
  Fname: String,
  Lname: String,
  email: String,
});

module.exports = mongoose.model("host_cols", hostSchema);
//making model (=collection) called 'host_col' and the
//objects inside of this collection will look like hostSchema
