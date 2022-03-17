const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const postSchema = new mongoose.Schema({
     caption:{
         type: String
        },
     photo:{
         type: String,
         required:true
     },
     postedby:{
         type: ObjectId,
         ref:"user"
     },
     likes:[{
        type: ObjectId,
         ref:"user"
     }],
     comments:[{
         text:String,
         postedby:{
             type:ObjectId,
             ref:"user"
         }
     }]
 },{timestamps:true})
 mongoose.model('Post',postSchema)