const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || '1777';

// Set Cors Header
app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();  
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set our api routes
app.use('/api', require('./server/controller/routes.controller.js'));

// SOCKET CONNECTION
require('./server/controllers/netsock.controller.js')(io);

// Point static path to dist
app.use(express.static(path.join(__dirname, 'build')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'));
});

// start app
app.listen(port);

// User message
console.log('Application is open on port ' + port);