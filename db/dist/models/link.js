"use strict";
var mongooseLink = require("mongoose");
var SchemaLink = mongooseLink.Schema;
var linkSchema = new SchemaLink({
    url: String,
    duration: Number,
    hostId: String,
});
module.exports = mongooseLink.model("link_cols", linkSchema);
//making model (=collection) called 'Link_col' and the
//objects inside of this collection will look like linkSchema
//# sourceMappingURL=link.js.map