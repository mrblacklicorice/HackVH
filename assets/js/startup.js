


// var http = require('http');
// var fs = require('fs');
// var server = http.createServer(function (req, res) {
//     console.log('Sending request:' + req.url);
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     var readStream = fs.createReadStream("C:/Users/giris/Repos/HackVH" + '/index.html', 'utf8');
//     readStream.pipe(res);
// });

// server.listen(3000, '127.0.0.1');
// console.log('Now listening to port 3000');



const express = require("express");
const app = express();
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile('index.html');
})

app.listen(3000, function () {
    console.log("Running on port 3000.");
});


/*

var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.get('/', function (req, res) {
    res.sendFile("C:/Users/giris/Repos/HackVH" + '/index.html');
    res.sendFile("C:/Users/giris/Repos/HackVH" + '/assets/js/index.js');
    res.sendFile("C:/Users/giris/Repos/HackVH" + '/assets/css/main.css');
});

app.listen(8080);









//load assets\js\startup.js