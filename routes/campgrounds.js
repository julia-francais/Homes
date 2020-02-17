const express= require('express'),
      Comment =require('../models/comment'),
      Campground= require('../models/campground');
const router = express.Router();
const middleware = require('../middleware');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

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
    let price = req.body.price
    let image = req.body.image;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let location = req.body.location;
    // geocoder.geocode(req.body.location, (err, data) => {
    //     if (err || !data.length) {
    //         req.flash('error', "Invalid address");
    //         return res.redirect('back');
    //     }
    //     var lat = data[0].latitude;
    //     var lng = data[0].longitude;
    //     var location = data[0].formattedAddress;
    // })
    var newCampground = {name: name, price: price, image: image, description: description, author: author, location: location};
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
    //To Implement later with Maps API
    // geocoder.geocode(req.body.location, (err, data) => {
    //     if (err || !data.length) {
    //         req.flash('error', "Invalid address");
    //         return res.redirect('back');
    //     }
    //     req.body.campground.lat = data[0].latitude;
    //     req.body.campground.lng = data[0].longitude;
    //     req.body.campground.location = data[0].formattedAddress;
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
        if(err){
            req.flash("error", err.message);
            res.redirect('back');
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect('/campgrounds/' + campground._id);
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