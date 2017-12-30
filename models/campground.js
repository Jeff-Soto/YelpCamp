const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    name: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;