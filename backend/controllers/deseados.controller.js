const deseadosSchema = require("../../shared/models/deseados.model");
const usuarioService = require("../services/usuario.service");
const juegoService = require("../services/juego.service");
const deseadosService = require("../services/deseados.service");
const bcryptUtil = require("../utils/bcrypt.util");

const addToDeseadosByUsuario = async (req, res) => {
    if(!await usuarioService.getUsuarioById(req.params.idusuario)){
        return res.status(400).send("Usuario no existe");
    }
    if(!await juegoService.getJuegoById(req.params.idjuego)){
        return res.status(400).send("Juego no existe");
    }
    try {
        const deseados = await deseadosService.addToDeseados(req.params.idusuario, req.params.idjuego);
        if(deseados instanceof Error){
            return res.status(500).send(deseados.message);
        }
        return res.status(201).send(deseados);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const getDeseadosByUsuario = async (req, res, next) => {
    try {
        const deseados = await deseadosService.getDeseadosByUsuario(req.params.idusuario);
        // To redis
        req.data = deseados;
        next();
    } catch {
        return res.status(500).send("Internal Server Error");
    }
};

const deleteJuegoOfDeseados = async (req, res) => {
    try {
        const deseados = await deseadosService.deleteJuegoOfDeseados(req.params.idusuario, req.params.idjuego);
        return res.status(200).send(deseados);
    } catch {
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    addToDeseadosByUsuario,
    getDeseadosByUsuario,
    deleteJuegoOfDeseados
}