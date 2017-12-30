const express = require("express"),
      mongoose = require("mongoose"),
      app = express();
      
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");

const campgroundSchema = new mongoose.Schema({
    name: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

Campground.create({
    name: "Test Campground",
    description: "Test Description for test campground."
}, (err, campground)=>{
    if (err){
        console.log("Something went wrong when creating a campground.", err);
    } else{
        console.log("Campground successfully created: ", campground);
    }
});
      
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
      
app.get("/", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            console.log("Something went wrong when finding all campgrounds.", err);
        } else{
           res.render("index", {campgrounds: allCampgrounds}); 
        }
    });
});

app.listen(process.env.PORT, process.env.IP);