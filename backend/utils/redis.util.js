const redisConnection = require("../configurations/redis.configuration");
const cryptojsUtil = require("../utils/cryptojs.util");
const getCache = async (key) => {
  const redisKey = await cryptojsUtil.hashText(key);

  const res = await redisConnection.get(redisKey);

    return res;
};

const setCache = async (key, data, expiration = 3600) => {
  const redisKey = await cryptojsUtil.hashText(key);
  redisConnection.setEx(redisKey, expiration, JSON.stringify(data));
};

const deleteCache = async (key) => {
  const redisKey = await cryptojsUtil.hashText(key);
  redisConnection.del(redisKey);
};

module.exports = { getCache, setCache, deleteCache };
