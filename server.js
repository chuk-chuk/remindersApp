// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var reminders = require('./models/reminders');

mongoose.connect('mongodb://localhost:27017'); //connect to DB


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
  console.log('something is happening');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.route('/reminders')

// create a reminder (accessed at POST http://localhost:8080/api/reminders)
    .post(function(req, res) {

        var reminder = new Reminder();      // create a new instance of the Reminder model
        reminder.created_at = req.body.created_at;
        reminder.text = req.body.text;  // set the reminder dates (comes from the request)
        reminder.expired_by = req.body.expired_by;

        // save the reminder and check for errors
        reminder.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Reminder created!' });
        });

    });

// get all the reminders (accessed at GET http://localhost:8080/api/reminders)
      .get(function(req, res) {
          Reminder.find(function(err, reminders) {
              if (err)
                  res.send(err);

              res.json(reminders);
          });
      });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
