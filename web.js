#!/usr/bin/env node
var port = process.env.PORT || 4000;

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

app.get('/pause', function(req, res) {
    Blackbeard.getAll(function(){
        Blackbeard.pauseAll()
        res.sendStatus(200)
    })
});

console.log("\n/// Initialising");
console.log("\n/// Starting http server on port " + port);


app.use(express.static('js'))
app.use(express.static('img'))
app.use(express.static('css'))
app.use(express.static('node_modules'))

io.sockets.on('connection', function(socket) {

    console.log(Math.floor(Date.now() / 1000) + ": New connection");
    socket.on('checkping', function(msg) {
        // get info
        Blackbeard.getTorrents(function(res) {
            // console.log(res.torrents)
            var msg = {
                torrents: []
            }
            var _tor
            res.torrents.forEach((tor)=>{
                _tor = {
                    id: tor.id,
                    leftUntilDone: tor.leftUntilDone,
                    status: tor.status,
                    rateDownload: tor.rateDownload,
                    percentDone: tor.percentDone
                }
                msg.torrents.push(_tor)
            })
            io.emit('update', msg);
        })
    });
    socket.on('sendList', function(msg) {
        // get info
        Blackbeard.getTorrents(function(res) {
            // console.log(res.torrents)
            var msg = {
                torrents: []
            }
            var _tor
            res.torrents.forEach((tor)=>{
                _tor = {
                    name: tor.name,
                    id: tor.id,
                    leftUntilDone: tor.leftUntilDone,
                    status: tor.status,
                    rateDownload: tor.rateDownload,
                    percentDone: tor.percentDone
                }
                msg.torrents.push(_tor)
            })
            io.emit('torrentList', msg);
        })
    });
    socket.on('disconnect', function() {
        console.log(Math.floor(Date.now() / 1000) + ": " + 'Disconnected');
    });
    socket.on('pause', function() {
        Blackbeard.getAll(function(){
            Blackbeard.pauseAll()
            io.emit('msg', 'paused all')
        })
    });
    socket.on('start', function() {
        Blackbeard.startAll()
        io.emit('msg', 'started all')
    });
    socket.on('remove', function() {
        Blackbeard.getAll(function(){
            Blackbeard.removeAll()
            io.emit('msg', 'removed all')
        })
    });

});

http.listen(port, function() {
    console.log(Math.floor(Date.now() / 1000) + ": " + 'listening on *:' + port);
});
