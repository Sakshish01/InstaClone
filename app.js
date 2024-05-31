const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const {Server} = socketIO;
const userRoutes = require("./routes/usersRoutes");
const postRoutes = require("./routes/postsRoutes");
const storyRoutes = require("./routes/storyRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/instadb");

const app = express();


require("dotenv").config(); //dotenv config
app.use(express.json());
app.use(cors({
    origin: '*' 
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin: '*',
    methods: ["GET", "POST"]
  }
});

// Maintain a mapping of user IDs to socket IDs
const userSockets = {};

io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Set user ID mapping
  socket.on('set-user-id', (userId) => {
    // Store the socket ID associated with the user ID
    userSockets[userId] = socket.id;
    console.log('UserSockets: ', userSockets);
    console.log("Hello", userId);
  });

  

  // sending message event
  socket.on("send-message", (data) => {
    console.log('Dta',data);
    // socket.to(data.recipient).emit("receive-message", data);

    // Get the recipient's socket ID from the mapping recipient
    console.log('Mapped users: ',userSockets)
    const recipientSocketId = userSockets[data.recipient];
    console.log('recieverrrrrr: ', recipientSocketId)
    if (recipientSocketId) {
      // Emit the receive-message event only to the recipient's socket
      io.to(recipientSocketId).emit("receive-message", data.message);
      console.log('message sent to', recipientSocketId)
    } else {
      console.log(`Recipient with ID ${data.recipient} is not online.`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

});


// Start the server
const PORT = process.env.PORT || 8000;

// Change 'localhost' to your machine's IP address
const IP_ADDRESS = '192.168.205.131'; // Example IP address

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://${IP_ADDRESS}:${PORT}`);
});

app.get("/", (req, res) => {
    res.send("API is running..");
});
//user routes
app.use('/api/users', userRoutes);

//post routes
app.use('/api/posts', postRoutes);

//activity controller routes
app.use('/api/story', storyRoutes);

//message/ conversation routes 
app.use('/api', messageRoutes);

//test routes
// app.use('/api/test', testRoutes)