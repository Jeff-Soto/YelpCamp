const Campground = require("../models/campground"),
      Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please login first.");
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
           if (err || !foundCampground){
               req.flash("error", "Campground not found.")
               res.redirect("back");
           } else {
               if (foundCampground.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You do not have permission to do that.")
                   res.redirect("back");   
               }
           }
        });
    } else{
        req.flash("error", "Please login first.")
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Comment.findById(req.params.commentId, (err, foundComment) => {
           if (err || !foundComment){
               req.flash("error", "Comment not found.")
               res.redirect("back");
           } else {
               if (foundComment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You do not have permission to do that.")
                   res.redirect("back");   
               }
           }
        });
    } else{
        req.flash("error", "Please login first.")
        res.redirect("/login");
    }
}

// middlewareObj.currUser = (req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// };

module.exports = middlewareObj;