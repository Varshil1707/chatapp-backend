const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config();
const portDemo =  process.env.PORT;
const app = express();
const port = portDemo;
const server = http.createServer(app);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Its Working");
});
const users = [];
const io = socketIo(server);
let message = "left"
io.on("connection", (socket) => {
  console.log("New Connection");
  socket.on('disconnect',()=>
    {
      console.log("disconnected")
      socket.broadcast.emit('disconnect-method', message )
    }
  )

  socket.on("joined", ({ user }) => {
    
    users[socket.id] = user;
    console.log(`${user} is  joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `Welcome to the chat ${user}`,
    });

    socket.emit("welcome", { user: "Admin", message: "Welcome to the chat" });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sentMessage", { user: users[id], message: message, id });
  });

});

if (process.env.PORT == "production") {
  app.use(express.static("cchat/build"));
}

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
