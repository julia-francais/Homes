const express=require("express"),
      Comment = require("../models/comment"),
      Campground = require("../models/campground");

const router = express.Router({mergeParams: true});

//middleware
const isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

//Comments new
router.get('/new', isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

//Comments create
router.post('/', isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err)
            res.redirect('/campgrounds');
        } else {
            Comment.create(req.body.comment, (err, comment)=>{
                if(err){
                    console.log(err)
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect('/campgrounds/' + campground._id);

                }
            })
        }
    });
})
module.exports = router;