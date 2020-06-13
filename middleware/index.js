var Campground = require("../models/campground");
var Comment = require("../models/comment");

//all  the middleware goes here
var middlewareObj={};

middlewareObj.isLoggedIn=  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error" , "You need to be logged in to do that.");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id,function(err,foundCampground){
                if(err || !foundCampground ){
                    req.flash("error","Campground not found!!");
                    res.redirect('/campgrounds');
                }else  if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
                          next();
                    req.campground = foundCampground;
                } else {
                    req.flash('error', 'You don\'t have permission to do that!');
                    res.redirect('/campgrounds/' + req.params.id);
                }
                    
                
            });
            
        }
        else{
            req.flash("error","You need to be logged in to do that!!")
            res.redirect("/login");
        }
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                console.log(err);
               req.flash('error', 'Sorry, that comment does not exist!');
               res.redirect('/campgrounds');
            } else  if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                next();
                req.comment = foundComment;
                
           } else {
               req.flash('error', 'You don\'t have permission to do that!');
               res.redirect('/campgrounds/' + req.params.id);
           }
            
        });
        
    }
    else{
        res.redirect("back");
    }
}

//middleware


module.exports = middlewareObj;