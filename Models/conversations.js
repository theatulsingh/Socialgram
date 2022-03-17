const mongoose = require('mongoose')
const conversationSchema = new mongoose.Schema({
    members: {
        type: Array,
      },  
 },{timestamps:true})
 mongoose.model('Conversation',conversationSchema)