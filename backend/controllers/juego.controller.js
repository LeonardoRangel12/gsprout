const { restart } = require('nodemon');
const juegoSchema = require('../models/juego.model');
const juegoService = require('../services/juego.service');

//Creacion de juegos
const createJuego = async(req,res)=>{
    let {error,value} = juegoSchema.validate(req.body);
    if(error){//Si hay un error en la validacion
        return res.status(400).send(error.details);
    }
    if(createJuego.getJuegoById(value.id)){//Niega la creacion si este existe
        return res.status(400).send("Juego existe");
    }
    try{
        const juego = await juegoService.createJuego(value);
        req.name = juego;
        res.status(201).send(juego);
    } catch (error){
        res.status(500).send(error);
    }
};

//Obtencion de juegos
const getJuegos = async(req,res)=>{
    try{
        const juegos = await juegoService.getJuegos();
        res.status(200).send(juegos); 
    } catch{
        res.status(500).send(error);
    }
}

//Obtencion de juego por id
const getJuegoById = async(req,res)=>{
    try{
        const juego = await juegoService.getJuegoById(req.params.id);
        res.status(200).send(juego);
    } catch{
        res.status(500).send(error);   
    }
}

//Actualizar juego
const updateJuego = async(req,res)=>{
    let {error,value} = juegoSchema.validate(req.body);
    if(error){//Si hay un error en la validacion
        return res.status(400).send(error.details);
    }
    try{
        const juego = await juegoService.updateJuego(req.params.id,value);
        res.status(200).send(juego);
    } catch{
        res.status(500).send(error);
    }
}

//Eliminar juego
const deleteJuego = async(req,res)=>{
    try{
        const juego = await juegoService.deleteJuego(req.params.id);
        res.status(200).send(juego);
    }catch{
        res.status(500).send(error);
    }
    
}

module.exports = {
    createJuego,
    getJuegos,
    getJuegoById,
    updateJuego,
    deleteJuego
}