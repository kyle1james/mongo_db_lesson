import express from 'express';

const bodyParser = require('body-parser');

const app = express();
const port = 4000;
// read form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// dotenv
require('dotenv').config();
// NASA API KEY
const NasaApiKey = process.env.NASA;
const mongopass = process.env.MONGOPASS;
const dbname = process.env.DBNAME;
const username = process.env.USERNAME;
// node fetch
const fetch = require('node-fetch');
// listen
app.listen(port, () => console.log('Running on port 4000'));
// mongodb
const { MongoClient } = require('mongodb');

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

const uri = `mongodb+srv://${username}:${mongopass}@cluster0.3uy96.mongodb.net/<dbname>?retryWrites=true&w=majority`;
MongoClient.connect(uri, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to Database');
    const db = client.db('mapApp');
    const locationNotes = db.collection('locationNotes');

    // POST
    app.get('/location/:lat/:lon/:notes', async (req, res) => {
      const { lat, lon, notes } = req.params;
      console.log(lat, lon, notes);
      console.log('noootteesss', notes);
      locationNotes.insertOne({ lat, lon, notes });
      res.redirect('/');
    });

    // READ
    app.get('/show', (req, res) => {
      console.log('get');
      // Read from DB
      db.collection('locationNotes').find().toArray()
        .then((results) => {
          console.log(results);
          res.json(results);
        })
        .catch((err) => console.log(err));
    });
  })
  .catch((error) => console.error(error));
