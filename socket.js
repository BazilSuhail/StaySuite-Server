const { Server } = require("socket.io");

let io;
const connectedUsers = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.auth;

    if (userId) {
      connectedUsers.set(userId, socket.id);
      //console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);
    } else {
      console.log("No userId provided during connection.");
    }

    socket.on("disconnect", () => {
      for (const [key, value] of connectedUsers.entries()) {
        if (value === socket.id) {
          connectedUsers.delete(key);
          console.log(`User disconnected: ${key}`);
          break;
        }
      }
    });
  });

};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
};

const sendMessageToUser = (userId, message) => {
  const socketId = connectedUsers.get(userId);
  
  //console.log("Connected Users:", Array.from(connectedUsers.entries()));

  if (socketId) {
    io.to(socketId).emit("notification", message);
    //console.log(`Message sent to user ${userId}:`, message);
  } else {
    console.log(`User ${userId} is not connected.`);
  }
};

module.exports = { initSocket, getIo, sendMessageToUser };
