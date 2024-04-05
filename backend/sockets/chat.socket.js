const jwtUtil = require("../utils/jwt.util");
module.exports = (io) => {
  io.on("connection", async (socket) => {
    socket.on("login", async (token) => {
      try{
        const  token  = await jwtUtil.verifyToken(token);
        //  Check if the user is already connected to the room
        socket.join(token.username);
        console.log("User connected to chat: ", token.username);
        socket.emit("login", "You are connected to chat");

      }
      catch(err){
        console.log("Invalid token");
        console.log(err);
      }
    });

    socket.on("message", async (data) => {
      try{
        const { to } = data;
        const  token  = await jwtUtil.verifyToken(data.from);
        data.from = token.username;
        io.to(to).emit("message", data);

      }
      catch(err){
        console.log("Invalid token");
        console.log(err);
      }
    });
  });
};
