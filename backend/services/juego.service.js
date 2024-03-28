const db = require("../configurations/db.configuration.js");

async function createJuego(data) {
    return await db.createJuego(data);
}

async function getJuegos(page_number){
    console.log("page_number", page_number);
    return await db.getJuegos(page_number);
}
async function getJuegoById(id){
    return await db.getJuegoById(id);
}

async function autocompleteJuegosSearch(query){
    return await db.autocompleteJuegosSearch(query);
}

async function searchJuegos(queryParams){
    return await db.searchJuegos(queryParams);
}

async function updateJuego(id, data){
    return await db.updateJuego(id, data);
}
async function deleteJuego(id){
    return await db.deleteJuego(id);
}

async function getJuegoByName(nombre){
    return await db.getJuegoByName(nombre);
}
async function getJuegosInArray(array) {
    return await db.getJuegosInArray(array);
} 
module.exports = {
    createJuego,
    getJuegos,
    getJuegoById,
    updateJuego,
    deleteJuego,
    getJuegoByName,
    searchJuegos,
    autocompleteJuegosSearch,
     getJuegosInArray
}