const db = require("../configurations/db.configuration.js");

async function createHistorialCompra(data) {
    return await db.createHistorialCompra(data);
}
async function getHistorialCompras(idusuario){
    return await db.getHistorialCompras();
}
async function getHistorialCompraById(id){
    return await db.getHistorialCompraById(id);
}
async function updateHistorialCompra(id, data){
    return await db.updateHistorialCompra(id, data);
}
module.exports = {
    createHistorialCompra,
    getHistorialCompras,
    getHistorialCompraById,
    updateHistorialCompra
}