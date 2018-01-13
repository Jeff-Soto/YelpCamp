const Campground = require("../models/campground"),
      Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
           if (err){
               res.redirect("back");
           } else {
               if (foundCampground.author.id.equals(req.user._id)){
                   next();
               } else {
                    res.redirect("back");   
               }
           }
        });
    } else{
        res.redirect("/login");
    }
}

// middlewareObj.currUser = (req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// };

module.exports = middlewareObj;