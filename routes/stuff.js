const express = require('express');
const router = express.Router();
const MongoUtils = require('../mongo');
let mongoClient = new MongoUtils();
let db;
const controllerStuff = require('../controllers/stuff');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')

mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
    }
);

router.get('/', controllerStuff.getAll)

router.get('/:id', controllerStuff.getOne)

router.post('/', auth, multer, controllerStuff.createOne)

router.put('/:id', auth, multer, controllerStuff.updateOne)

router.delete('/:id', auth, controllerStuff.deleteOne)

module.exports = router;