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

function defineSortingObject(sortingType) {
  let sortingObject =  {};

  switch (sortingType) {
    case "alphabetic":
      sortingObject = { nombre: 1, peak_ccu: -1 }
      break
    case "priceAsc": 
      sortingObject = { precio: 1, peak_ccu: -1 }
      break;
    case "priceDesc": 
      sortingObject = { precio: -1, peak_ccu: -1 }
      break;
    case "default": 
      sortingObject = {default: true}
      break;  
    default:
      console.log("Sorting by peak_ccu")
      sortingObject = { peak_ccu: -1 }
      break;
  }

  return sortingObject;
}

async function getJuegos(pageNumber, sortingType) {
  const PAGE_SIZE = 20;
  const GAMES_COLLECTION = dbCon.collection("games");
  const total_games = await GAMES_COLLECTION.countDocuments();
  const total_pages = Math.ceil(total_games / PAGE_SIZE);

  if (pageNumber > total_pages || pageNumber < 1) {
    return [];
  }

  const sortingObject = defineSortingObject(sortingType);

  const SKIP_AMOUNT = (pageNumber - 1) * PAGE_SIZE;

  return await GAMES_COLLECTION.find()
    .sort(sortingObject)
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

async function searchJuegos(searchParams, page_number, sortingType) {
  let { queryString, minPrice, maxPrice, categoriesToFilter } = searchParams;
  console.log("page_number", page_number, "sortingType", sortingType)
  console.log("queryStr", queryString, "minPrice", minPrice, "maxPrice", maxPrice, "categoriesToFilter", categoriesToFilter)
  const query = [];

  const sortingObject = defineSortingObject(sortingType);

  if (queryString && queryString.length > 0) {
    console.log("Searching by query string")
    query.push({
      $search: {
        index: "juegosSearch",
        text: {
          query: queryString,
          path: ["nombre", "descripcion", "descripcion_corta", "categoria"]
          // fuzzy: {
          //   maxEdits: 2,
          // },
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

  if (!sortingObject.default === true) {
    query.push({$sort: sortingObject});
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
  catch (err){
    console.log("Error in searchJuegos:", err)
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
async function GetChat(user1, user2, page_number) {
  console.log("page_number", page_number)
  const result = await dbCon
    .collection("messages")
    .find({
      $or: [
        { from: user1, to: user2 },
        { from: user2, to: user1 },
      ],
    })
    .skip((page_number-1)*20)
    .limit(20)
    .sort({ timestamp: -1 })
    .toArray();
  return result;
}

async function GetChats(username, page_number) {
  console.log("page_number", page_number)
  const pipeline = [
    {
      $match: {
        $or: [{ from: username }, { to: username }],
      },
    },
    // { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: "$timestamp",
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
      $sort: { _id: -1 },
    },
    {
      $project: {
        _id: 0,
        usuarios: 1,
      },
    },
    {
      $skip: (page_number-1)*20
    },
    {
      $limit: 20,
    }
  ];
  let result;
  try{
    result = await dbCon
    .collection("messages")
    .aggregate(pipeline)
    .toArray();
  }catch{ return []}

  if (result.length == 0) return [];
  
  // Flatten the array of arrays and remove duplicates
  const users = result.flatMap(obj => obj.usuarios);

  const uniqueUsers = [...new Set(users)];
  return uniqueUsers;
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
