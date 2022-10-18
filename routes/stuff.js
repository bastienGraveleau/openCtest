const express = require('express');
const router = express.Router();
const MongoUtils = require('../mongo');
let mongoClient = new MongoUtils();
let db;
const controllerStuff = require('../controllers/stuff');

mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
    }
);

router.get('/', controllerStuff.getAll)

router.get('/:id', controllerStuff.getOne)

router.post('/', controllerStuff.createOne)

router.put('/:id', controllerStuff.updateOne)

router.delete('/:id', controllerStuff.deleteOne)

module.exports = router;