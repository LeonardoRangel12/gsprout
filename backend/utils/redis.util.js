const redisConnection = require("../configurations/redis.configuration");
const bcryptUtil = require("../utils/bcrypt.util");
const getCache = async (key) => {
  const redisKey = await bcryptUtil.hashText(key);

  const res = await redisConnection.get(redisKey);

    return res;
};

const setCache = async (key, data) => {
  const redisKey = await bcryptUtil.hashText(key);
  redisConnection.setEx(redisKey, 3600, JSON.stringify(data));
};

const deleteCache = async (key) => {
  const redisKey = await bcryptUtil.hashText(key);
  redisConnection.del(redisKey);
};

module.exports = { getCache, setCache, deleteCache };
