if (process.env.NODE_ENV === "production") {
  const { createClient } = require("redis");
  const client = createClient()
    .on("error", (err) => {
      console.log("Redis Error: " + err);
    })
    .connect();

  module.exports = client;
}

if (process.env.NODE_ENV === "development") {
  const { createClient } = require("redis-mock");
  const client = createClient();
  // Polyfill for setEx
  client.setEx = client.setex;
  module.exports = client;
}
