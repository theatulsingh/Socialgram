const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model("Post")
router.delete('/deletepost/:postid',requirelogin,(req,res)=>{
    Post.findOne({_id:req.params.postid})
    .populate("postedby","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedby._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})
router.get('/allposts',requirelogin,(req,res)=>{
    Post.find({postedby:{$in:req.user.following}}).populate("postedby","name")
    .populate("comments.postedby","_id name pic")
    .sort("-createdAt")
    .then(allposts=>{
       res.json({allposts})
    })
})
router.get('/myposts',requirelogin,(req,res)=>{
    Post.find({postedby:req.user._id}).populate("postedby","name")
    .populate("comments.postedby","_id name pic")
    .sort("-createdAt")
    .then(myposts=>{
       res.json({myposts})
    })
})
router.post('/createpost',requirelogin,(req,res)=>{
    const {caption, photo} = req.body
    console.log(photo);
    if(!photo){ return res.status(422).json({error:"Empty Post!"})}
    req.user.password = undefined
    const newpost= new Post({
        caption,
        photo,
        postedby:req.user
    }) 
    newpost.save().then(result=>{
        res.json({post:result,message:"Posted !"})
    }).catch(error=>{
        console.log(error)
    })
})
router.put('/like',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postid,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        else res.json({result})
    })
})
router.put('/unlike',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postid,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        else res.json({result})
    })
})
router.put('/comment',requirelogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedby:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postid,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedby","_id name")
    .exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        else res.json({result})
    })
})
router.put('/deletecomment',requirelogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postid,{
        $pull:{comments:req.body.comment}
    },{
        new:true
    }).exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        else res.json({result})
    })
})

module.exports = router