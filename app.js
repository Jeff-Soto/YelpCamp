const express = require("express"),
      mongoose = require("mongoose"),
      User = require("./models/user"),
      campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index"),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      passport = require("passport"),
      passportLocal = require("passport-local"),
      eSession = require("express-session"),
      app = express();
      
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost/yelp_camp';
mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use("/campgrounds", campgroundRoutes);    
app.use("/campgrounds/:id/comments",commentRoutes);    
app.use("/", indexRoutes);  
// auth
app.use(eSession({
    secret: "Whatever, doesn't really matter right now",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// end auth
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));



// Move Campground Routes to ROUTES folder

// Hide edit/delete campgrounds for non-authors.

// Add author data to index, show, etc.



app.listen(process.env.PORT, process.env.IP);