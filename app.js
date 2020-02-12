const express= require('express'),
    app =express(),
    bodyParser = require ("body-parser"),
    mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    seedDB = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));


const port = 3000;

app.set("view engine", "ejs");
seedDB();

app.get('/', (req, res) => {
    res.render('landing');
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        } else {
            console.log('campgrounds', campgrounds);
            res.render('index', {campgrounds: campgrounds});
        }
    })
});

app.post('/campgrounds', (req,res) => {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    var newCampground = {name: name, image:image, description:description };
    Campground.create(newCampground, (err,campground)=>{
        if(err){
            console.log('err', err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

app.get("/campgrounds/new", (req, res) => {
    res.render('new.ejs')
});

//SHOW
app.get("/campgrounds/:id", (req, res)=> {
    Campground.findById(req.params.id).populate('comments').exec((err,foundCampground)=> {
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('show', {campground: foundCampground});
        }
    });
})

app.listen(port, () => {
    console.log(`Listening on ${port}`) 
})