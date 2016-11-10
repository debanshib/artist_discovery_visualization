'use strict'
var fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
 
var app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.static(__dirname + '/browser'));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next){
	res.sendFile(path.join(__dirname + '/index.html'))
})

var port = 3000;
app.listen(port, function() {
    console.log('SERVER listening on port: ' + port);
});