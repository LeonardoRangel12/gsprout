require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const _url = process.env.MONGODB_URI;
const _database = process.env.MONGODB_DATABASE_NAME;

const connection = new MongoClient(_url);
const dbCon = connection.db(_database, { useUnifiedTopology: true });

async function createUsuario(data) {
  const result = await dbCon.collection("users").insertOne(data);
  return result;
}

async function getUsuarios() {
  const result = await dbCon.collection("users").find().toArray();
  return result;
}

// async function getUsuarioByEmail(userEmail) {
//   const result = await dbConnectionWrapper(async (dbCon) => {
//     const userFound = await dbCon
//       .collection("users")
//       .findOne({ email: userEmail });

//     return userFound;
//   });
//   return result;
// }
async function getUsuarioByPublicKey(publicKey) {
  const userFound = await dbCon.collection("users").findOne({
    wallets: {
      $in: [publicKey],
    },
  });

  return userFound;
}
async function getUsuarioByUsername(username) {
  const userFound = await dbCon.collection("users").findOne({
    username,
  });

  return userFound;
}
async function loginUsuario(username, publicKey) {
  const userFound = await dbCon.collection("users").findOne({
    username,
    wallets: {
      $in: [publicKey],
    },
  });

  return userFound;
}

async function getUsuarioById(email) {
  const userFound = await dbCon.collection("users").findOne({ email });

  return userFound;
}

async function updateUsuario(username, data) {
  const updateFields = { $set: data };
  const result = await dbCon
    .collection("users")
    .updateOne({ username }, updateFields);

  return result;
}

async function deleteUsuario(username) {
  const result = await dbCon.collection("users").deleteOne({ username });

  return result;
}

async function addToWishList(username, id) {
  const result = await dbCon
    .collection("users")
    .updateOne({ username }, { $addToSet: { wishList: id } });

  return result;
}
async function removeFromWishList(username, id) {
  const result = await dbCon
    .collection("users")
    .updateOne({ username }, { $pull: { wishList: id } });

  return result;
}

async function createJuego(data) {
  const result = await dbCon.collection("games").insertOne(data);
  return result;
}

async function getJuegos(pageNumber) {
  const PAGE_SIZE = 20;
  const GAMES_COLLECTION = dbCon.collection("games")
  const total_games = await GAMES_COLLECTION.countDocuments();
  const total_pages = Math.ceil(total_games / PAGE_SIZE);

  if (pageNumber > total_pages || pageNumber < 1) {
    return []
  }

  const SKIP_AMOUNT = (pageNumber - 1) * PAGE_SIZE;

  return await GAMES_COLLECTION
    .find()
    .skip(SKIP_AMOUNT)
    .limit(PAGE_SIZE)
    .toArray();

}

async function getJuegoById(juegoId) {
  const juegoFound = await dbCon
    .collection("games")
    .findOne({ _id: new ObjectId(juegoId) });
  return juegoFound;
}

async function autocompleteJuegosSearch(queryString) {
  const query = [
    {
      $search: {
        index: "juegosSearch",
        text: {
          query: queryString,
          path: ["nombre"],
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
    {
      $project: {
        nombre: 1,
        _id: 1,
        imagen: 1,
      },
    },
    {
      $limit: 5,
    },
  ];
  const result = await dbCon.collection("games").aggregate(query).toArray();
  return result;
}
async function getJuegosInArray(array) {
  const result = await dbCon
    .collection("games")
    .find({ _id: { $in: array.map((item) => new ObjectId(item)) } })
    .toArray();

  return result;
}

async function searchJuegos(searchParams, page_number) {
  let { queryString, minPrice, maxPrice, categoriesToFilter } = searchParams;
  const query = [];
  if (queryString && queryString.length > 0) {
    query.push({
      $search: {
        index: "juegosSearch",
        text: {
          query: queryString,
          path: ["nombre", "descripcion", "categoria"],
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    });
  }

  if (minPrice && maxPrice && maxPrice > minPrice) {
    query.push({
      $match: {
        precio: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      },
    });
  } else if (minPrice) {
    query.push({
      $match: {
        precio: {
          $gte: minPrice,
        },
      },
    });
  } else if (maxPrice) {
    query.push({
      $match: {
        precio: {
          $lte: maxPrice,
        },
      },
    });
  }

  if (categoriesToFilter && categoriesToFilter.length > 0) {
    const categoryFilters = categoriesToFilter.map((category) => ({
      categoria: category,
    }));
    query.push({
      $match: {
        $and: categoryFilters,
      },
    });
  }

  query.push({
    $skip: (page_number-1)*20
  });
  query.push({
    $limit: 20,
  });

  try{
    return await dbCon.collection("games").aggregate(query).toArray();
  }
  catch{
    return [];
  }
}

async function updateJuego(juegoId, data) {
  const updateFields = { $set: data };
  const result = await dbCon
    .collection("games")
    .updateOne({ id: juegoId }, updateFields);
  return result;
}

async function deleteJuego(juegoId) {
  const result = await dbCon
    .collection("games")
    .deleteOne({ _id: new ObjectId(juegoId) });
  return result;
}

async function getJuegoByName(juegoName) {
  const juegoFound = await dbCon
    .collection("games")
    .findOne({ name: juegoName });
  return juegoFound;
}

async function getDeseadosByUsuario(userId) {
  const deseadosFound = await dbCon
    .collection("deseados")
    .findOne({ id_usuario: userId }, { projection: { _id: 0, deseados: 1 } });
  return deseadosFound.deseados;
}

async function createNewDeseados(idusuario, idjuego) {
  const result = await dbCon
    .collection("deseados")
    .insertOne({ id_usuario: idusuario, deseados: [idjuego] });
  return result;
}

async function addToDeseados(idusuario, idjuego) {
  let result;
  if (!(await getDeseadosByUsuario(idusuario))) {
    result = await createNewDeseados(idusuario, idjuego);
  }
  const deseados = await getDeseadosByUsuario(idusuario);
  if (deseados.includes(idjuego)) {
    return new Error("Juego ya en deseados");
  }

  result = await dbCon
    .collection("deseados")
    .updateOne({ id_usuario: idusuario }, { $push: { deseados: idjuego } });

  return result;
}

async function deleteJuegoOfDeseados(userId, juegoId) {
  const result = await dbCon.collection("deseados").updateOne(
    {
      id_usuario: userId,
    },
    {
      $pull: {
        deseados: juegoId,
      },
    }
  );
  return result;
}

async function createPublicacion(data) {
  const result = await dbCon.collection("publicaciones").insertOne(data);
  return result;
}

async function getPublicaciones() {
  const result = await dbCon.collection("publicaciones").find().toArray();
  return result;
}

async function getPublicacionById(id) {
  const publicacionFound = await dbCon
    .collection("publicaciones")
    .findOne({ _id: new ObjectId(id) });
  console.log(publicacionFound);
  return publicacionFound;
}

async function updatePublicacion(id, data) {
  const updateFields = { $set: data };
  const result = await dbCon
    .collection("publicaciones")
    .updateOne({ _id: new ObjectId(id) }, updateFields);
  return result;
}

async function deletePublicacion(id) {
  const result = await dbCon
    .collection("publicaciones")
    .deleteOne({ _id: new ObjectId(id) });
  return result;
}
//Chat Functions
async function SendMessage(data) {
  const result = await dbCon.collection("messages").insertOne(data);
  return result;
}
async function GetMessages() {
  const result = await dbCon.collection("messages").find().toArray();
}
async function GetMessageById(id) {
  const result = await dbCon
    .collection("messages")
    .findOne({ _id: new ObjectId(id) });
  return result;
}
async function GetMessageBySender(sender) {
  const result = await dbCon.collection("messages").find({ sender }).toArray();
  return result;
}
async function GetMessageByReceiver(receiver) {
  const result = await dbCon
    .collection("messages")
    .find({ receiver })
    .toArray();
  return result;
}
async function GetChat(user1, user2) {
  const result = await dbCon
    .collection("messages")
    .find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    })
    .sort({ timestamp: -1 })
    .toArray();
  return result;
}
async function GetChats(username) {
  const pipeline = [
    {
      $match: {
        $or: [{ from: username }, { to: username }],
      },
    },
    {
      $group: {
        _id: null,
        usuarios: {
          $addToSet: {
            $cond: {
              if: { $eq: ["$from", username] },
              then: "$to",
              else: "$from",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        usuarios: 1,
      },
    },
  ];
  const result = await dbCon
    .collection("messages")
    .aggregate(pipeline)
    .toArray();
  return result[0].usuarios;
}
module.exports = {
  createUsuario,
  getUsuarios,
  getUsuarioByPublicKey,
  getUsuarioByUsername,
  loginUsuario,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  addToWishList,
  removeFromWishList,
  getJuegosInArray,
  createJuego,
  getJuegos,
  getJuegoById,
  searchJuegos,
  autocompleteJuegosSearch,
  updateJuego,
  deleteJuego,
  getJuegoByName,
  getDeseadosByUsuario,
  createNewDeseados,
  addToDeseados,
  deleteJuegoOfDeseados,
  createPublicacion,
  getPublicaciones,
  getPublicacionById,
  deletePublicacion,
  updatePublicacion,
  SendMessage,
  GetMessages,
  GetMessageById,
  GetMessageBySender,
  GetMessageByReceiver,
  GetChat,
  GetChats,
};
