const express= require('express'),
    app = express(),
    bodyParser = require ("body-parser"),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    User = require ('./models/user')
    seedDB = require('./seeds');

    
//requiring routes
const commentRoutes = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes = require("./routes/index");

      console.log(process.env.DATABASEURL);
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp"
mongoose.connect(url, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true
}).then(()=> {
    console.log('connected to db');
}).catch(err => {
    console.log('error', err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

app.set("view engine", "ejs");
// seedDB(); // seed the database

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

app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
})

app.use(indexRoutes);
app.use(commentRoutes);
app.use("/campgrounds", campgroundRoutes);

const currentPort = 3000;
const port = process.env.PORT || currentPort

app.listen(port, () => {
    console.log(`Listening on ${port}`) 
})