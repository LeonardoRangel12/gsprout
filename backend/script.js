
const { MongoClient, ObjectId } = require("mongodb");
const MONGODB_URI='mongodb+srv://admin:PC6rFlwGB3CZcacD@gsprout.zsasdol.mongodb.net/?retryWrites=true&w=majority&appName=gsprout'
const MONGODB_DATABASE_NAME= "gsprout"
const _url = MONGODB_URI;
const _database = MONGODB_DATABASE_NAME;


async function dbConnectionWrapper(functionWrapped) {
  const client = new MongoClient(_url);
  await client.connect();
  dbCon = client.db(_database, { useUnifiedTopology: true });
  const result = await functionWrapped(dbCon);
  await client.close();
  return result;
}

async function getUsuarios(searchParams) {
    juegos = await dbConnectionWrapper(async (dbCon) => {
      const {queryString, minPrice, maxPrice, categoriesToFilter} = searchParams;
      console.log(searchParams)
      console.log("query: ",queryString)
      //filter to onl get games with prices between 0 and 1
      const query = []
      if(queryString && queryString.length > 0){
        query.push(
          {
            $search: {
              index: "juegosSearch",
              text: {
                query: queryString,
                path: ['nombre', 'descripcion', "categoria"],
                fuzzy: {
                  maxEdits: 2
                }
              }
            }
          }
        )
      }

      if (minPrice && maxPrice && maxPrice > minPrice) {
          query.push({
            $match: {
              precio: {
                $gte: minPrice,
                $lte: maxPrice
              }
            }
          })  
      }else if(minPrice){
        query.push({
          $match: {
            precio: {
              $gte: minPrice
            }
          }
        })
      }else if(maxPrice){
        query.push({
          $match: {
            precio: {
              $lte: maxPrice
            }
          }
        })
      }

      if (categoriesToFilter && categoriesToFilter.length > 0) {
        const categoryFilters = categoriesToFilter.map(category => ({ "categoria": category }));
        query.push({
            $match: {
                $and: categoryFilters
            }
        });
    }


      const result = await dbCon.collection("games").aggregate(query).toArray();
      return result;
    });
    return juegos;
  }

//Here I print something

async function main(){
  searchParams = {
  //  queryString: "",
    minPrice: 0.50,
    // maxPrice: 0.12,
    // categoriesToFilter: []
  }
  const users = await getUsuarios(searchParams);
  console.log(users.length, users);
}

main();
