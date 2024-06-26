const messageSchema = require("../models/chat.model.js");
const messageService = require("../services/chat.service.js");
const usuarioService = require("../services/usuario.service.js");
const SendMessage = async (req, res) => {
  try {
    let { error, value } = messageSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details);
    }
    const usuario = await usuarioService.getUsuarioByUsername(value.to);
    if (!usuario) return res.status(404).send("Usuario no existe");

    const message = await messageService.SendMessage(value);
    return res.status(201).send(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const GetMessages = async (req, res) => {
  try {
    const messages = await messageService.GetMessages();
    return res.status(200).send(messages);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const GetMessageById = async (req, res) => {
  try {
    const message = await messageService.GetMessageById(req.params.id);
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const GetMessageBySender = async (req, res) => {
  try {
    const message = await messageService.GetMessageBySender(req.params.sender);
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const GetMessageByReceiver = async (req, res) => {
  try {
    const message = await messageService.GetMessageByReceiver(
      req.params.receiver
    );
    return res.status(200).send(message);
  } catch (error) {
    return res.status(500).send(error);
  }
};
const GetChat = async (req, res) => {
  try {
    const { user1 } = req.params;
    const { username: user2 } = req.token; //From token
    let page_number = 1;
    if (
      req.query.page_number &&
      parseInt(req.query.page_number) > 0 &&
      !isNaN(parseInt(req.query.page_number))
    ) {
      page_number = req.query.page_number;
    }
    const message = await messageService.GetChat(user1, user2, page_number);
    return res.status(200).send(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const GetChats = async (req, res) => {
  try {
    const { username } = req.token;
    let page_number = 1;
    if (
      req.query.page_number &&
      parseInt(req.query.page_number) > 0 &&
      !isNaN(parseInt(req.query.page_number))
    ) {
      page_number = req.query.page_number;
    }
    const message = await messageService.GetChats(username, page_number);
    return res.status(200).send(message);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
module.exports = {
  SendMessage,
  GetMessages,
  GetMessageById,
  GetMessageBySender,
  GetMessageByReceiver,
  GetChat,
  GetChats,
};
