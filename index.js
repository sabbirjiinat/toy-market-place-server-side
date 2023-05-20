const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


    const indexKey = { name: 1 }
    const indexOption = { names: 'toyName' }
    await allToyCollection.createIndex(indexKey, indexOption)

    app.get('/searchByName/:text', async (req, res) => {
      const text = req.params.text;
      const result = await allToyCollection.find({
        name: { $regex: text, $options: 'i' }
      }).toArray()
      res.send(result)
    })



    //   all toy
    app.get('/toys', async (req, res) => {
      const result = await allToyCollection.find().toArray();
      res.send(result)
    })

    app.get('/myToys', async (req, res) => {
      let query = {};
      if (req.query?.sellerEmail) {
        query = { sellerEmail: req.query.sellerEmail }

      } else if (req.query.SubCategory) {
        query = { SubCategory: req.query.SubCategory }

      }
      const result = await allToyCollection.find(query).toArray()
      res.send(result)

    })



    app.get('/toys/:id', async (req, res) => {
      const text = req.params.id;
      const query = { _id: new ObjectId(text) }
      const result = await allToyCollection.findOne(query)
      res.send(result)


    })




    app.post('/toys', async (req, res) => {
      const toys = req.body;
      const result = await allToyCollection.insertOne(toys)
      res.send(result)
    })


    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const toyData = req.body;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToy = {
        $set: {
          price: toyData.price,
          description: toyData.description,
          quantity: toyData.quantity
        },
      };
      const result = await allToyCollection.updateOne(filter, updatedToy, options)
      res.send(result)
    })


    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await allToyCollection.deleteOne(query)
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