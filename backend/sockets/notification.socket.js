const redisUtil = require("../utils/redis.util");
module.exports = (io) => {
    io.on("connection", (socket) => {
        // socket.on("create", (notification) => {
        //     const notifications = redisUtil.getCache(socket.sessionid);
        //     io.emit("notification", notification);
        // });
    });
}