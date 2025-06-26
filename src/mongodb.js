
import { MongoClient, ServerApiVersion } from 'mongodb';
import { resume, user } from './common/dataTemplates';
import { v4 as uuidv4 } from 'uuid';
const uri = "mongodb+srv://resume-app-user-1:MIti0GaJbJsLyLBY@resume-gen-cluster.psz7h7g.mongodb.net/?retryWrites=true&w=majority&appName=resume-gen-cluster";
const dbName = "resume_builder";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

export async function createUserResume(currentResume) {
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection('resumes');
    const data = {
      ...resume,
      _id: uuidv4(),
      userId: currentResume.userId,
      firstName: currentResume.firstName,
      lastName: currentResume.lastName,
      jobTitle: currentResume.jobTitle
    };
    const result = await collection.insertOne(data);
    console.log(`Resume created with id: ${result.insertedId}`);
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    await client.close();
  }
}
