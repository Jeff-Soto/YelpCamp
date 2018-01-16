const express = require("express"),
      mongoose = require("mongoose"),
      User = require("./models/user"),
      campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes = require("./routes/comments"),
      indexRoutes = require("./routes/index"),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      flash = require("connect-flash"),
      passport = require("passport"),
      passportLocal = require("passport-local"),
      eSession = require("express-session"),
      app = express();
      
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost/yelp_camp';
mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");
// auth
app.use(eSession({
    secret: "Whatever, doesn't really matter right now",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// end auth

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use("/campgrounds", campgroundRoutes);    
app.use("/campgrounds/:id/comments",commentRoutes);    
app.use("/", indexRoutes);  


app.listen(process.env.PORT, process.env.IP);