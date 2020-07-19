const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const linkSchema = new Schema({
  url: String,
  duration: Number,
  hostId: String,
});

module.exports = mongoose.model("link_cols", linkSchema);
//making model (=collection) called 'Link_col' and the
//objects inside of this collection will look like linkSchema
