require("dotenv").config();
const { MongoClient } = require("mongodb");
const _url = process.env.MONGODB_URI;
const _database = process.env.MONGODB_DATABASE_NAME;
const client = new MongoClient(_url);

async function dbConnectionWrapper(functionWrapped) {
  await client.connect();
  dbCon = client.db(_database, { useUnifiedTopology: true });
  const result = await functionWrapped(dbCon);
  await client.close();
  return result;
}

async function createUsuario(data) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon.collection("users").insertOne(data);
    return result;
  });
  return result;
}

async function getUsuarios() {
  usuarios = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon.collection("users").find().toArray();
    return result;
  });
  return usuarios;
}

async function getUsuarioById(userEmail) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const userFound = await dbCon
      .collection("users")
      .findOne({ email: userEmail });

    return userFound;
  });
  return result;
}

async function updateUsuario(userEmail, data) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const updateFields = { $set: data };
    const result = await dbCon
      .collection("users")
      .updateOne({ email: userEmail }, updateFields);

    return result;
  });
  return result;
}

async function deleteUsuario(userEmail) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon
      .collection("users")
      .deleteOne({ email: userEmail });

    return result;
  });
  return result;
}

async function createJuego(data) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon.collection("games").insertOne(data);
    return result;
  });
  return result;
}

async function getJuegos() {
  juegos = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon.collection("games").find().toArray();
    return result;
  });
  return juegos;
}

async function getJuegoById(juegoId) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const juegoFound = await dbCon
      .collection("games")
      .findOne({ id: juegoId });
    return juegoFound;
  });
  return result;
}

async function updateJuego(juegoId, data) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const updateFields = { $set: data };
    const result = await dbCon
      .collection("games")
      .updateOne({ id: juegoId }, updateFields);
    return result;
  });
  return result;
}

async function deleteJuego(juegoId) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const result = await dbCon.collection("games").deleteOne({ id: juegoId });
    return result;
  });
  return result;
}

async function getJuegoByName(juegoName) {
  const result = await dbConnectionWrapper(async (dbCon) => {
    const juegoFound = await dbCon
      .collection("games")
      .findOne({ name: juegoName });
    return juegoFound;
  });
  return result;
}

module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  createJuego,
  getJuegos,
  getJuegoById,
  updateJuego,
  deleteJuego,
  getJuegoByName
};
