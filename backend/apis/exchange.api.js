
const exchangeUtil = require('../utils/exchange.util');
const getExchange = async (req, res) => {
    try{
            const exchange = await exchangeUtil.getExchange();
            if (!exchange) {
                return res.status(404).send("Exchange not found");
            }
            return res.status(200).send(exchange);    
        

    }
    catch(e){
        return res.status(500);
    }
    
}

module.exports = {getExchange};