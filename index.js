const express = require('express');
const { MongoClient, Collection } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Lamphub server is running")
})

app.listen(port, () => {
    console.log("Running port on ", port);
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.agixt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri);

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');
        const database = client.db("LampHubDB");
        const productsCollection = database.collection("products");
        const bookingsCollection = database.collection("bookings");
        const reviewsCollection = database.collection("reviews");


        //-------------------------- Product API ------------------------------//

        // GET API
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const allProducts = await cursor.toArray();
            res.send(allProducts);
        });


        //POST API
        app.post('/products', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result)
        });

        // DELETE API 
        app.delete("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });
        //-------------------------- Review API ------------------------------//

        // GET API
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const allReviews = await cursor.toArray();
            res.send(allReviews);
        });


        //POST API
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            console.log(review);
            const result = await reviewsCollection.insertOne(review);
            console.log(result);
            res.json(result)
        });



        //-------------------------- Booking API ------------------------------//


        // GET API 

        app.get('/bookings', async (req, res) => {
            const cursor = bookingsCollection.find({});
            const allBookings = await cursor.toArray();
            res.send(allBookings);
        });

        // GET API for any specific Booking

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const booking = await bookingsCollection.findOne(query);
            console.log('load booking with id: ', id);
            res.send(booking);
        });

        //POST API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log(booking);

            const result = await bookingsCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        });

        // DELETE API 
        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingsCollection.deleteOne(query);
            res.json(result);
        });

        //UPDATE API 
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedBooking = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedField = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingsCollection.updateOne(filter, updatedField, options)
            console.log('updated', id)
            res.json(result)
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);