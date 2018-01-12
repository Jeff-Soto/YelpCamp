const express = require("express"),
      Campground = require("../models/campground"),
      middleware = require("../middleware"),
      router = express.Router();
      
 
// INDEX ROUTE     
router.get("/", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            console.log("Something went wrong when finding all campgrounds.", err);
        } else{
           res.render("campgrounds/index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    res.render("campgrounds/new");
});

// CREATE ROUTE
router.post("/", (req, res)=>{
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

// SHOW ROUTE
router.get("/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
       if (err){
           console.log("Error finding campground by ID: ", err);
       } else{
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// Add EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id,(err, foundCampground)=>{
       if (err){
           console.log("Error finding campground by ID: ", err);
       } else{
           res.render("campgrounds/edit", {campground: foundCampground});
       }
    });
});

// Add UPDATE ROUTE
router.put("/:id", (req,res)=>{
    const updatedCampData = {
        name: req.body.name,
        description: req.body.description
    };
   Campground.findByIdAndUpdate(req.params.id, updatedCampData, (err, updatedCampground)=>{
       if (err){
           console.log("Error finding/updating campground: ", err);
       } else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});

// Add DESTROY ROUTE
router.delete("/:id", (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if (err) {
            console.log("Error deleting campground: ",err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;