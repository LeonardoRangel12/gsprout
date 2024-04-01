const db = require("../configurations/db.configuration.js");
const {io} = require("../app");
async function SendMessage(data){
    const {from, to, content} = data;
    data.timestamp = Date.now();
    const res = await db.SendMessage(data);
    await io.to(to).emit("message", data);
    console.log("ENVIADO " , to);
    return res;
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
async function GetChat(user1, user2,page_number){
    return await db.GetChat(user1, user2, page_number);
}
async function GetChats(username, page_number){
    return await db.GetChats(username, page_number);
}
module.exports = {
    SendMessage,
    GetMessages,
    GetMessageById,
    GetMessageBySender,
    GetMessageByReceiver,
    GetChat,
    GetChats
}