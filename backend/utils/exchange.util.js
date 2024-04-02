const axios = require('axios');
const getExchange = async (from = "USDT", to = "SOL") => {
    const options = {
        method: 'GET',
        url: `https://crypto-and-forex-rates.p.rapidapi.com/api/exchange/${from}/${to}/1/1/1/3`,
        headers: {
          'X-RapidAPI-Key': '039c2fc7e8msh483a1607d2f72b7p19a785jsn2311317d30ee',
          'X-RapidAPI-Host': 'crypto-and-forex-rates.p.rapidapi.com'
        },
        timeout: 5000
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        // return null;
        return {buy: 200};
    }
}
module.exports = {getExchange};