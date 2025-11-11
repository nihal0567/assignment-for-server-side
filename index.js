const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port =  3000


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ue9fgze.mongodb.net/?appName=Cluster0`;

console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db('assignment-server-side')
    const dataCollection = db.collection('collections')
    

    app.get('/collections', async(req, res)=>{

      const result=await dataCollection.find().toArray()

      res.send(result)
    })
    
    app.post('/collections', async(req, res)=>{

      const data = req.body;

      const result = await dataCollection.insertOne(data)
      res.send({success: true, result})
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  //  await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})