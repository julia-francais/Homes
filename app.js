const express= require('express'),
    app = express(),
    bodyParser = require ("body-parser"),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require ('./models/user')
    seedDB = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

const port = 3000;

app.set("view engine", "ejs");
seedDB();

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: "Blob is the best",
    resave: false,
    saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
    res.render('landing');
})

app.get('/campgrounds', (req, res) => {
    Campground.find({}, (err, campgrounds)=>{
        if(err){
            console.log(err);
        } else {
            console.log('campgrounds', campgrounds);
            res.render('campgrounds/index', {campgrounds: campgrounds});
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
    res.render('campgrounds/new')
});

//SHOW
app.get("/campgrounds/:id", (req, res)=> {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render('campgrounds/show', {campground: foundCampground});
        }
    });
})

//===================
// COMMENTS ROUTES
//===================

//SHOW form comments
app.get('/campgrounds/:id/comments/new', (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

app.post('/campgrounds/:id/comments', (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err)
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err)
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);

                }
            })
        }
    });
})

//===================
//AUTH ROUTES
//===================

app.get('/register', (req, res)=> {
    res.render('register');
});

//handling sign up logic
app.post('/register', (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=> {
        if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, ()=> {
            res.redirect('/campgrounds');
        });
    });
});


app.listen(port, () => {
    console.log(`Listening on ${port}`) 
})