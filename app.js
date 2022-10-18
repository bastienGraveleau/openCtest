const express = require('express');
const stuffRoute = require('./routes/stuff');
const cors = require('cors');
const userRoutes = require('./routes/user');

const app = express();
app.use(express.json());
const MongoUtils = require('./mongo');
let mongoClient = new MongoUtils();
let db;
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/stuff', stuffRoute);
app.use('/api/auth', userRoutes);


const stuff = [
    {
      title: 'Mon premier objet',
      description: 'Les infos de mon premier objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 4900,
    },
    {
      title: 'Mon deuxième objet',
      description: 'Les infos de mon deuxième objet',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      price: 2900,
    },
  ];

mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
        db.listCollections({name: "object"}).next(async function(err, collinfo) {
            if (!collinfo) {
                await db.createCollection("object", {
                    validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        title: "Object Validation",
                        required: [ "title", "description", "imageUrl", "price" ],
                        properties: {
                            title: {
                                bsonType: "string",
                                description: "title of the object"
                            },
                            description: {
                                bsonType: "string",
                                description: "description of the object"
                            },
                            imageUrl: {
                                bsonType: "string",
                                description: "url of the object"
                            },
                            price: {
                                bsonType: "int",
                                description: "price of the object"
                            },
                            
                        }
                    } 
                    } 
                } )

                db.collection("object").insertMany(stuff);
            }
            else {
                console.log("Collection object exist")

            }
        })
        db.listCollections({name: "users"}).next(async function(err, collinfo) {
            if (!collinfo) {
                await db.createCollection("users", {
                    validator: {
                    $jsonSchema: {
                        bsonType: "object",
                        title: "Object Validation",
                        required: [ "password", "email"],
                        properties: {
                            email: {
                                bsonType: "string",
                                description: "title of the object"
                            },
                            password: {
                                bsonType: "string",
                                description: "description of the object"
                            },
                        }
                    }
                    } 
                })
            }
            else {
                console.log("Collection object exist")
            }
        })

    }    
)

module.exports = app;