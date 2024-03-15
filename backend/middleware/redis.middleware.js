const client = require('../configurations/redis.configuration');


const getCache = (req, res, next) => {
    const key = req.originalUrl;

    client.get(key, (err, data) => {
        if (err) throw err;

        if (data !== null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
};

const setCache = (req, res, next) => {
    const key = req.originalUrl;
    const data = req.data;
    client.setEx(key, 3600, JSON.stringify(data));
    
    return res.json(data);

};

module.exports = { getCache, setCache };