const db = require("../configurations/db.configuration.js");

async function createCompra(data) {
    return await db.createCompra(data);
}
async function getCompraById(id){
    return await db.getCompraById(id);
}
async function updateCompra(id, data){
    return await db.updateCompra(id, data);
}
module.exports = {
    createCompra,
    getCompraById,
    updateCompra
}