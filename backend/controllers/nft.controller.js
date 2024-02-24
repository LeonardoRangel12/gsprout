const licenseComponent = require('../components/license.component.js');
const juegoService = require('../services/juego.service.js');


const mintNFT = async function (req, res, next) {
    /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT
    */
    const license = res.locals.license;
    
}

module.exports = {
    generateLicense,
};