var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var hostSchema = new Schema({
    Fname: String,
    Lname: String,
    email: String,
    GOA_code: String
});
module.exports = mongoose.model("host_cols", hostSchema);
//making model (=collection) called 'host_col' and the
//objects inside of this collection will look like hostSchema
