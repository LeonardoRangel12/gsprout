require('dotenv').config();
const {MongoClient} = require( 'mongodb' );
const _url = process.env.MONGODB_URI;
const _database = process.env.MONGODB_DATABASE_NAME;
const client = new MongoClient(_url);

async function dbConnectionWrapper (functionWrapped){
    await client.connect();
    dbCon = client.db(_database, { useUnifiedTopology: true })
    result = await functionWrapped(dbCon)
    await client.close();
    return result;
}

async function createUsuario(data){
    console.log(data)
    result = await dbConnectionWrapper(async (dbCon) => {
        const result = await dbCon.collection("users").insertOne(data)
        return result
    })
    return result;
}

async function getUsuarios(){
    usuarios = await dbConnectionWrapper(async (dbCon) => {
        const result = await dbCon.collection("users").find().toArray()
        return result
    })
    return usuarios;
}

async function getUsuarioById(userEmail){
    console.log(userEmail)
    result = await dbConnectionWrapper(async (dbCon) => {
        const userFound = await dbCon.collection("users").findOne({email: userEmail})
        console.log(userEmail)
        console.log(userFound)
        return userFound
    })
    return result;
}

async function updateUsuario(userEmail, data){
    result = await dbConnectionWrapper(async (dbCon) => {
        const updateFields = { $set: data };
        const result = await dbCon.collection("users").updateOne({ email: userEmail }, updateFields);
        console.log(result)
        return result
    })
    return result;
}

async function deleteUsuario(userEmail){
    result = await dbConnectionWrapper(async (dbCon) => {
        const result = await dbCon.collection("users").deleteOne({ email: userEmail });
        console.log(result)
        return result
    })
    return result;
}

module.exports = {
        createUsuario,
        getUsuarios,
        getUsuarioById,
        updateUsuario,
        deleteUsuario
    };