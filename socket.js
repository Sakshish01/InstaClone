const http = require("http");
const socketIO = require("socket.io");
const {Server} = socketIO;
const cors = require("cors");
const express = require("express");

const app = express();


const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin: '*',
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  //sending message event
  socket.on("send-message", (data) => {
    console.log(data);
    // socket.to(data.recipient).emit("receive-message", data);
  });
  

  socket.on("disconnect", () => {
    console.log('A user has left', socket.id);
  })

});

module.exports =  { app, io, server};