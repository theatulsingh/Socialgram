const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requirelogin')
const Conversation = mongoose.model("Conversation")
const Message = mongoose.model("Message")
const User = mongoose.model("user")
router.post('/conversation/:recieverid',requirelogin,(req,res)=>{
    const newConversation = new Conversation({
        members:[req.user._id.toString(), req.params.recieverid]
    })
    newConversation.save().then(newconversation=>{
        res.status(200).json({message:"successful!"});
      }).catch(error=>{
        console.log(error)
      })
})
router.post('/message',requirelogin,(req,res)=>{
    const newmessage = new Message(req.body) 
    newmessage.save().then(newmessage=>{
        res.json(newmessage);
      }).catch(error=>{
        console.log(error)
      })
})
router.get("/getconversation/:recieverid",requirelogin,(req,res)=>{
    Conversation.find({members:{$all:[req.user._id.toString(), req.params.recieverid]}})
    .then(con=>{
        return res.json(con)
    })
    .catch(err=>{
        return res.status(422).json({error:err})
    })
})
router.get('/getmessage/:convoid',requirelogin,(req,res)=>{
        Message.find({conversationid:req.params.convoid.toString()})
        .then(messages=>{
            return res.json(messages)
        })
        .catch(err=>{
            return res.status(422).json({error:err})
        })
})

module.exports = router;