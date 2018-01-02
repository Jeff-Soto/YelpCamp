const express = require("express"),
      mongoose = require("mongoose"),
      Campground = require("./models/campground"),
      Comment = require("./models/comment"),
      methodOverride = require("method-override"),
      bodyParser = require("body-parser"),
      app = express();
      
const databaseUri = process.env.DATABASE_URI || 'mongodb://localhost/yelp_camp';
mongoose.connect(databaseUri)
      .then(() => console.log(`Database connected`))
      .catch(err => console.log(`Database connection error: ${err.message}`));

// Create dummy campground with dummy comment associated

// Campground.create({
//     name: "Dummy",
//     description: "Dummy campground to test comments"
// }, (err, camp)=>{
//     if (err){
//         console.log(err);
//     } else{
//         Comment.create({
//             author: "Dummy Author",
//             text: "Dummy comment"
//         }, (err, comment)=>{
//             if (err){
//                 console.log(err);
//             } else{
//                 camp.comments.push(comment);
//                 camp.save();
//                 console.log(camp);
//             }
//         });
//     }
// });
      
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views/partials"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// ***** CAMPGROUND ROUTES *******
app.get("/", (req, res)=>{
    res.redirect("/campgrounds");
});
 
// INDEX ROUTE     
app.get("/campgrounds", (req, res)=>{
    Campground.find({}, (err, allCampgrounds)=>{
        if (err){
            console.log("Something went wrong when finding all campgrounds.", err);
        } else{
           res.render("index", {campgrounds: allCampgrounds}); 
        }
    });
});

// NEW ROUTE
app.get("/campgrounds/new", (req, res)=>{
    res.render("new");
});

// CREATE ROUTE
app.post("/campgrounds", (req, res)=>{
    const newCampData = {
        name: req.body.name,
        description: req.body.description
    };
    console.log(newCampData);
    Campground.create( newCampData, (err, newCampground)=>{
        if (err){
            console.log("Error detected when creating new campground: ", err);
            res.redirect("/campgrounds");
        } else{
            console.log("Successfully created campground: ",newCampground);
            res.redirect("/campgrounds");
        }
    });
});

// SHOW ROUTE
app.get("/campgrounds/:id", (req, res)=>{
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground)=>{
       if (err){
           console.log("Error finding campground by ID: ", err);
       } else{
           res.render("show", {campground: foundCampground});
       }
    });
});

// Add EDIT ROUTE
app.get("/campgrounds/:id/edit", (req, res)=>{
    Campground.findById(req.params.id,(err, foundCampground)=>{
       if (err){
           console.log("Error finding campground by ID: ", err);
       } else{
           res.render("edit", {campground: foundCampground});
       }
    });
});

// Add UPDATE ROUTE
app.put("/campgrounds/:id", (req,res)=>{
    const updatedCampData = {
        name: req.body.name,
        description: req.body.description
    };
   Campground.findByIdAndUpdate(req.params.id, updatedCampData, (err, updatedCampground)=>{
       if (err){
           console.log("Error finding/updating campground: ", err);
       } else{
           res.redirect("/campgrounds/"+req.params.id);
       }
   }); 
});

// Add DESTROY ROUTE
app.delete("/campgrounds/:id", (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err)=>{
        if (err) {
            console.log("Error deleting campground: ",err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// ******* COMMENTS ROUTES ********
app.get("/campgrounds/:id/comments/new", (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log("Error in comments new: ", err);
       } else{
           console.log(campground);
           res.render("newComment", {campground: campground});
       }
    });
});

app.post("/campgrounds/:id/comments", (req, res)=>{
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

// Move Campground Routes to ROUTES folder
// 
// Create USER model.

// add login system.

// Hide edit/delete campgrounds for non-authors.

// Add author data to index, show, etc.



app.listen(process.env.PORT, process.env.IP);