const publicacionesSchema = require("../../shared/models/publicaciones.model");
const publicacionesService = require("../services/publicaciones.service");

const getPublicaciones = async (req, res) => {
    try {
        const publicaciones = await publicacionesService.getPublicaciones();
        return res.status(200).send(publicaciones);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
};

const getPublicacionById = async (req, res) => {
    try {
        const publicacion = await publicacionesService.getPublicacionById(req.params.id);
        if(!publicacion) return res.status(404).send("Publicacion no existe");
        return res.status(200).send(publicacion);
    } catch (error) {
        return res.status(500).send(error);
    }
};

const createPublicacion = async (req, res) => {
    let { error, value } = publicacionesSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }

    try {
        const publicacion = await publicacionesService.createPublicacion(value);
        return res.status(201).send(publicacion);
    } catch (error) {
        return res.status(500).send(error);
    }
}

const updatePublicacion = async (req, res) => {

    try {
        const publicacion = await publicacionesService.updatePublicacion(req.params.id, req.body);
        return res.status(200).send(publicacion);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
};

const deletePublicacion = async (req, res) => {

    if (!await publicacionesService.getPublicacionById(req.params.id)) {
        return res.status(400).send("Publicacion no existe");
    }

    try {
        const publicacion = await publicacionesService.deletePublicacion(req.params.id);
        return res.status(200).send(publicacion);
    } catch (error) {
        return res.status(500).send(error);
    }
};

module.exports = {
    getPublicacionById,
    getPublicaciones,
    createPublicacion,
    updatePublicacion,
    deletePublicacion,
    updatePublicacion
}