const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware  
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuvfpqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // Connect the client to the server    (optional starting in v4.7)
        // await client.connect();

        const coffeeCollection = client.db('emporium').collection('coffee');

        // coffe related api

        app.post("/coffee",async function(req,res){
            const data = req.body;
            const result = await coffeeCollection.insertOne(data);
            res.send(result);
        });

        app.get("/coffee/:id", async function(req,res){
            const id = new ObjectId(req.params.id);
            const result = await coffeeCollection.findOne({_id: id});
            res.send(result);
        });



        



        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is ok');
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});