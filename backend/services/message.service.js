const db = require("../configurations/db.configuration.js");

async function SendMessage(data){
    return await db.SendMessage(data);
}
async function GetMessages(){
    return await db.GetMessages();
}
async function GetMessageById(id){
    return await db.GetMessageById(id);
}
async function GetMessageBySender(sender){
    return await db.GetMessageBySender(sender);
}
async function GetMessageByReceiver(receiver){
    return await db.GetMessageByReceiver(receiver);
}
module.exports = {
    SendMessage,
    GetMessages,
    GetMessageById,
    GetMessageBySender,
    GetMessageByReceiver,
}