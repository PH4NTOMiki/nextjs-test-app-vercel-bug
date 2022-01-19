import * as mongo from 'mongodb';

/**
 * @type {mongo.MongoClient}
 */
let client = null;
/**
 * @type {mongo.Db}
 */
let db = null;
export async function connectToDB() {
  if(!client) {
    client = await mongo.MongoClient.connect(process.env.MONGODB_URI);
    db = client.db("sveltekit1");
  }
  return { client, db }
}