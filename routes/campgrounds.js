const express= require('express'),
      Comment =require('../models/comment'),
      Campground= require('../models/campground');
const router = express.Router();
const middleware = require('../middleware');

//INDEX - show all Campgrounds
router.get('/', (req, res) => {
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds, currentUser: req.user});
        }
    })
});

//CREATE - create a new campground
router.post('/', middleware.isLoggedIn, (req,res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: description, author: author };
    Campground.create(newCampground, (err,campground)=>{
        if(err){
            console.log('err', err);
        } else {
            console.log("newly created")
            res.redirect("/campgrounds");
        }
    })
})

// NEW - form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
});

//SHOW - show one particular campground
router.get("/:id", (req, res)=> {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
});

//EDIT - edit a campground
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=> {
        Campground.findById(req.params.id, (err, foundCampground)=>{
            res.render('campgrounds/edit', {campground: foundCampground});
        });
});

//UPDATE - update a campground
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=> {
    console.log('put');
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds/' + req.params.id);
        };
    });
});

//DESTROY - delete a campground
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=> {
    Campground.findByIdAndDelete(req.params.id, (err)=> {
        if(err){
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;