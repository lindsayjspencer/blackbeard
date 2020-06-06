#!/usr/bin/env node
require('./core')()

lg("Initialising");

const { express, app, http, io } = require('./scripts/express-core')

lg("Loaded server and socket.io libraries");

let ExpressSetup = require('./scripts/express-setup')
new ExpressSetup(app, express).init()

lg("http server config initialised");

let ExpressRoutes = require('./scripts/express-routes')
new ExpressRoutes(app).init()

lg("http routes activated");

let SocketRoutes = require('./scripts/socket-routes')
new SocketRoutes(io).init()

lg("Socket routes activated");
