var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var linkSchema = new Schema({
    url: String,
    duration: Number,
    hostId: String
});
module.exports = mongoose.model("link_cols", linkSchema);
//making model (=collection) called 'Link_col' and the
//objects inside of this collection will look like linkSchema
