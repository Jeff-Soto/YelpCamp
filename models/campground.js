const mongoose = require("mongoose");

const campgroundSchema = new mongoose.Schema({
    name: String,
    imageURL: { type: String, default: "/images/noImage.png"},
    description: String,
    createdOn: { type: Date, default: Date.now },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

const Campground = mongoose.model("Campground", campgroundSchema);

module.exports = Campground;