const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const router = express.Router();


router.get('/filter', (req, res) => {
    const fields = ['model', 'make', 'year'];
    const dbRequests = fields.map(field => {
        console.log(field)
        return req.collection.distinct(field).then(data => {
            console.log(field)
            return ({ field, data: data.sort() })
        })
    })
    console.log(dbRequests)

    Promise.all(dbRequests).then(results => {
        const reducedResult = results.reduce((acc, { field, data }) => {
            return ({ ...acc, [field]: data })
        }, {})
        res.json(reducedResult)
    }).catch(error => {
        res.send(error)
    })
})

router.get('/filter/:type/:value', (req, res) => {
    console.log('here')
    const { type, value } = req.params;
    console.log(type, value)
    req.collection.find({ [type]: value }).toArray().then(results => {
        res.json(results)
    }).catch(error => {
        res.send(error)
    })
})

router.get('/cars', (req, res) => {
    req.collection.find().toArray().then(results => {
        if (results) {
            res.status(200).json(results);
        }
    }).catch(error => {
        if (error) {
            res.status(500).send(error);
        }
    })
})

router.get('/cars/:id', (req, res) => {
    const _id = ObjectId(req.params.id);
    req.collection.findOne({ _id }).then(result => {
        res.status(200).json(result);
    }).catch(error => {
        res.status(500).send(error);
    })
})

module.exports = router;