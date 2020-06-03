var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
     mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true, useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name : String,
    image : String,
    description : String

});

var Campground=mongoose.model("Campground",campgroundSchema); //Compiling the schema into a model

Campground.create(
    {
    name: "Salmon Creaak", 
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
    description : "This is a huge granie hill , no bathrooms. No water . Beautiful Granite!"
   },function(err,campground){
       if(err){
               console.log(err);
       }else{
                console.log("NEWLY CREATED CAMPGROUND");
                console.log(campground);
       }

});



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
            res.render("index",{campgrounds : allCampgrounds});
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
    res.render("new.ejs");

});
//SHOW - shows more info about one campground
app.get("/campgrounds/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            //render the show tempelate with that campground
            res.render("show",{campground : foundCampground});
        }

    });
   
    

    
})


app.listen(3000,function(){
    console.log("The YelpCamp Server has Started!!")

});