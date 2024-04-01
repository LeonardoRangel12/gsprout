const jwtUtil = require("../utils/jwt.util");
module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("login", async (token) => {
      const { username } = await jwtUtil.verifyToken(token);
      //  Check if the user is already connected to the room
      socket.join(username);
      clg("User connected to chat: ", username);
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
