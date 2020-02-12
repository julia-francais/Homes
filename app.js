const express= require('express'),
    app =express(),
    bodyParser = require ("body-parser"),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));


const port = 3000;

app.set("view engine", "ejs");

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

const Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Salmon Creek", 
//         image:"https://europe.huttopia.com/content/uploads/2016/09/Carroussel-Camping-Nature-Home.jpg",
//         description: "Get an enchanted experience of wild wild nature at Salmon Creek"
//     }, (err,campground) => {
//         if(err){
//             console.log("err", err);
//         } else {
//             console.log(`new campground ${campground}`);
//         }
//     });

// const campgrounds = [
//     {name: "Salmon Creek", image:"https://europe.huttopia.com/content/uploads/2016/09/Carroussel-Camping-Nature-Home.jpg"},

//     {name: "Granite Hill", image: "https://www.dw.com/image/48396304_303.jpg"},

//     {name: "Mountain Gembri", image:"https://pix10.agoda.net/hotelImages/5647641/-1/45ee96c8c2b177ffcd99818b6b6387f0.jpg?s=1024x768"},

//     {name: "Salmon Creek", image:"https://europe.huttopia.com/content/uploads/2016/09/Carroussel-Camping-Nature-Home.jpg"},

//     {name: "Granite Hill", image: "https://www.dw.com/image/48396304_303.jpg"},

//     {name: "Mountain Gembri", image:"https://pix10.agoda.net/hotelImages/5647641/-1/45ee96c8c2b177ffcd99818b6b6387f0.jpg?s=1024x768"},

//     {name: "Salmon Creek", image:"https://europe.huttopia.com/content/uploads/2016/09/Carroussel-Camping-Nature-Home.jpg"},

//     {name: "Granite Hill", image: "https://www.dw.com/image/48396304_303.jpg"},

//     {name: "Mountain Gembri", image:"https://pix10.agoda.net/hotelImages/5647641/-1/45ee96c8c2b177ffcd99818b6b6387f0.jpg?s=1024x768"}
// ];

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

app.get("/campgrounds/:id", (req, res)=> {
    Campground.findById(req.params.id, (err,campground)=> {
        if(err){
            console.log(err);
        } else {
            res.render('show', {campground: campground});
        }
    });
})

app.listen(port, () => {
    console.log(`Listening on ${port}`) 
})