const deseadosSchema = require("../models/deseados.model");
const usuarioService = require("../services/usuario.service");
const juegoService = require("../services/juego.service");
const deseadosService = require("../services/deseados.service");
const bcryptUtil = require("../utils/bcrypt.util");

const addToDeseados = async (req, res) => {
    if(!await usuarioService.getUsuarioById(req.params.idusuario)){
        return res.status(400).send("Usuario no existe");
    }
    if(!await juegoService.getJuegoById(req.params.idjuego)){
        return res.status(400).send("Juego no existe");
    }
    try {
        const deseados = await deseadosService.addToDeseados(req.params.idusuario, req.params.idjuego);
        return res.status(201).send(deseados);
    } catch (error) {
        return res.status(500).send(error);
    }
}


module.exports = {
    addToDeseados,
    getDeseados,
    deleteDeseados
}