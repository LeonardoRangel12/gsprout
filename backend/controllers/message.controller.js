const messageSchema = require('../models/message.model.js');
const messageService = require('../services/message.service.js');

const SendMessage = async (req, res) => {
    let {error, value} = messageSchema.validate(req.body);
    if (error) {
        return res.status(400).send(error.details);
    }
    try{
        const message = await messageService.SendMessage(value);
        return res.status(201).send(message);
    }catch(error){
        return res.status(500).send(error);
    }
};
const GetMessages = async (req, res) => {
    try{
        const messages = await messageService.GetMessages();
        return res.status(200).send(messages);
    }catch(error){
        return res.status(500).send(error);
    }
};
const GetMessageById = async (req, res) => {   
    try{
        const message = await messageService.GetMessageById(req.params.id);
        return res.status(200).send(message);
    }catch(error){
        return res.status(500).send(error);
    }
};
const GetMessageBySender = async (req, res) => {
    try{
        const message = await messageService.GetMessageBySender(req.params.sender);
        return res.status(200).send(message);
    }
    catch(error){
        return res.status(500).send(error);
    }
};
const GetMessageByReceiver = async (req, res) => {
    try{
        const message = await messageService.GetMessageByReceiver(req.params.receiver);
        return res.status(200).send(message);
    }catch(error){
        return res.status(500).send(error);
    }
};

module.exports = { 
    SendMessage,
    GetMessages,
    GetMessageById,
    GetMessageBySender,
    GetMessageByReceiver,
};