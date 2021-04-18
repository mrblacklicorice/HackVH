var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
app.use(express.static("C:/Users/giris/Repos/HackVH/"));
// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile("C:/Users/giris/Repos/HackVH" + '/index.html');
});

app.listen(8080);
