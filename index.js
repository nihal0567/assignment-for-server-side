const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ue9fgze.mongodb.net/?appName=Cluster0`;

console.log(uri);
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
   // await client.connect();

    const db = client.db("assignment-server-side");
    const dataCollection = db.collection("collections");
   

    app.get("/collections", async (req, res) => {
      const projectFields = { created_at: 1 };
      const result = await dataCollection
        .find()
        .sort({ created_at: 1 })
        .toArray();

      res.send(result);
    });

        app.get('/collections-amount', async (req, res) => {
        const result = await dataCollection.find().toArray()

        const totalIncome = result.filter(item=> item.situation === "income").reduce((sum, item)=> sum + parseFloat(item.amount), 0)

        const totalExpense = result.filter(item=> item.situation === "expense").reduce((sum, item)=> sum + parseFloat(item.amount), 0)
 
        const totalBalance= totalIncome - totalExpense
        res.send({
            totalBalance,
            totalIncome,
            totalExpense,

        })
    })


    app.get("/collections", async (req, res) => {
      const cursor = dataCollection.find(
        {},
        { projection: { situation: 1, _id: 0 } }
      );
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/collections", async (req, res) => {
      // const email = req.query.email;
      // const query = {};
      // if (email) {
      //   query.email = email;
      // }

      console.log(req.query);
      const cursor = dataCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/collections/:id", async (req, res) => {
      const { id } = req.params;
      const result = await dataCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        success: true,
        result,
      });
    });

    app.post("/collections", async (req, res) => {
      const data = req.body;
      data.created_at = new Date();

      const result = await dataCollection.insertOne(data);
      res.send({ success: true, result });
    });

    app.put("/collections/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const filter = { _id: new ObjectId(id) };
      const update = {
        $set: data,
      };
      const result = await dataCollection.updateOne(filter, update);

      res.send({
        success: true,
        result,
      });
    });

    app.delete("/collections/:id", async (req, res) => {
      const { id } = req.params;

      const filter = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(filter);

      res.send({
        success: true,
        result,
      });
    });

    // Send a ping to confirm a successful connection
  //  await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //  await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
