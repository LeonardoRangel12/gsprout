const client = require("../configurations/redis.configuration");
const cryptojsUtil = require("../utils/cryptojs.util");

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

// const getCache = async (req, res, next) => {
//     const {key} = req.redis;
//     const redisKey = await cryptojsUtil.hashText(key);
//     try{
//         const response = await client.get(redisKey);
//         console.log(redisKey, response);
//         if(response){
//             return res.json(JSON.parse(response)).status(200);
//         }
//         next();

//     }
//     catch(err){
//         console.log(err);
//     }
// };

// const setCache = async (req, res, next) => {

//     const {key, data} = req.redis;
//     const redisKey = await cryptojsUtil.hashText(key);
//     client.setEx(redisKey, 3600, JSON.stringify(data));

//     res.end();
//     // return res.json(data).status(status || 200);

// };

// const deleteCache = async (req, res, next) => {
//     const {key, data, status} = req.redis;
//     const redisKey = await cryptojsUtil.hashText(key);
//     client.del(redisKey);

//     res.end();
//     // return res.json(data).status(status || 200);
// };

const redisUtil = require("../utils/redis.util");
const handleCache = async (req, res, next) => {
  const key = await generateCacheKey(req);
  const { method}= req;

  if (method === "GET") {
    const {toCache} = req;
    // If the request has data it means that the data is being updated
    if(toCache){
        redisUtil.setCache(key, toCache);
        return res.json(toCache).status(200);
    }

    // Gets the cache from the key

    // console.log(key, cache);
    const cache = await redisUtil.getCache(key);
    if (cache && !res.headersSent) {
      console.log("CACHE");
      return res.json(cache).status(200);
    }
    else 
      console.log("NO CACHE");
    // If there is no cache, continue with the request
    next();
  } 
//   When the request is a POST or PUT, the cache is updated
  else if (method === "POST" || method === "PUT") {
    const { data } = req;

    redisUtil.setCache(key, data);
    res.end();
  }
  else if (method === "DELETE") {

    redisUtil.deleteCache(key);
    res.end();
  }
};
const generateCacheKey = (req) => {

  const { method, url, query, params } = req;
  // req.token es definido en el middleware verifySession
  const token = req.token ? req.token.username : null;
  const queryString =
    Object.keys(query).length > 0
      ? `?${Object.keys(query)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}`
      : "";
  const resourceType = url.split("/")[1];
  const resourceId = params.id || null;
  req.key = `${token}:${resourceType}:${resourceId}:${url}${queryString}`;
  return req.key;
};
// module.exports = { getCache, setCache, deleteCache };
module.exports = { handleCache };
