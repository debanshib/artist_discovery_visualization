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


app.listen(process.env.PORT || 3000, function(){
  console.log("SERVER listening on port", this.address().port, app.settings.env);
   // console.log("SERVER listening on port");
});