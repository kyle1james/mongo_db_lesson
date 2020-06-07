import express from 'express';
// for how we send json, i.e not from a form.
const bodyParser = require('body-parser');

const app = express();
const port = 4000;
app.use(bodyParser.json());
app.use(express.static('public'));
// dotenv
require('dotenv').config();
// listen
app.listen(port, () => console.log('Running on port 4000'));
// mongodb globals
const { MongoClient } = require('mongodb');

const mongopass = process.env.MONGOPASS;
const username = process.env.USERNAME;
const { ObjectId } = require('mongodb');
// home
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});
// connect to db
const uri = `mongodb+srv://${username}:${mongopass}@cluster0.3uy96.mongodb.net/<dbname>?retryWrites=true&w=majority`;
MongoClient.connect(uri, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('mapApp');
    const locationNotes = db.collection('locationNotes');

    // POST
    app.get('/location/:lat/:lon/:notes', async (req, res) => {
      const { lat, lon, notes } = req.params;
      locationNotes.insertOne({ lat, lon, notes });
      res.redirect('/');
    });
    // PUT
    app.post('/update', (req, res) => {
      const data = req.body;
      console.log(data);
      locationNotes.findOneAndUpdate(
        { _id: ObjectId(data.id) },
        {
          $set: {
            notes: data.note,
          },
        },
      );
      res.redirect('/');
    });

    // READ
    app.get('/show', (req, res) => {
      // Read from DB
      db.collection('locationNotes').find().toArray()
        .then((results) => {
          res.json(results);
        })
        .catch((err) => console.log(err));
    });
  })
  .catch((error) => console.error(error));
