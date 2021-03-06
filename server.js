const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const expressWinston = require('express-winston');
const winston = require('winston');

const port = process.env.PORT || 8080;

const remindersRoutes = require('./routes/remindersRoutes');
const userRoutes = require('./routes/userRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authenticateUser = require('./routes/authenticateUser');

const config = require('./helpers/config');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(expressWinston.logger({
    format: winston.format.json,
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

// app.use((req, res, next) => {
//     console.log('Params: ', req.params);
//     console.log('Path: ', req.path);
//     console.log('Query: ', req.query); 
//     console.log('Headers: ', req.headers); 
//     console.log('Method: ', req.method); 
//     console.log('Body: ', req.body);
//     console.log('💎 💎 💎 💎 💎 💎 💎 💎 💎 💎 💎'); 
//     next();
// });

app.use((req, res, next) => {
    // console.log("req.originalUrl", req.originalUrl);
    // console.log("req._parsedUrl.pathname", req._parsedUrl.pathname);
    
    // VERIFY TOKEN HERE UNLESS ROUTE IS /authenticate or POST /users
    if (req._parsedUrl.pathname === ('/authenticate')) {
        return next();
    } 

    if (req._parsedUrl.pathname === ('/health')) {
        return next();
    } 
    
    if (req.originalUrl === '/users' && req.method === 'POST') {
        return next();
    }
    
    // check header or url parameters or post parameters for token
    const token = req.headers['x-user-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                return res.json({ auth: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token, return an error
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});

app.use('/authenticate', authenticateUser); // If the email and password are valid - create a token and pass that back
app.use('/health', healthRoutes);
app.use('/users', userRoutes);
app.use('/reminders', remindersRoutes);

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
}));

// error handling here after you ve called all the routes
app.use((req, res) => {
    res.status(404).json();
});

// 50x
/* eslint-disable no-unused-vars */
app.use((err, req, res, next) => {
    res.send(err.statusCode).json(err);
});

module.exports = app;
