const express=require("express"),
      passport = require('passport'),
      User = require("../models/user");
      
const router = express.Router();

//root route
router.get('/', (req, res) => {
    res.render('landing');
})

//show sign up form
router.get('/register', (req, res)=> {
    res.render('register');
});

//handle sign up logic
router.post('/register', (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=> {
        if(err){
            req.flash("error", err.message);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, ()=> {
            req.flash("success", `Welcome to Yelpcamp ${user.username} !`);
            res.redirect('/campgrounds');
        });
    });
});

//show login form
router.get('/login', (req, res)=>{
    res.render('login');
})

//handling login logic
router.post('/login', passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), (req, res)=> {
})

//logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success", "Logged you out ;)")
    res.redirect('/campgrounds');
});

//About section route
//logout route
router.get('/about', (req, res) => {
    res.render('about');
});

//Comment routes that should be in the routes/comments.js file but aren't working (to work and move later)
// EDIT 
router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if (err || !foundCampground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            if(err){
                res.redirect("back")
            } else {
                console.log('campground id', req.params.id);
                console.log('comment', foundComment);
                console.log(req.params);
                res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
            }
        });
    });
});

//UPDATE
router.put('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
    console.log('up')
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE
router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment)=>{
        console.log(deletedComment);
        if(err){
            res.redirect("back")
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

module.exports = router;