const mongo = require('mongodb');

const new_db = "mongodb://localhost:27017/testopenclass";
let db ;
let mongoClient


module.exports = class MongoUtils {
    constructor(){};
    dbConnect(){
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db)
            }
            else {
                mongo.MongoClient.connect(new_db , function(error , client){
                    if (error){
                        console.error('error of connecting', new_db)
                        reject(error)
                    }
                    console.log("connected to database successfully");
                    db = client.db("testopenclass");
                    mongoClient = client ;
                    resolve(db) ;
                });
            }
            process.on("exit", (code) => {
                this.dbClose()
            })
        });
    };
    dbClose(){
        if (mongoClient) {
            mongoClient.close();
        }
    }
    getDB(){
        return db 
    }
    getMongoClient(){
        return mongoClient
    }
};