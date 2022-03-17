const {EMAIL} = require('../config/keys')
const port = process.env.PORT || 8900
const io = require("socket.io")(port, {
    cors: {
      origin: EMAIL,
    },
  });
let users = []
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
}; 
const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
    console.log("connectedssls")
    socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
    })

    socket.on("sendMessage", ({ senderid, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit("getMessage", {
            senderid,
            text,
        });
    });
    
    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
  });
})



