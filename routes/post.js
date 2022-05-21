const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Post = require("../models/Post");
const Comments = require("../models/Comments");
const mongoose = require("mongoose");
const router = express.Router();
const middleware = require("./middleware");

//-------------------------get user info-----------------
router.get("/user",middleware,(req,res)=>{
    
    User.findById(req.user._id,(err,doc) =>{
        if(err) throw err;
        if(doc){
            res.json({
                "username": doc.username,
                "followers": doc.followers.length,
                "following": doc.following.length
            });
        }
    });
})
//---------------------------unfollow-----------------------
router.post("/unfollow/:userId",middleware, (req,res)=>{
    //console.log("HERE");
    User.findOneAndUpdate({_id: req.user._id},{$pull:{following: req.params.userId}}, function (error, success){
        if (error) {
            console.log(error);
        } else {
            console.log("successfully unfollowed");
        }
    })
});

//---------------------------follow-----------------------------
router.post("/follow/:userId",middleware, (req,res)=>{
    User.findOneAndUpdate({_id: req.user._id},{$push:{following: req.params.userId}}, function (error, success){
        if (error) {
            console.log(error);
        } else {
            console.log("successfully followed");
        }
    })
});

//------------------post new post-----------------------------------

router.post("/posts",middleware, (req,res) =>{
    let d = new Date();
    const newPost = new Post({
        userID: req.user._id,
        title: req.body.title,
        description: req.body.description,
        time: d
    })
    newPost.save();
    User.findOneAndUpdate({_id: req.user._id},{$push:{posts: newPost}}, function (error, success){
        if (error) {
            console.log(error);
        } else {
            console.log("successfully added post to user");
        }
    })
    res.json({
        "id": newPost._id,
        "title":newPost.title,
        "description": newPost.description,
        "created time":newPost.time
    });
    
});

//------------------delete post---------------------------------
router.delete("/posts/:postID", middleware, (req,res)=>{
    Post.findById(req.params.postID, (err,doc)=>{
        if(err) throw err;
        if(doc){
            if(doc.userID!=req.user._id){
                res.send("Can't delete other's post !");
            }else{
                Post.deleteOne({ _id: req.params.postID }, function (err) {
                    if (err) throw err;
                    else console.log("Deleted post");
                  });
            }            
        }
    })
    
    
})

//------------------like post-----------------------------------
router.post("/like/:postID", middleware, async (req,res)=>{
    Post.findOneAndUpdate({_id: req.params.postID}, { $inc: { likes: 1} }, (err,suc)=>{
        if(err) throw err;
        else res.send("liked !");
    })
})

//-------------------unlike post--------------------------------
router.post("/unlike/:postID", middleware, async (req,res)=>{
    Post.findOneAndUpdate({_id: req.params.postID}, { $inc: { unlikes: 1} }, (err,suc)=>{
        if(err) throw err;
        else res.send("unliked !");
    })
})
//-------------------post comment by post id--------------------
router.post("/comment/:postID", middleware,(req,res)=>{
    const newComment = new Comments({
        postID: req.params.postID,
        body: req.body.body,
        userID: req.user._id
    });
    newComment.save();
    console.log(newComment);
    Post.findOneAndUpdate({_id: req.params.postID},{$push:{comments: newComment._id}}, function (error, success){
        if (error) {
            console.log(error);
        } else {
            console.log("successfully added comment to post");
        }
    })
    res.send(newComment._id);
})

//------------------post info------------------------------------
router.get("/posts/:postID", middleware, async (req,res)=>{
    //post with no. of likes and comment
    let postInfo ={
        "title":"",
        "description": "",
        "Likes": 0,
        "comments": 0
    }
    
    const data = await Post.findById(req.params.postID);
    postInfo.title= data.title;
    postInfo.description=data.description;
    postInfo.Likes = data.likes;   
      
    const commdata = await Comments.countDocuments({userID:req.params.postID});
    postInfo.comments=commdata;
    console.log(postInfo);
    res.json(postInfo);

});

//------------------all posts by user----------------------------------
router.get("/all_posts", middleware, async(req,res)=>{
    
    const data = await Post.find({userID: req.user._id}).sort({'time': 1}).populate("comments",{body: 1}).exec();
    
    if (data) {
        return res
          .status(200)
          .json(data);
    }else {
        return res.status(400).json({ msg: "post not found" });
    }
})


module.exports = router;