const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

//message from every client to the server about a new connection
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  //send a message to the current new user
  socket.emit("message", "Hello client!");

  //send a message for all users beside the user tht just connected
  socket.broadcast.emit("message", "A new user has joined!");

  //Listen to messages from the client and send that message to all
  socket.on("clientMessage", (message, sendAck) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return sendAck("Profanity is not allowed");
    }
    io.emit("message", message);
    sendAck();
  });

  //Listen to disconnect from the client and send that message to all
  socket.on("disconnect", () => {
    io.emit("message", "A user has left!");
  });

  //Listen to location from the client and send it to all
  socket.on("sendLocation", (coords, callback) => {
    socket.broadcast.emit(
      "locationMessage",
      `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
    );
    callback();
  });
});

server.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
