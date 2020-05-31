#!/usr/bin/env node
require('../core')()

class ExpressSetup {

    // construct Statham object
    // open json object files and assign to data object
    constructor(app) {

        this.app = app

    }

    init() {

        this.app.get('/', function(req, res) {
            res.sendFile( path.join(__dirname, '../public', '/index.html') );
        });

        this.app.get('/get-all-shows', function(req, res) {
            res.sendFile(path.join(__dirname, '../json', '/objects/all-shows.json') );
        });

    }

}

module.exports = ExpressSetup
