#!/usr/bin/env node
require('../core')()

class ExpressSetup {

    // construct Statham object
    // open json object files and assign to data object
    constructor(app, express) {

        this.app = app
        this.express = express

    }

    init() {

        this.app.use(this.express.static('js'))
        this.app.use(this.express.static('img'))
        this.app.use(this.express.static('css'))
        this.app.use(this.express.static('downloads'))
        this.app.use(this.express.static('node_modules'))

        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            next();
        });

    }

}

module.exports = ExpressSetup
