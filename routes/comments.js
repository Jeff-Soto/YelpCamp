const express = require("express"),
      Comment = require("../models/comment"),
      Campground = require("../models/campground"),
      middleware = require("../middleware/index"),
      router = express.Router({mergeParams: true});

// ******* COMMENTS ROUTES ********
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log("Error in comments new: ", err);
       } else{
           console.log(campground);
           res.render("comments/new", {campground: campground});
       }
    });
});

router.post("/", (req, res)=>{
   Campground.findById(req.params.id, (err, campground)=>{
       if (err){
           console.log("Error finding campground: ",err);
       } else{
           Comment.create(req.body.comment, (err, comment) =>{
                   if (err){
                       console.log("Error creating comment: ", err);
                   } else{
                       comment.save();
                       campground.comments.push(comment._id);
                       campground.save();
                       res.redirect("/campgrounds/"+campground._id);
                   }
           });
       }
   });
});

module.exports = router;