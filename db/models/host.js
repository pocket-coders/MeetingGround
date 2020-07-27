var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var hostSchema = new Schema({
    Fname: String,
    Lname: String,
<<<<<<< HEAD
    email: String
=======
    email: String,
    GOA_code: String
>>>>>>> 88d72da0be4a06f6e87e5d35b2fa15397156a4d2
});
module.exports = mongoose.model("host_cols", hostSchema);
//making model (=collection) called 'host_col' and the
//objects inside of this collection will look like hostSchema
