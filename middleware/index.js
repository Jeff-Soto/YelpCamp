const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// middlewareObj.currUser = (req, res, next) => {
//     res.locals.currentUser = req.user;
//     next();
// };

module.exports = middlewareObj;