var express = require("express");
var router=express.Router({mergeParams : true});
var passport=require("passport");
var User=require("../models/user");
var Campground = require("../models/campground");

//Routes
router.get("/",function(req,res){
    res.render("landing");

});

router.get("/about",function(req,res){
    res.render("about");

});



//AUTH ROUTES

//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
router.post("/register",function(req,res){
    var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    });
    

    if(req.body.adminCode === 'Umang01*') {
      newUser.isAdmin = true;
    }
   
    User.register(newUser,req.body.password,function(err,user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            // req.flash("success","Welcome to Yelpcamp "+ req.body.username);
            res.redirect("/campgrounds");
        });

    });
});

//Login form
router.get("/login",function(req,res){
    res.render("login" , { message : req.flash("error")});
});

//handling login logic
//app.post("/login",middleware,callback)
router.post("/login", passport.authenticate("local",
 { successRedirect: "/campgrounds",
 failureRedirect: "/login",
 failureFlash: true,
 successFlash: 'Welcome to YelpCamp!'} ) 
 ,function(req,res){
    
});

//LOGOUT routes
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success" , "Logged you out");
    res.redirect("/campgrounds");
});

//User's Profile
router.get("/users/:id",function(req,res){
    User.findById(req.params.id,function(err,foundUser){
        if(err){
            req.flash("error", "Something went wrong.");
      return res.redirect("/");
        }
        Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
            if(err) {
              req.flash("error", "Something went wrong.");
              return res.redirect("/");
            }
            res.render("users/show", {user: foundUser, campgrounds: campgrounds});
          })
        });
      });


module.exports=router;