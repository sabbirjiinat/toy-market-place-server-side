const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;



//middleware
app.use(cors())
app.use(express.json())

// electronicToy  PJRUfVWsYg9S792C



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9a4nghi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      
      const toyGalleryCollection = client.db('electronicToyDB').collection('toyGallery')
      const allToyCollection = client.db('electronicToyDB').collection('electronicToys')


    //   Toy Gallery 
      app.get('/toyGallery', async (req, res) => {
          const result = await toyGalleryCollection.find().toArray()
          res.send(result)
      })

    //   all toy
      
      app.post('/toys', async (req, res) => {
          const toys = req.body;
          const result = await allToyCollection.insertOne(toys)
          res.send(result)
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("Electronic toy world server site is running")
})

app.listen(port, () => {
    console.log(`Electronic toy world is running on port : ${port}`);
})