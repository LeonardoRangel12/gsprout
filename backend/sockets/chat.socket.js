const jwtUtil = require("../utils/jwt.util");
module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("login", async (token) => {
      const { username } = jwtUtil.verifyToken(token);
      //  Check if the user is already connected to the room
      console.log("connected to room", username);
      socket.join(username);
      socket.emit("login", "You are connected to chat");
    });

    socket.on("message", async (data) => {
      const { to } = data;
      const { username } = jwtUtil.verifyToken(data.from);
      data.from = username;
      io.to(to).emit("message", data);
    });
  });
};
