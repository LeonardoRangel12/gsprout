const axios = require('axios');
const getExchange = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://crypto-and-forex-rates.p.rapidapi.com/api/exchange/SOL/USDT/1/1/1/3',
        headers: {
          'X-RapidAPI-Key': '76a699302amsh2331ae6790adb61p1224cfjsnb665e672f660',
          'X-RapidAPI-Host': 'crypto-and-forex-rates.p.rapidapi.com'
        }
    };
    try {
        const response = await axios.request(options);
        return res.status(200).send(response.data);
    } catch (error) {
        return res.status(500).send(error);
    }
}

module.exports = {getExchange};