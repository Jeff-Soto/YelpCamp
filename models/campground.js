const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    name: String,
    imageURL: { type: String, default: "/images/noImage.png"},
    description: String,
    createdOn: { type: Date, default: Date.now }
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;