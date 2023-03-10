const http = require("http");
const express = require("express");
// const authRoutes = require("./authentication");
const cors = require("cors");
const socketIo = require("socket.io");
require("dotenv").config();
const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Its Working");
});
const users = [];
const io = socketIo(server);
let message = "left";

io.on("connection", (socket) => {
  // console.log(socket)
  console.log("New Connection");
  socket.emit("clientsCount", { count: io.engine.clientsCount });
  socket.on("clientsCount-again",(data)=>{
    socket.emit("updated-clientsCount",{updatedCount : io.engine.clientsCount })
  })
  console.log("Line 26", io.engine.clientsCount);
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} is  joined`);
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `Welcome to the chat ${user}`,
      clientCount: io.engine.clientsCount,
    });

    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat ${user} `,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sentMessage", {
      user: users[id],
      message: message,
      id,
      // clientCount: io.engine.clientsCount,
    });
  });
});

if (process.env.PORT == "production") {
  app.use(express.static("chat/build"));
}

// app.use("/", authRoutes);

server.listen(port, () => {
  console.log(`server is working on http://localhost:${port}`);
});
