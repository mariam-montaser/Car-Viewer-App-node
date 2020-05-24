const fs = require('fs');
const path = require('path');

const Client = require('mongodb').MongoClient;
const parser = require('csv-parse/lib/sync');

const config = require('./config');

let mongoClient;


Client.connect(`mongodb://${config.dbHost}`, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
    mongoClient = client;
    const db = client.db(config.dbName);
    const collection = db.collection(config.collection);
    return collection;
}).then(collection => {
    const data = fs.readFileSync(path.join(__dirname, config.dataFile), 'utf8');
    const documents = parser(data, { columns: true, skip_empty_lines: true });

    collection.insertMany(documents, error => {
        if (error) {
            throw error;
        }
        console.log(`data inserted successfully in ${config.collection}`);
        mongoClient.close();
    })
}).catch(error => {
    console.log(`an error occured ${error}`)
})