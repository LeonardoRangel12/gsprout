require('dotenv').config();
const {MongoClient} = require( 'mongodb' );

function connectDb (){
    console.log("h2")
    const _url = process.env.MONGODB_URI;
    const _database = process.env.MONGODB_DATABASE_NAME;
    
    const client = new MongoClient(_url);
    client.connect();

    return client.db(_database, { useUnifiedTopology: true })
}


module.exports = { connectDb };