#!/usr/bin/env node
var port;

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter port: (3000 is default)\n", function(enteredport) {
    if (enteredport == '') {
        port = process.env.PORT || 3000;
    } else {
        port = enteredport;
    }
    rl.close();
});

rl.on("close", function() {

    let Blackbeard = require('./blackbeard')
    // file system module to perform file operations
    const fs = require('fs');
    function sleep(millis) {
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    var express = require('express');
    var app = express();
    var http = require('http').Server(app);
    var io = require('socket.io')(http, {
        pingInterval: 1000,
        pingTimeout: 3000
    });

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/index.html');
    });

    console.log("\n/// Initialising");
    console.log("\n/// Starting http server on port " + port);


    app.use(express.static('js'))
    app.use(express.static('img'))
    app.use(express.static('node_modules'))

    io.sockets.on('connection', function(socket) {

        console.log(Math.floor(Date.now() / 1000) + ": New connection");
        socket.on('checkping', function(msg) {
            // get info
            Blackbeard.getTorrents(function(res) {
                // console.log(res.torrents)
                    io.emit('update', res.torrents);
            })
        });
        socket.on('disconnect', function() {
            console.log(Math.floor(Date.now() / 1000) + ": " + 'Disconnected');
        });

    });

    http.listen(port, function() {
        console.log(Math.floor(Date.now() / 1000) + ": " + 'listening on *:' + port);
    });

});
