const path = require('path');

const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const config = require('./config');
const indexRouter = require('./routes/index.route');

const app = express();

MongoClient.connect(`mongodb://${config.dbHost}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
    mongoClient = client;
    const db = client.db(config.dbName);
    const collection = db.collection(config.collection);
    app.locals[config.collection] = collection;
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
    const collection = req.app.locals[config.collection];
    req.collection = collection;
    next();
})

app.use('/', indexRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('server is running.');
})

