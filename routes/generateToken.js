const jwt = require('jsonwebtoken');
const config = require('../helpers/config');

const userDB = require('../query/userDB');

module.exports = (() => {
    /* eslint-disable global-require */
    const router = require('express').Router();

    router.post('/', (req, res, next) => {
        userDB.getUserByEmail(req.body.email, (err, users) => {
            
            if (err) return next(err);
            
            if (req.body.length === 0 || req.body === undefined) {
                
                return res.status(400).res.json({ auth: false, message: 'Authentication failed. User not found.' });
            } else if (users.length === 1) {
                // check if password matches
                if (users[0].password !== req.body.password) {
                    
                    return res.status(400).res.json({ auth: false, message: 'Authentication failed. Wrong password.' });
                } else {
                    // if user is found and password is right
                    // create a token with only our given payload
                    const payload = {
                        email: users[0].email 
                    };

                    const token = jwt.sign(payload, config.secret, {
                        expiresIn: 86400 // expires in 24 hours 
                    });

                    // return the information including token as JSON
                    return res.status(200).res.json({ auth: true, message: 'Here your token!', token });
                }
            }
        });
    });

    return router;
})();