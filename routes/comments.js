const express=require("express"),
      Comment = require("../models/comment"),
      Campground = require("../models/campground");

const router = express.Router({mergeParams: true});
//middlewares
const isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

const checkCommentOwnership = (req, res, next)=> {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment)=>{
            console.log(foundComment);
            if(err){
                res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect("back")
    }
}

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
router.post('/', (req, res)=> {
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

//EDIT 
router.get('/:comment_id/edit', checkCommentOwnership, (req, res)=>{
    console.log('edit')
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            res.redirect("back")
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    });
});

//UPDATE
router.put('/:comment_id', checkCommentOwnership, (req, res)=> {
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
router.delete('/:comment_id', checkCommentOwnership, (req, res)=>{
    Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment)=>{
        console.log(deletedComment);
        if(err){
            res.redirect("back")
        } else {
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

});
module.exports = router;