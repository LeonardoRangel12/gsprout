  if (process.env.NODE_ENV === "production") {
    const { createClient } = require("redis");
    createClient({
      url: 'redis://127.0.0.1:6379'
    })
      .on("error", (err) => {
        console.log("Redis Error: " + err);
      })
      .connect().then((client) => {
        module.exports = client;});

  }

  if (process.env.NODE_ENV === "development") {
    const { createClient } = require("redis-mock");
    const client = createClient();
    // Polyfill for setEx
    client.setEx = client.setex;
    module.exports = client;
  }
