#!/usr/bin/env node
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    pingInterval: 1000,
    pingTimeout: 3000
});

http.listen(port, function() {
    lg(`Listening on port: ${port}`)
});

exports.express = express
exports.app = app
exports.http = http
exports.io = io
