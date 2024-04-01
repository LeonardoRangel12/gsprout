const connectToRedis = require("../configurations/redis.configuration");
const getCache = async (key) => {
  // const redisKey = await cryptojsUtil.hashText(key);
  const redisKey = key;
  const redisConnection = await connectToRedis();
  const res = await new Promise((resolve, reject) => {
    redisConnection.get(redisKey, (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
  return res;
};

const setCache = async (key, data, expiration = 3600) => {
  // const redisKey = await cryptojsUtil.hashText(key);
  const redisConnection = await connectToRedis();
  const redisKey = key;
  redisConnection.setEx(redisKey, expiration, JSON.stringify(data));
};

const deleteCache = async (key) => {
  const redisConnection = await connectToRedis();
  // const redisKey = await cryptojsUtil.hashText(key);
  const redisKey = key;
  redisConnection.del(redisKey);
};

module.exports = { getCache, setCache, deleteCache };
