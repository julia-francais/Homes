const express=require("express");
const router = express.Router({mergeParams: true});
      Campground = require("../models/campground"),
      Comment = require("../models/comment"),
      User = require("../models/user")
      middleware = require('../middleware');



//Comments new
router.get('/campgrounds/:id/comments/new', middleware.isLoggedIn, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err)
        } else {
            res.render('comments/new', {campground: campground});
        }
    })
});

//Comments create
router.post('/campgrounds/:id/comments/', middleware.isLoggedIn, (req, res)=> {
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
                    req.flash("success", "Successfully added comment");
                    res.redirect('/campgrounds/' + campground._id);

                }
            })
        }
    });
 

//EDIT 
// router.get('/campgrounds/:id/comments/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
//     console.log('edit');
//     Campground.findById(req.params.id, (err, foundCampground)=>{
//         if (err || !foundCampground) {
//             req.flash("error", "No campground found");
//             return res.redirect("back");
//         }
//         Comment.findById(req.params.comment_id, (err, foundComment)=>{
//             if(err){
//                 res.redirect("back")
//             } else {
//                 res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
//             }
//         });
//     });
// });

//UPDATE
// router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=> {
//     console.log('up')
//     Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
//         if(err){
//             res.redirect("back")
//         } else {
//             res.redirect("/campgrounds/" + req.params.id);
//         }
//     });
// });

// //DELETE
// router.delete('/campgrounds/:id/comments/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
//     Comment.findByIdAndDelete(req.params.comment_id, (err, deletedComment)=>{
//         console.log(deletedComment);
//         if(err){
//             res.redirect("back")
//         } else {
//             req.flash("success", "Comment deleted");
//             res.redirect("/campgrounds/" + req.params.id)
//         }
//     });
// });

});
module.exports = router;