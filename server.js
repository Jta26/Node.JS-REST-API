var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
 
var databaseConfig = require('./config/database');
var router = require('./routes');

//Connects to the MongoDB
mongoose.connect("mongodb://jta:google@ds157282.mlab.com:57282/club-stack");

//Opens the port on the express server.
app.listen(process.env.PORT || 8081);
//Logs that the express server has been started.
console.log("App listening on port 8080");

app.use(bodyParser.urlencoded({ extended: false })); // Parses urlencoded bodies of information
app.use(bodyParser.json()); // Send JSON responses
app.use(logger('dev')); // Log requests to API using morgan
app.use(cors());
 
router(app); //Passes the Express app along to the router.