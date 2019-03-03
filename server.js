const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = process.env.PORT || '1777';



app.use(bodyParser.json());
// Point static path to dist
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: true }));

// Set Cors Header
app.use((req, res, next) => { 
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();  
});

// Set our api routes
app.use('/api', require('./server/controller/routes.controller.js'));

// SOCKET CONNECTION
require('./server/controller/netsock.controller.js')(io);



// Catch all other routes and return the index file
/*app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build','index.html'));
});*/

// start app
//app.listen(port);
//console.log('Application is open on port ' + port);

http.listen(port, function(){ console.log('Application is open on port ' + port); });
