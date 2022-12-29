const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rzk36ti.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const postCollection = client.db('clickBay').collection('post');
        const aboutCollection = client.db('clickBay').collection('about');

        app.post('/addPost', async(req, res) => {
            const query = req.body;
            const result = await postCollection.insertOne(query);
            res.send(result);
        });

        app.get('/myMedia', async(req, res) => {
            const query = {}
            const cursor = await postCollection.find(query).toArray();
            res.send(cursor);
        });

        app.get('/about', async(req, res) => {
            const query = {}
            const cursor = await aboutCollection.find(query).toArray();
            res.send(cursor);
        });

        app.put('/about/:id', async(req, res) => {
            const id = req.params.id;
            const query = req.body;
            console.log(query);
            const filter = {_id: ObjectId(id)}
            const options = { upsert: true };
            const updateDoc = {
                $set: query
            }
            const result = await aboutCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });
    }
    finally{
        
    }
}
run().catch(error => console.error(error));
app.get('/', async(req, res) => {
    res.send('ClickBay server is running')
});

app.listen(port, () => console.log(`ClickBay server running on ${port}`));