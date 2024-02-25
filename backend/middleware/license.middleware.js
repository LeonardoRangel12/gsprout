const juegoService = require('../services/juego.service.js');
const licenseComponent = require('../components/license.component.js');
const generateLicense = async function (req,res,next) {
    /*
    * Generate a license for the game after the payment is verified

    */

    const juego = res.locals.juego;
    // Generate the license
    // const license = await licenseComponent.generateLicense(juego.regexLicense);
    const license = await licenseComponent.generateLicense("[a-z]{5}-[0-9]{5}-[A-Z]{5}");
    if(!license){
        return res.status(500).send("Error al generar la licencia");
    }
    // Set the license in the response for the next middleware
    res.locals.license = license;

    next();
}

module.exports = {
    generateLicense,
};