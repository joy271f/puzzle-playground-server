const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krjt8gu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // create DB
    const allToysCollection = client.db("toysDB").collection("all_toys");

    // read/find All Toys after POST
    app.get("/toys", async (req, res) => {
      const cursor = allToysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // read Single toy by id
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.findOne(query);
      res.send(result);
    });

    // some data
    app.get("/toys-email", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await allToysCollection.find(query).toArray();
      res.send(result);
    });

    // post/create
    app.post("/toy", async (req, res) => {
      const toys = req.body;
      const result = await allToysCollection.insertOne(toys);
      res.send(result);
    });

    // update
    app.put("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateToy = req.body;
      const toy = {
        $set: {
          product_name: updateToy.product_name,
          photo: updateToy.photo,
          name: updateToy.name,
          email: updateToy.email,
          category: updateToy.category,
          price: updateToy.price,
          rating: updateToy.rating,
          quantity: updateToy.quantity,
          description: updateToy.description,
        },
      };
      const result = await allToysCollection.updateOne(
        filter,
        toy,
        options
      );
      res.send(result);
    });

    // delete
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allToysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Puzzle Server Running ...");
});

app.listen(port, () => {
  console.log(`Puzzle Server Running on port ${port}`);
});
