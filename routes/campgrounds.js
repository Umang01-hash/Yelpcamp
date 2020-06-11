var express = require("express");
var router=express.Router({mergeParams : true});
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX Route - show all campgrounds
router.get("/",function(req,res){
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
router.post("/",middleware.isLoggedIn,function(req,res){
    
   //get data from form and add to the campground array
   var name=req.body.name;
   var price=req.body.price;
   var image=req.body.image;
   var desc=req.body.description;
   var author={
       id : req.user._id,
       username : req.user.username
   }
   var newCampground={name:name,price : price ,image:image,description:desc, author : author};
   
   //Creare a new campground and save to DB
   Campground.create(newCampground,function(err,newlyCreated){
       if(err){
           console.log(err);
       }else{
           //redirect back to campgrounds page
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }


   });

 
});

//NEW - show form to create new Campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");

});
//SHOW - shows more info about one campground
router.get("/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            return res.redirect('/campgrounds');
        }else{
            console.log(foundCampground);
            //render the show tempelate with that campground
            res.render("campgrounds/show",{campground : foundCampground});
        }

    });
});


//EDIT CAMPGROUND ROUTE
// router.get("/:id/edit",isLoggedIn,middleware.checkCampgroundOwnership,function(req,res){
// Campground.findById(req.params.id,function(err,foundCampground){
    
//     res.render("campgrounds/edit",{ campground : foundCampground});
//   });
// });

router.get("/:id/edit", middleware.isLoggedIn,middleware.checkCampgroundOwnership , function(req, res){
    //render edit template with that campground
    res.render("campgrounds/edit", {campground: req.campground});
  });


//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            //redirect to show page
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
    
    
    
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id , function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});





module.exports=router;