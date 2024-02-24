const juegoService = require('../services/juego.service.js');
const generateLicense = async function (req,res,next) {
    /*
    * Generate a license for the game after the payment is verified

    */
    // Get the juego
    const juego = await juegoService.getJuegoById(res.locals.id);
    if (!juego) {
        return res.status(404).send("Juego no encontrado");
    }

    // Generate the license
    const license = await licenseComponent.generateLicense(juego);
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