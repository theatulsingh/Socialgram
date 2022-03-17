const mongoose=require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    resetToken:{type:String},
    expireToken:{
        type:Date},
    pic:{
        type: String,
        default:"https://res.cloudinary.com/theatulsinghk/image/upload/v1638706287/download_kyzd9t.png"
    },
    followers:[{type:ObjectId,ref:"user"}],
    following:[{type:ObjectId,ref:"user"}]
})
mongoose.model("user",userSchema)