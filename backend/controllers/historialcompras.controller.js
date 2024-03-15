const historialComprasSchema = require("../../shared/models/historialcompras.model");
const historialComprasService = require("../services/historialcompras.service");

//Creacion de historial de compras
const createHistorialCompra = async (req, res) => {
    let { error, value } = historialComprasSchema.validate(req.body);
    if (error) {
        //Si hay un error en la validacion
        return res.status(400).send(error.details);
    }
    if (createHistorialCompra.getHistorialCompraById(value.id)) {
        //Niega la creacion si este existe
        return res.status(400).send("Historial de compra existe");
    }
    try {
        const historialCompra = await historialComprasService.createHistorialCompra(value);
        req.name = historialCompra;
        return res.status(201).send(historialCompra);
    } catch (error) {
        return res.status(500).send(error);
    }
}
const getHistorialCompras = async (req, res) => {
    try {
        const historialCompra = await historialComprasService.getHistorialCompras();
        return res.status(200).send(historialCompra);
    }
    catch(error){
        return res.status(500).send(error);
    }
}
const getHistorialCompraById = async (req, res, next) => {
    try {
        const historialCompra = await historialComprasService.getHistorialCompraById(req.params.id);
        if(!historialCompra) return res.status(404).send("Historial de compra no existe");
        req.data = historialCompra;
        next();
        // return res.status(200).send(historialCompra);
    }
    catch(error){
        return res.status(500).send(error);
    } 
}
const updateHistorialCompra = async (req, res) => {
    let { error, value } = historialComprasSchema.validate(req.body);
    if (error) {
        //Si hay un error en la validacion
        return res.status(400).send(error.details);
    }
    try {
        const historialCompra = await historialComprasService.updateHistorialCompra(req.params.id, value);
        return res.status(200).send(historialCompra);
    } catch {
        return res.status(500).send(error);
    }
}
module.exports = {
    createHistorialCompra,
    getHistorialCompras,
    getHistorialCompraById,
    updateHistorialCompra
}