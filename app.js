const express = require("express"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      bodyParser = require("body-parser"),
      app = express();
      
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");
      
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
app.use(bodyParser.urlencoded({extended: true}));

// Root route
app.get("/", (req, res)=>{
    res.redirect("/campgrounds");
});
 
// INDEX ROUTE     
app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            console.log("Something went wrong when finding all campgrounds.", err);
        } else{
           res.render("index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

// CREATE ROUTE
app.post("/campgrounds", (req, res)=>{
    const newCampData = {
        name: req.body.name,
        description: req.body.description
    };
    console.log(newCampData);
    Campground.create( newCampData, (err, newCampground)=>{
        if (err){
            console.log("Error detected when creating new campground: ", err);
            res.redirect("/campgrounds");
        } else{
            console.log("Successfully created campground: ",newCampground);
            res.redirect("/campgrounds");
        }
    });
});


app.listen(process.env.PORT, process.env.IP);