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
        const userCollection = client.db('emporium').collection('users');

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

        app.get("/coffee", async function(req,res){
            const result = await coffeeCollection.find().toArray();
            res.send(result);
        });

        app.put("/coffee/:id", async function(req,res){
            const id = new ObjectId(req.params.id);
            const data = req.body;
            const result = await coffeeCollection.updateOne({_id: id}, {$set: data});
            res.send(result);
        });

        app.delete("/coffee/:id", async function(req,res){
            const id = new ObjectId(req.params.id);
            const result = await coffeeCollection.deleteOne({_id: id});
            res.send(result);
        });

        // user related api

        app.post("/user", async function(req,res){
            const data = req.body;
            const result = await userCollection.insertOne(data);
            res.send(result);
        });

        app.get("/user",async (req,res)=>{
            const result = await userCollection.find().toArray();
            res.send(result);
        });

        app.delete("/user/:id", async function(req,res){
            const id = new ObjectId(req.params.id);
            const result = await userCollection.deleteOne({_id: id});
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