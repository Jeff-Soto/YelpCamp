const User = require("../models/user");
const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(User.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// middlewareObj.currUser = (req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// };

module.exports = middlewareObj;