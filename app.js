const express = require("express"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      app = express();
      
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");


// CREATE MODELS DIR THEN FINISH CAMPGROUNDS ROUTES
      
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