var express = require("express");
var router=express.Router({mergeParams : true});
var passport=require("passport");
var User=require("../models/user");

//Routes
router.get("/",function(req,res){
    res.render("landing");

});



//AUTH ROUTES

//show register form
router.get("/register",function(req,res){
    res.render("register");
});

//handle sign up logic
router.post("/register",function(req,res){
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
router.get("/login",function(req,res){
    res.render("login");
});

//handling login logic
//app.post("/login",middleware,callback)
router.post("/login", passport.authenticate("local",
 { successRedirect : "/campgrounds" , failureRedirect : "/login"} ) 
 ,function(req,res){
    
});

//LOGOUT routes
router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;