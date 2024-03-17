const client = require('../configurations/redis.configuration');
const cryptojsUtil = require('../utils/cryptojs.util');

/*
    * getCache: Middleware que obtiene el cache de la base de datos
    * setCache: Middleware que guarda el cache en la base de datos
    * deleteCache: Middleware que elimina el cache en la base de datos
    * 
    * req.redis: {
    *  key: String,
    * data: Object to store in redis and return to the client,
    * status: status code to return to the client
    * }
*/

const getCache = async (req, res, next) => {
    const {key} = req.redis;
    
    const redisKey = await cryptojsUtil.hashText(key);
    try{
        const response = await client.get(redisKey);
        if(response){
            return res.json(JSON.parse(response)).status(200);
        }
        next();

    }
    catch(err){
        console.log(err);
    }
};

const setCache = async (req, res, next) => {

    const {key, data, status} = req.redis;
    const redisKey = cryptojsUtil.hashText(key);
    client.setEx(redisKey, 3600, JSON.stringify(data));
    
    return res.json(data).status(status || 200);

};

const deleteCache = async (req, res, next) => {
    const {key, data, status} = req.redis;
    const redisKey = cryptojsUtil.hashText(key);
    client.del(redisKey);

    return res.json(data).status(status || 200);
};
module.exports = { getCache, setCache, deleteCache };