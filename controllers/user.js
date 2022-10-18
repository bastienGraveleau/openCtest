const bcrypt = require('bcrypt'); 
const MongoUtils = require('../mongo');
let mongoClient = new MongoUtils();
let db;

mongoClient.dbConnect().then(
    (dbconnected) => {

        db = dbconnected
    }
);

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(async hash => {
      const user = {
        password: hash,
        email: req.body.email
      };
      const userCreated = await db.collection('users').insertOne(user);
      res.status(201).json({ message: 'Utilisateur créé !' })
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    db.collection('users').findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                }
                res.status(200).json({ 
                    userId: user._id,
                    token: 'TOKEN'
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};