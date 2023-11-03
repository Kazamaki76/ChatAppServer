const express = require("express");
const app = express();
const PORT = 4000;

// Import the HTTP and the CORS library to allow data transfer between the client and the server domains.
const http = require("http").Server(app);
const cors = require("cors");

// Import socketIO
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
app.use(cors());

let users = [];

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data) => {
    socketIO.emit("messageResponse", data);
  });
  socket.on("typing",(data) => socket.broadcast.emit("typingResponse", data))


  //  Lister when a new user  join the server
  socket.on("newUser", (data) => {
    // add new user to the list of users
    users.push(data)
    // console.log(users)
    // Send the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    // Update the kust if ysers when a user disconnect from the server
    users = users.filter((user) => user.socketID !== socket.id);
    // console.log(users)
    // Send the list of users to the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
