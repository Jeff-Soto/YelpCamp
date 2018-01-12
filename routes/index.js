const express = require("express"),
      User = require("../models/user"),
      passport = require("passport"),
      router = express.Router({mergeParams: true});


router.get("/", (req,res)=>{
    res.redirect("/campgrounds");
});
// REGISTER ROUTES
router.get("/register", (req, res)=>{
   res.render("register"); 
});

router.post("/register", (req, res)=>{
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) =>{
		if (err){
			return res.redirect("/register");
		}
		// authenticate user
		passport.authenticate('local')(req, res, ()=>{
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN ROUTES
router.get("/login", (req, res)=>{
   res.render("login");
});

router.post('/login', passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), (req, res) => {
		
});

// LOGOUT
router.get('/logout', (req, res)=>{
	req.logout();
	res.redirect('/campgrounds');
});

module.exports = router;