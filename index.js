const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIo = require("socket.io");
 require('dotenv').config();

const app = express();
const port =   process.env.PORT ; //when we host online this whatever the port is it, it will take that
const server = http.createServer(app);
app.use(cors()); //for communicating between the URL

app.get("/", (req, res) => {
  res.send("Its Working");
});
const users = [];
const io = socketIo(server); // here we made a connection

io.on("connection", (socket) => {
  
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user; //user will be stored at socket.
    console.log(`${user} is  joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `Welcome to the chart ${user}`,
    });
    //broadcast means message will be sent to all the user except the person himself
    //As soon as the circuit on this will be console ... for example(xyz user has joined in WP)
    socket.emit("welcome", { user: "Admin", message: "Welcome to the chat" });
  });

  socket.on("message", ({ message, id }) => {
    
    io.emit("sentMessage", { user: users[id], message: message, id }); //Here we use io.on because we need to show the message to all the user including the sender
  });

  socket.on("disconnected", () => {
    socket.broadcast.emit("leave", { user: "Admin", message: "User Left" });
    console.log("user left");
  });
});

if (process.env.PORT == "production") {
  app.use(express.static("cchat/build"));
}

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
