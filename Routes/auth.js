const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("user")
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET,SENDGRID_API,EMAIL} = require('../config/keys')
const requirelogin = require('../middleware/requirelogin')
const nodemailer = require('nodemailer')
const sendgridtransport = require('nodemailer-sendgrid-transport')
const transporter = nodemailer.createTransport(sendgridtransport({
  auth:{
      api_key:SENDGRID_API
  }
}))
router.post('/signup',(req,res)=>{
    const {name,email,password,pic}= req.body;
    if(!name || !email || !password){
      return  res.status(422).json({error:"Please enter all the fields"});
    }
    User.findOne({email:email}).then((saveduser)=>{
      if(saveduser) return  res.status(422).json({error:"User already exists with this email"});
      bcrypt.hash(password,20).then((hashedpassword)=>{
        const newUser = new User({
          name,
          email,
          password:hashedpassword,
          pic
        })
        newUser.save().then(newuser=>{
                transporter.sendMail({
                to:newuser.email,
                from:"no.reply.socialgram@gmail.com",
                subject:"Signup Success",
                html:"<h1>Welcome to Socialgram</h1>"
          })
          res.status(200).json({message:"SignUp successful!"});
        }).catch(error=>{
          console.log(error)
        })
      }).catch(error=>{
        console.log(error)
      })
    }).catch(error=>{
      console.log(error)
    }) 
})
router.post('/signin',(req,res)=>{
   const {email,password}= req.body;
  if(!email || !password){
    return  res.status(422).json({error:"Please enter all the fields"})
  }
  User.findOne({email:email}).then((saveduser)=>{
    if(!saveduser) return res.status(422).json({error:"Your email or password is incorrect"})
    bcrypt.compare(password,saveduser.password).then((bool)=>{
      if(bool){
        const token=jwt.sign({_id:saveduser._id},JWT_SECRET)
        const {_id,name,email,pic,followers,following} = saveduser;
        res.json({token,user:{_id,name,email,pic,followers,following},message:"Login Successful"})
      }else{
        return res.status(422).json({error:"Your email or password is incorrect"})
      }
    }).catch(err=>{
      console.log(err)
    })
  }).catch(err=>{
    console.log(err)
  })
})
router.get('/getfollowing',requirelogin,(req,res)=>{
  User.findOne({_id:req.user._id})
  .populate("following","_id name pic")
  .exec((err,user)=>{
    if(err){
      return res.status(422).json({error:err})
  }
  res.json(user.following)
  })
})
router.get('/getfollow',requirelogin,(req,res)=>{
  User.findOne({_id:req.user._id})
  .populate("followers","_id name pic")
  .exec((err,user)=>{
    if(err){
      return res.status(422).json({error:err})
  }
  res.json(user.followers)
  })
})
router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dont exists with that email"})
          }
          user.resetToken = token
          user.expireToken = Date.now() + 3600000
          user.save().then((result)=>{
              transporter.sendMail({
                  to:user.email,
                  from:"no.reply.socialgram@gmail.com",
                  subject:"Password Reset",
                  html:`
                  <p>You requested for password reset</p>
                  <h5>Click in this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h5>
                  `
              })
              res.json({message:"Check your email"})
          })
      })
  })
})
router.post('/new-password',(req,res)=>{
 const newPassword = req.body.password
 const sentToken = req.body.token
 User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
 .then(user=>{
     if(!user){
         return res.status(422).json({error:"Try again session expired"})
     }
     bcrypt.hash(newPassword,12).then(hashedpassword=>{
        user.password = hashedpassword
        user.resetToken = undefined
        user.expireToken = undefined
        user.save().then((saveduser)=>{
            res.json({message:"Password Updated Successfully"})
        })
     })
 }).catch(err=>{
     console.log(err)
 })
})

module.exports = router