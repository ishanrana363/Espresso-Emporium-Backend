const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI || "mongodb+srv://emproium:qUa1p1FDEmfnFpex@cluster0.zuvfpqu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
    socketTimeoutMS: 45000, // Increase timeout to 45 seconds
});

async function run() {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        const database = client.db("emporium");
        const coffeeCollection = database.collection("coffee");



        // POST endpoint to add a coffee item
        app.post("/coffee", async (req, res) => {
            const reqBody = req.body;
            try {
                const result = await coffeeCollection.insertOne(reqBody);
                res.status(201).send(result);
            } catch (error) {
                console.error("Error inserting coffee:", error);
                res.status(500).send({ error: "Failed to insert coffee" });
            }
        });
        app.get("/coffee", async (req, res) => {
            try {
                const result = await coffeeCollection.find().toArray();
                res.send(result);
            } catch (error) {
                console.error("Error fetching coffee:", error);
                res.status(500).send({ error: "Failed to fetch coffee" });
            }
        });




        console.log("Connected to MongoDB and routes are set up!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
run().catch(console.dir);
app.get("/", (req, res) => {
    res.send("Welcome to the Emporium API!");
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
