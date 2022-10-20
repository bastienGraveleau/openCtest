const MongoUtils = require('../mongo');
let mongoClient = new MongoUtils();
const { ObjectID } = require('bson');
let db;

mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
    }
);
exports.getAll = async function(req, res) {
    const objects = await db.collection("object").find().toArray()
    res.status(200).json(objects);
};
exports.getOne = async function(req, res) {
    const object = await db.collection("object").findOne({_id:ObjectID(req.params.id)});
    res.status(200).json(object);
};
exports.createOne = async function(req, res) {
    console.log(req.body);
    if (req.body.thing) {
        req.body = JSON.parse(req.body.thing)
    }
    console.log(req.body);
    req.body._id = new ObjectID() 
    req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    const objectsAdd = await db.collection("object").insertOne(req.body).catch((err)=>  {
        console.log("fferr",err.errInfo.details.schemaRulesNotSatisfied);
    });
    res.status(200).json(objectsAdd);
};
exports.updateOne = async function(req, res) {
    console.log(req.body)
    console.log(req.body);
    if (req.body.thing) {
        req.body = JSON.parse(req.body.thing)
    }
    req.body.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    delete req.body._id;
    const objectsModif = await db.collection("object").updateOne({ _id: new ObjectID(req.params.id) }, { $set : req.body});
    res.status(200).json(objectsModif);
};
exports.deleteOne = async function(req, res) {
    const id = new ObjectID(req.params.id)
    const objectsDelete = await db.collection("object").deleteOne({_id:id})
    res.status(200).json(objectsDelete)
};