const express = require("express"),
      Campground = require("../models/campground"),
      middleware = require("../middleware"),
      router = express.Router();
      
 
// INDEX ROUTE     
router.get("/", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            req.flash("error", "Whoops, something went wrong.");
            res.redirect("back");
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
router.post("/", middleware.isLoggedIn, (req, res)=>{
    const newCampData = {
        name: req.body.name,
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
    };
    Campground.create( newCampData, (err, newCampground)=>{
        if (err) {
            req.flash("error", "Error occurred while creating new campground.")
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully created new campground!")
            res.redirect("/campgrounds");
        }
    });
});

// SHOW ROUTE
router.get("/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
       if (err || !foundCampground){
           req.flash("error", "Campground could not be found.");
           res.redirect("back");
       } else{
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// Add EDIT ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id,(err, foundCampground)=>{
       if (err){
           req.flash("error", "Campground could not be found.");
           res.redirect("back");
       } else{
           res.render("campgrounds/edit", {campground: foundCampground});
       }
    });
});

// Add UPDATE ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req,res)=>{
    const updatedCampData = {
        name: req.body.name,
        description: req.body.description
    };
   Campground.findByIdAndUpdate(req.params.id, updatedCampData, (err, updatedCampground)=>{
       if (err){
           req.flash("error", "Error updating campground.");
           res.redirect("back");
       } else{
           req.flash("success", "Successfully updated campground.");
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});

// Add DESTROY ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if (err) {
            req.flash("error", "Error deleting campground.");
           res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted campground.");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;