const express = require("express"),
      Comment = require("../models/comment"),
      Campground = require("../models/campground"),
      middleware = require("../middleware"),
      router = express.Router({mergeParams: true});

// ******* COMMENTS ROUTES ********
router.get("/new", middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if (err){
            req.flash("error", "Error, try again.");
            res.redirect("back");
       } else{
           res.render("comments/new", {campground: campground});
       }
    });
});

router.post("/", (req, res)=>{
   Campground.findById(req.params.id, (err, campground)=>{
       if (err){
           req.flash("error", "Error, try again.");
           res.redirect("back");
       } else{
           Comment.create(req.body.comment, (err, comment) =>{
               if (err){
                   req.flash("error", "Error creating new comment.");
                   res.redirect("back");
               } else{
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   campground.comments.push(comment._id);
                   campground.save();
                   req.flash("success", "Successfully added new comment.")
                   res.redirect("/campgrounds/"+campground._id);
               }
           });
       }
   });
});

router.get("/:commentId/edit", middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.commentId, (err, comment)=>{
        if (err){
            req.flash("error", "Error, try again.");
            res.redirect("back");
        } else {
            res.render("comments/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

router.put("/:commentId", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, updatedComment)=>{
        if (err){
            req.flash("error", "Error updating comment.");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:commentId", middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndRemove(req.params.commentId, (err)=>{
        if (err){
            req.flash("error", "Error deleting comment.");
            res.redirect("back");
        }
        req.flash("success", "Successfully deleted comment.");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = router;