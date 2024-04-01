  if (process.env.NODE_ENV === "production") {
    const { createClient } = require("redis");
    const connectToRedis= async()=>{
      const client = createClient({
        url: "redis://127.0.0.1:6379"
      })

      client.on("error", (error) => {
        console.error(error);
      });

      await client.connect();
      console.log("Connected to Redis");
      return client;
    }
    module.exports = connectToRedis;

  }

  if (process.env.NODE_ENV === "development") {
    const connectToRedis = async () => {
      const { createClient } = require("redis-mock");
      const client = createClient();
      // Polyfill for setEx
      client.setEx = client.setex;
      return client;
    }
    module.exports = connectToRedis;

  }
