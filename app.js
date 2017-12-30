const express = require("express"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      app = express();
      
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");
      
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
 
// INDEX ROUTE     
app.get("/", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            console.log("Something went wrong when finding all campgrounds.", err);
        } else{
           res.render("index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW ROUTE
app.get("/new", (req, res)=>{
    res.render("new");
});


app.listen(process.env.PORT, process.env.IP);