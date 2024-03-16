const client = require('../configurations/redis.configuration');
const bcryptUtil = require('../utils/bcrypt.util');

const getCache = (req, res, next) => {
    const {key} = req.redis;
    const redisKey = bcryptUtil.hashText(key);

    client.get(redisKey, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

const setCache = (req, res, next) => {
    const {key, data, status} = req.redis;
    const redisKey = bcryptUtil.hashText(key);
    client.setEx(redisKey, 3600, JSON.stringify(data));
    
    return res.json(data).status(status || 200);

};

const deleteCache = (req, res, next) => {
    const {key, data, status} = req.redis;
    const redisKey = bcryptUtil.hashText(key);
    client.del(redisKey);

    return res.json(data).status(status || 200);
};
module.exports = { getCache, setCache, deleteCache };