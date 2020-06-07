var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
   LocalStrategy= require("passport-local"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds");

var path = require('path');

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, 'public')));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({

    secret: "Once again Rusty wins cutest dog!",

    resave: false,

    saveUninitialized: false

}));

app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user ;
    next();
});


//Routes
app.get("/",function(req,res){
    res.render("landing");

});
//INDEX Route - show all campgrounds
app.get("/campgrounds",function(req,res){
    //Get all the campgrounds from Database
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds : allCampgrounds  });
        }

    });

});
//Create route - add new campground to Db
app.post("/campgrounds",function(req,res){
    
   //get data from form and add to the campground array
   var name=req.body.name;
   var image=req.body.image;
   var desc=req.body.description;
   var newCampground={name:name,image:image,description:desc};
   //Creare a new campground and save to DB
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           //redirect back to campgrounds page
           res.redirect("/campgrounds");
       }


   });

 
});

//NEW - show form to create new Campground
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");

});
//SHOW - shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render the show tempelate with that campground
            res.render("campgrounds/show",{campground : foundCampground});
        }

    });
})

//Comment Routes ==========
app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground : campground});
        }
    })
});

app.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err);
                }else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//AUTH ROUTES

//show register form
app.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
app.post("/register",function(req,res){
    req.body.username
    req.body.password
    User.register(new User({ username : req.body.username }),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });

    });
});

//Login form
app.get("/login",function(req,res){
    res.render("login");
});

//handling login logic
//app.post("/login",middleware,callback)
app.post("/login", passport.authenticate("local",
 { successRedirect : "/campgrounds" , failureRedirect : "/login"} ) 
 ,function(req,res){
    
});

//LOGOUT routes
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000,function(){
    console.log("The YelpCamp Server has Started!!")

});