const compraschema = require('../models/compra.model');
const compraservice = require('../services/compra.service');

const createCompra = async (req, res) => {
    let { error, value } = compraschema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    if (createCompra.getCompraById(value.id)) {
        return res.status(400).send("Compra existe");
    }
    try {
        const compra = await compraservice.createCompra(value);
        req.name = compra;
        return res.status(201).send(compra);
    } catch (error) {
        return res.status(500).send(error);
    }
}
const getCompraById = async (req, res) => {
    try {
        const compra = await compraservice.getCompraById(req.params.id);
        return res.status(200).send(compra);
    }
    catch (error) {
        return res.status(500).send(error);
    }
}
const updateCompra = async (req, res) => {  
    let {error,value} = compraschema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    try {
        const compra = await compraservice.updateCompra(req.params.id, value);
        return res.status(200).send(compra);
    } catch(error) {
        return res.status(500).send(error);
    }
}
module.exports = {
    createCompra,
    getCompraById,
    updateCompra
}