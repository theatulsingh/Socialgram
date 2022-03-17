const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const {MONGOURI} = require('./config/keys')

const cors = require('cors')
require('./Models/user.js')
require('./Models/post.js')
require('./Models/conversations.js')
require('./Models/message.js')

// const http = require('http');
// app.set('port', port);

app.use(cors())
app.use(express.json());
app.use(require('./Routes/auth.js'))
app.use(require('./Routes/post.js'))
app.use(require('./Routes/user.js'))
app.use(require('./Routes/conversations.js'))
// const server = http.createServer(app);
// const io = require('socket.io')(server);
// let users = []
// const addUser = (userId, socketId) => {
//     !users.some((user) => user.userId === userId) &&
//     users.push({ userId, socketId });
// };
// const removeUser = (socketId) => {
//     users = users.filter((user) => user.socketId !== socketId);
// }; 
// const getUser = (userId) => {
//     return users.find((user) => user.userId === userId);
// };
// io.on("connection", (socket) => {
//     console.log("Connect to socketio")
//     socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//     })

//     socket.on("sendMessage", ({ senderid, receiverId, text }) => {
//         const user = getUser(receiverId);
//         io.to(user.socketId).emit("getMessage", {
//             senderid,
//             text,
//         });
//     });
    
//     socket.on("disconnect", () => {
//         removeUser(socket.id);
//         io.emit("getUsers", users);
//   });
// })

mongoose.connect(MONGOURI,{
    useNewUrlParser: true,
})
mongoose.connection.on("connected",()=>{
    console.log("Database connected")
})
mongoose.connection.on("error",(err)=>{
    console.log("Error connecting",err);
})

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

// httpServer.listen(port);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

// server.listen(app.get('port'),()=>{
//     console.log('Express server listening on port ' + app.get('port'));
//   });