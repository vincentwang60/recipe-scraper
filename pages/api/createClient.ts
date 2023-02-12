import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_CONNECT

let client
let clientPromise: Promise<MongoClient>

if (!process.env.MONGO_CONNECT) {
  throw new Error('Please add your Mongo URI to .env.local')
}
client = new MongoClient(uri)
clientPromise = client.connect()

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise