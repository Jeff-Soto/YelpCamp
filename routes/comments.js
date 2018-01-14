const express = require("express"),
      Comment = require("../models/comment"),
      Campground = require("../models/campground"),
      middleware = require("../middleware"),
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
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment._id);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id);
               }
           });
       }
   });
});

router.get("/:commentId/edit", (req, res) => {
    Comment.findById(req.params.commentId, (err, comment)=>{
        if (err){
            console.log("Err finding comment by id", err);
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

router.put("/:commentId", (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updatedComment)=>{
        if (err){
            console.log("err updating comment.", err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:commentId", (req, res)=>{
    Comment.findByIdAndRemove(req.params.commentId, (err)=>{
        if (err){
            console.log("Error deleting comment: ", err);
        }
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;